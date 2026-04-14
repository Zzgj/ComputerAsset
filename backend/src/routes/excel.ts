import type { Request, Response } from 'express'
import { Router } from 'express'
import multer from 'multer'
import xlsx from 'xlsx'
import { randomUUID } from 'crypto'

import { prisma } from '../prisma'
import { requireAuth, requirePermission } from '../middleware/auth'
import type { AssetTemplate, Department } from '@prisma/client'
import { AssetRecordAction, AssetStatus } from '@prisma/client'
import {
  buildDepartmentPathMap,
  computeDepartmentDisplayPath,
  departmentPathWithoutCampus,
  type DepartmentWithCampus,
} from '../utils/departmentDisplay'

type ImportTx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

async function ensureCampusByName(tx: ImportTx, nameRaw: string) {
  const name = (nameRaw || '泰鼎').trim() || '泰鼎'
  let c = await tx.campus.findUnique({ where: { name } })
  if (!c) {
    const maxSort = await tx.campus.findFirst({ orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } })
    const sortOrder = (maxSort?.sortOrder ?? -1) + 1
    c = await tx.campus.create({ data: { name, sortOrder, isActive: true } })
    await tx.department.create({
      data: { name: '未分配', campusId: c.id, parentId: null, sortOrder: 0, isActive: true },
    })
  }
  return c
}

function splitDeptPathSegments(raw: string): string[] {
  const r = raw.trim()
  if (!r) return []
  if (/[\/／\\]/.test(r)) return r.split(/[/／\\]+/).map((s) => s.trim()).filter(Boolean)
  return r.split(/\s*-\s*/).map((s) => s.trim()).filter(Boolean)
}

/** 按「一级/二级」或「一级 - 二级」解析或创建部门链 */
async function resolveDepartmentForImport(tx: ImportTx, campusId: number, deptCellRaw: string, sortRef: { n: number }) {
  const raw = (deptCellRaw || '未分配').trim() || '未分配'
  const segments = splitDeptPathSegments(raw)
  if (!segments.length) {
    const d = await tx.department.findFirst({
      where: { name: '未分配', campusId, parentId: null },
    })
    if (!d) badRequest('该园区缺少「未分配」部门，请先完成系统数据初始化')
    return d
  }
  let parentId: number | null = null
  let current: { id: number } | null = null
  for (const seg of segments) {
    let node: Department | null = await tx.department.findFirst({
      where: { campusId, parentId, name: seg },
      orderBy: { sortOrder: 'asc' },
    })
    if (!node) {
      sortRef.n += 1
      node = await tx.department.create({
        data: { campusId, parentId, name: seg, sortOrder: sortRef.n, isActive: true },
      })
    }
    current = node
    parentId = node.id
  }
  return current!
}

const excelRouter = Router()

const USER_REQUIRED_STATUSES: AssetStatus[] = [AssetStatus.waiting_pickup, AssetStatus.in_use, AssetStatus.borrowed]

function badRequest(message: string, details?: unknown, code?: string): never {
  throw { statusCode: 400, message, details, code }
}

type AssetTemplateRow = AssetTemplate
type TemplateIndexes = {
  byName: Map<string, AssetTemplateRow>
  byBrandModel: Map<string, AssetTemplateRow>
  byBrandModelLoose: Map<string, AssetTemplateRow>
  byCompact: Map<string, AssetTemplateRow>
}

type UnknownTemplateItem = {
  /** 去重键 */
  key: string
  /** 建议新建的模板名称（唯一） */
  suggestedName: string
  brand: string
  model: string
  deviceType: string
  os: string
  cpu: string
  memory: string
  storage: string
  /** Excel 中的行号（1-based，含表头则为数据行序号） */
  exampleRows: number[]
}

type ImportSkipItem = {
  row: number
  reason: string
  assetCode?: string
}
type InvalidReasonStat = { reason: string; count: number }

const IMPORT_RELATED_HEADERS = [
  '电脑编号',
  'assetCode',
  '电脑编号(电脑编号)',
  '电脑编号（电脑编号）',
  '序列号',
  'serialNumber',
  '序列号（EX）',
  '序列号(EX)',
  '序列号（Ex）',
  '序列号(Ex)',
  'SN',
  'sn',
  '模板名称',
  '型号模板',
  'templateName',
  '品牌',
  'brand',
  '型号',
  'model',
  '设备型号',
  '规格型号',
  '电脑型号',
  '规格',
  '设备类型',
  'deviceType',
  '操作系统',
  'os',
  'CPU',
  'cpu',
  '内存',
  'memory',
  '存储',
  'storage',
  '设备状态',
  'status',
  '现定人',
  'currentUserName',
  '现登记人',
  '使用人',
  '领用人',
  '部门',
  'department',
  'departmentName',
  '园区',
  'campus',
  '采购日期',
  'purchaseDate',
  '开始使用时间',
  '启用日期',
  'startDate',
  '保修到期日',
  'warrantyExpiry',
  '预计归还日期',
  'expectedReturnDate',
  '备注',
  'remark',
  '配置',
  '硬件配置',
  'config',
  '证明',
  '凭证',
  '曾用人信息',
  '曾用人',
] as const

const IMPORT_RELATED_HEADER_SET = new Set(IMPORT_RELATED_HEADERS.map((h) => normalizeHeader(h)))

function hasImportRelatedValue(row: Record<string, any>): boolean {
  for (const [k, v] of Object.entries(row)) {
    if (!IMPORT_RELATED_HEADER_SET.has(normalizeHeader(k))) continue
    if (v === undefined || v === null) continue
    if (typeof v === 'string') {
      if (v.trim() !== '') return true
      continue
    }
    // 数字/布尔/日期都视为有数据
    return true
  }
  return false
}

function strRow(row: Record<string, any>, keys: string[]): string {
  for (const k of keys) {
    const v = row[k]
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim()
  }
  return ''
}

/**
 * 从行数据中读取字段（支持别名 + 表头归一化匹配）
 * - 优先匹配精确 key
 * - 再对比 normalizeHeader(key) 与 normalizeHeader(alias)
 */
function getRowCell(row: Record<string, any>, aliases: string[]): string {
  // 1) 精确 key 优先
  for (const a of aliases) {
    const v = row[a]
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim()
  }

  // 2) 表头归一化匹配
  const aliasNorm = new Set(aliases.map((a) => normalizeHeader(a)))
  for (const key of Object.keys(row)) {
    if (!aliasNorm.has(normalizeHeader(key))) continue
    const v = row[key]
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim()
  }

  return ''
}

/** 序列号（兼容台账列名如「序列号（EX）」） */
function parseSerialFromRow(row: Record<string, any>): string {
  return getRowCell(row, [
    '序列号',
    'serialNumber',
    '序列号（EX）',
    '序列号(EX)',
    '序列号（Ex）',
    '序列号(Ex)',
    'SN',
    'sn',
  ])
}

function parseCurrentUserFromRow(row: Record<string, any>): string {
  return strRow(row, ['现定人', 'currentUserName', '现登记人', '使用人', '领用人'])
}

function parseExcelDate(raw: unknown): Date | null {
  if (raw === undefined || raw === null || raw === '') return null
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw
  if (typeof raw === 'number' && raw > 30000 && raw < 65000) {
    const ms = (raw - 25569) * 86400 * 1000
    const d = new Date(ms)
    if (!Number.isNaN(d.getTime())) return d
  }
  const d = new Date(raw as string | number)
  return Number.isNaN(d.getTime()) ? null : d
}

/** 采购日期：未填默认当天；填了但非法则返回 null 由上层判定为错误行 */
function parsePurchaseDateFromRow(row: Record<string, any>): Date | null {
  const raw =
    row['采购日期'] ??
    row['purchaseDate'] ??
    row['开始使用时间'] ??
    row['启用日期'] ??
    row['startDate']
  if (raw === undefined || raw === null || raw === '') return new Date()
  return parseExcelDate(raw)
}

/** 可选日期：未填返回 null；填了但非法返回 undefined（用于区分非法输入） */
function parseOptionalDateFromRow(row: Record<string, any>, keys: string[]): Date | null | undefined {
  const raw = keys.map((k) => row[k]).find((v) => v !== undefined && v !== null && v !== '')
  if (raw === undefined || raw === null || raw === '') return null
  return parseExcelDate(raw) ?? undefined
}

/** 备注 + 台账「配置」摘要（避免丢字段） */
function buildRemarkFromRow(row: Record<string, any>): string | undefined {
  const parts: string[] = []
  const note =
    typeof row['备注'] === 'string'
      ? row['备注'].trim()
      : typeof row['remark'] === 'string'
        ? row['remark'].trim()
        : ''
  if (note) parts.push(note)
  const cfg = strRow(row, ['配置', '硬件配置', 'config'])
  if (cfg) parts.push(`配置: ${cfg}`)
  const proof = strRow(row, ['证明', '凭证'])
  if (proof) parts.push(`证明: ${proof}`)
  const former = strRow(row, ['曾用人信息', '曾用人'])
  if (former) parts.push(`曾用人: ${former}`)
  if (!parts.length) return undefined
  return parts.join('\n')
}

/** 从行中解析模板名称（用于按名称匹配系统模板） */
function parseTemplateNameFromRow(row: Record<string, any>): string {
  return strRow(row, ['模板名称', '型号模板', 'templateName'])
}

/** 品牌、型号（「型号」优先于「配置」，避免把整段配置当成型号） */
function parseBrandModelFromRow(row: Record<string, any>): { brand: string; model: string } {
  const brand = strRow(row, ['品牌', 'brand'])
  let model = strRow(row, ['型号', 'model', '设备型号', '规格型号', '电脑型号', '规格'])
  if (!model) model = strRow(row, ['配置', 'config'])
  return { brand, model }
}

function compactNorm(s: string): string {
  return normKeyPart(s).replace(/\s+/g, '')
}

function normKeyPart(s: string): string {
  return s.trim().replace(/\s+/g, ' ')
}

function brandModelKey(brand: string, model: string): string {
  return `${normKeyPart(brand)}|${normKeyPart(model)}`
}

/**
 * 宽松型号归一化：尽量忽略内存/存储等细微规格差异，
 * 让同一机型（如 7010）不会因 8G/16G、256G/512G 被拆成多个模板。
 */
function looseModelKey(model: string): string {
  let s = model.toLowerCase()
  s = s
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/[【】\[\]\(\)_\-\/\\,+]/g, ' ')
    .replace(/\b\d+(\.\d+)?\s*(tb|t|gb|g|mb|m)\b/gi, ' ')
    .replace(/\b(ddr\d?|lpddr\d?|ram|rom|ssd|hdd|nvme|pcie|sata|m\.2)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return compactNorm(s)
}

function buildTemplateIndexes(all: AssetTemplateRow[]): TemplateIndexes {
  const byName = new Map<string, AssetTemplateRow>()
  const byBrandModel = new Map<string, AssetTemplateRow>()
  const byBrandModelLoose = new Map<string, AssetTemplateRow>()
  const byCompact = new Map<string, AssetTemplateRow>()

  for (const t of all) {
    byName.set(normKeyPart(t.name), t)
    byBrandModel.set(brandModelKey(t.brand, t.model), t)
    const b = normKeyPart(t.brand)
    const loose = looseModelKey(t.model)
    if (b && loose && !byBrandModelLoose.has(`${b}|${loose}`)) {
      byBrandModelLoose.set(`${b}|${loose}`, t)
    }
    byCompact.set(compactNorm(t.model), t)
    byCompact.set(compactNorm(t.name), t)
    byCompact.set(compactNorm(`${t.brand}${t.model}`), t)
    byCompact.set(compactNorm(`${t.brand} ${t.model}`), t)
  }
  return { byName, byBrandModel, byBrandModelLoose, byCompact }
}

function findMatchingTemplate(
  all: AssetTemplateRow[],
  templateName: string,
  brand: string,
  model: string,
  indexes?: TemplateIndexes,
): AssetTemplateRow | null {
  const tn = normKeyPart(templateName)
  if (tn) {
    const byName = indexes?.byName.get(tn) ?? all.find((t) => normKeyPart(t.name) === tn)
    if (byName) return byName
  }
  const b = normKeyPart(brand)
  const m = normKeyPart(model)
  if (b && m) {
    const hit =
      indexes?.byBrandModel.get(`${b}|${m}`) ??
      all.find((t) => normKeyPart(t.brand) === b && normKeyPart(t.model) === m)
    if (hit) return hit

    // 宽松匹配：忽略型号中的内存/存储规格差异
    const lm = looseModelKey(m)
    if (lm) {
      const looseHit =
        indexes?.byBrandModelLoose.get(`${b}|${lm}`) ??
        all.find((t) => normKeyPart(t.brand) === b && looseModelKey(t.model) === lm)
      if (looseHit) return looseHit
    }
  }
  // 台账常把「品牌+型号」写在同一列且无独立品牌列：按型号/模板名紧凑匹配
  if (!b && m) {
    const mc = compactNorm(m)
    const hit =
      indexes?.byCompact.get(mc) ??
      all.find((t) => {
        if (compactNorm(t.model) === mc) return true
        if (compactNorm(t.name) === mc) return true
        if (compactNorm(`${t.brand}${t.model}`) === mc) return true
        if (compactNorm(`${t.brand} ${t.model}`) === mc) return true
        return false
      })
    if (hit) return hit
  }
  return null
}

/** 是否需要在系统中登记「设备型号模板」：显式模板名未命中，或填了品牌+型号但无对应模板 */
function classifyTemplateNeed(
  all: AssetTemplateRow[],
  row: Record<string, any>,
  indexes?: TemplateIndexes,
): { template: AssetTemplateRow | null; unknown: UnknownTemplateItem | null } {
  const templateName = parseTemplateNameFromRow(row)
  const { brand, model } = parseBrandModelFromRow(row)
  const matched = findMatchingTemplate(all, templateName, brand, model, indexes)

  if (matched) return { template: matched, unknown: null }

  const hasExplicitName = templateName.length > 0
  const hasBrandModel = brand.length > 0 || model.length > 0

  if (!hasExplicitName && !hasBrandModel) {
    return { template: null, unknown: null }
  }

  const deviceTypeRaw = String(row['设备类型'] ?? row['deviceType'] ?? '').trim()
  const deviceType = mapDeviceType(deviceTypeRaw) ?? 'laptop'
  const os = strRow(row, ['操作系统', 'os'])
  const cpu = strRow(row, ['CPU', 'cpu'])
  const memory = strRow(row, ['内存', 'memory'])
  const storage = strRow(row, ['存储', 'storage'])

  let suggestedName = templateName
  if (!suggestedName) {
    suggestedName = [brand, model].filter(Boolean).join(' ').trim() || model || brand || '未命名型号'
  }

  const key = hasExplicitName ? `name:${normKeyPart(templateName)}` : `bm:${normKeyPart(brand)}|${normKeyPart(model)}`

  return {
    template: null,
    unknown: {
      key,
      suggestedName,
      brand,
      model,
      deviceType,
      os,
      cpu,
      memory,
      storage,
      exampleRows: [],
    },
  }
}

function mergeUnknown(map: Map<string, UnknownTemplateItem>, item: UnknownTemplateItem, rowIndex1Based: number) {
  const prev = map.get(item.key)
  if (!prev) {
    map.set(item.key, { ...item, exampleRows: [rowIndex1Based] })
    return
  }
  const rows = [...prev.exampleRows, rowIndex1Based].filter((v, i, a) => a.indexOf(v) === i).slice(0, 5)
  map.set(item.key, { ...prev, exampleRows: rows })
}

function parseBoolField(v: unknown): boolean {
  if (v === true || v === 'true' || v === '1' || v === 1) return true
  if (typeof v === 'string' && ['yes', 'on', '是'].includes(v.trim().toLowerCase())) return true
  return false
}

function mapStatus(statusRaw: unknown): AssetStatus | null {
  if (typeof statusRaw !== 'string') return null
  const s = statusRaw.trim()
  if (!s) return null

  const map: Record<string, AssetStatus> = {
    in_stock: AssetStatus.in_stock,
    waiting_pickup: AssetStatus.waiting_pickup,
    in_use: AssetStatus.in_use,
    borrowed: AssetStatus.borrowed,
    in_repair: AssetStatus.in_repair,
    retired: AssetStatus.retired,

    在库: AssetStatus.in_stock,
    待领用: AssetStatus.waiting_pickup,
    使用中: AssetStatus.in_use,
    借用中: AssetStatus.borrowed,
    维修中: AssetStatus.in_repair,
    已报废: AssetStatus.retired,
  }
  return map[s] ?? map[s.replace(/\s+/g, '')] ?? null
}

function mapDeviceType(deviceTypeRaw: unknown): string | null {
  if (typeof deviceTypeRaw !== 'string') return null
  const s = deviceTypeRaw.trim()
  if (!s) return null

  const map: Record<string, string> = {
    laptop: 'laptop',
    desktop: 'desktop',
    aio: 'aio',
    server: 'server',
    other: 'other',

    笔记本: 'laptop',
    台式机: 'desktop',
    一体机: 'aio',
    服务器: 'server',
    其他: 'other',
  }
  return map[s] ?? map[s.replace(/\s+/g, '')] ?? s
}

function normalizeHeader(h: string): string {
  return h
    .trim()
    .replace(/\s+/g, '')
    // 兼容全角括号（Excel 复制的表头经常会用全角）
    .replace(/（/g, '(')
    .replace(/）/g, ')')
}

const RECORD_EXPORT_ACTION_ZH: Record<string, string> = {
  stock_in: '入库',
  assign: '待领用',
  cancel_assign: '取消分配',
  pick_up: '领用',
  check_out: '出库/领用',
  lend: '借出',
  return: '归还',
  transfer: '调拨',
  repair: '送修',
  repair_done: '维修完成',
  retire: '报废',
}

function pickFirstExistingSheet(sheetNames: string[], candidates: string[]): string | null {
  for (const c of candidates) {
    if (sheetNames.includes(c)) return c
  }
  return null
}

function sheetRows(workbook: xlsx.WorkBook, sheetName: string): Record<string, any>[] {
  const ws = workbook.Sheets[sheetName]
  if (!ws) return []
  return xlsx.utils.sheet_to_json<Record<string, any>>(ws, { defval: '' })
}

function parseRecordActionFromRow(row: Record<string, any>): AssetRecordAction | null {
  const en = getRowCell(row, ['action', '操作枚举'])
  if (en) {
    const v = en.trim()
    if ((Object.values(AssetRecordAction) as string[]).includes(v)) return v as AssetRecordAction
  }
  const cn = getRowCell(row, ['操作类型'])
  if (!cn) return null
  const s = cn.trim()
  const map: Record<string, AssetRecordAction> = {
    入库: AssetRecordAction.stock_in,
    待领用: AssetRecordAction.assign,
    取消分配: AssetRecordAction.cancel_assign,
    领用: AssetRecordAction.pick_up,
    '出库/领用': AssetRecordAction.check_out,
    出库: AssetRecordAction.check_out,
    借出: AssetRecordAction.lend,
    归还: AssetRecordAction.return,
    调拨: AssetRecordAction.transfer,
    送修: AssetRecordAction.repair,
    维修完成: AssetRecordAction.repair_done,
    报废: AssetRecordAction.retire,
  }
  return map[s] ?? map[s.replace(/\s+/g, '')] ?? null
}

function recordRowLooksLikeData(row: Record<string, any>): boolean {
  const code = getRowCell(row, ['电脑编号', 'assetCode'])
  const rid = getRowCell(row, ['requestId', '请求ID'])
  return Boolean(code || rid)
}

async function resolveRecordOperatorId(
  tx: ImportTx,
  row: Record<string, any>,
  fallbackId: number,
): Promise<number> {
  const username = getRowCell(row, ['操作人账号', 'operatorUsername', 'operator.username'])
  if (username) {
    const u = await tx.user.findUnique({ where: { username }, select: { id: true } })
    if (u) return u.id
  }
  const realName = getRowCell(row, ['操作人', 'operatorRealName'])
  if (realName) {
    const u = await tx.user.findFirst({ where: { realName }, select: { id: true } })
    if (u) return u.id
  }
  return fallbackId
}

type RecordImportAccum = {
  imported: number
  skippedCount: number
  skippedRows: ImportSkipItem[]
  reasonCounter: Map<string, number>
}

function makeRecordImportAccum(): RecordImportAccum {
  return {
    imported: 0,
    skippedCount: 0,
    skippedRows: [],
    reasonCounter: new Map(),
  }
}

function pushRecordSkip(acc: RecordImportAccum, item: ImportSkipItem) {
  acc.skippedCount++
  acc.reasonCounter.set(item.reason, (acc.reasonCounter.get(item.reason) ?? 0) + 1)
  if (acc.skippedRows.length < 200) acc.skippedRows.push(item)
}

async function dryRunImportBackupRecords(
  recordRows: Record<string, any>[],
  assetCodesOkInSameFile: Set<string>,
): Promise<RecordImportAccum> {
  const acc = makeRecordImportAccum()
  const seenReq = new Set<string>()
  for (let i = 0; i < recordRows.length; i++) {
    const row = recordRows[i]
    if (!recordRowLooksLikeData(row)) continue
    const assetCode = getRowCell(row, ['电脑编号', 'assetCode'])
    if (!assetCode) {
      pushRecordSkip(acc, { row: i + 2, reason: '流转记录缺少电脑编号' })
      continue
    }
    const action = parseRecordActionFromRow(row)
    if (!action) {
      pushRecordSkip(acc, { row: i + 2, reason: '流转记录操作类型无法识别', assetCode })
      continue
    }
    const actionRaw = row['操作时间'] ?? row['actionDate'] ?? ''
    const actionDate = parseExcelDate(actionRaw)
    if (!actionDate) {
      pushRecordSkip(acc, { row: i + 2, reason: '流转记录操作时间格式非法', assetCode })
      continue
    }
    const asset = await prisma.asset.findUnique({ where: { assetCode }, select: { id: true } })
    if (!asset && !assetCodesOkInSameFile.has(assetCode)) {
      pushRecordSkip(acc, {
        row: i + 2,
        reason: '流转记录：电脑编号在库中不存在（且本表资产页未包含可导入的该编号）',
        assetCode,
      })
      continue
    }
    const reqRaw = getRowCell(row, ['requestId', '请求ID'])
    if (reqRaw) {
      if (seenReq.has(reqRaw)) {
        pushRecordSkip(acc, { row: i + 2, reason: '流转记录 requestId 在同文件内重复', assetCode })
        continue
      }
      seenReq.add(reqRaw)
      const exists = await prisma.assetRecord.findUnique({
        where: { requestId: reqRaw },
        select: { id: true },
      })
      if (exists) {
        pushRecordSkip(acc, { row: i + 2, reason: '流转记录 requestId 已存在（将跳过）', assetCode })
        continue
      }
    }
    acc.imported++
  }
  return acc
}

async function importBackupRecordsInTx(
  tx: ImportTx,
  recordRows: Record<string, any>[],
  authUserId: number,
  deptSortRef: { n: number },
): Promise<RecordImportAccum> {
  const acc = makeRecordImportAccum()
  const indexed = recordRows
    .map((row, i) => ({ row, excelRow: i + 2 }))
    .filter(({ row }) => recordRowLooksLikeData(row))

  const parsed: {
    row: Record<string, any>
    excelRow: number
    assetCode: string
    action: AssetRecordAction
    actionDate: Date
    requestId: string
    userName: string
    deptLine: string
    campusName: string
    expectedReturnDate: Date | null
    proofImage: string | undefined
    remark: string | undefined
  }[] = []

  const seenReq = new Set<string>()
  for (const { row, excelRow } of indexed) {
    const assetCode = getRowCell(row, ['电脑编号', 'assetCode'])
    if (!assetCode) {
      pushRecordSkip(acc, { row: excelRow, reason: '流转记录缺少电脑编号' })
      continue
    }
    const action = parseRecordActionFromRow(row)
    if (!action) {
      pushRecordSkip(acc, { row: excelRow, reason: '流转记录操作类型无法识别', assetCode })
      continue
    }
    const actionDate = parseExcelDate(row['操作时间'] ?? row['actionDate'] ?? '')
    if (!actionDate) {
      pushRecordSkip(acc, { row: excelRow, reason: '流转记录操作时间格式非法', assetCode })
      continue
    }
    let requestId = getRowCell(row, ['requestId', '请求ID'])
    if (!requestId) requestId = `restore-${randomUUID()}`
    if (seenReq.has(requestId)) {
      pushRecordSkip(acc, { row: excelRow, reason: '流转记录 requestId 在同文件内重复', assetCode })
      continue
    }
    seenReq.add(requestId)

    const userName = getRowCell(row, ['用户', 'userName'])
    const campusName = String(row['园区'] ?? row['campus'] ?? '').trim() || '泰鼎'
    const deptLine = String(row['部门'] ?? row['department'] ?? row['departmentName'] ?? '').trim() || '未分配'
    const expectedRaw = row['预计归还日期'] ?? row['expectedReturnDate'] ?? ''
    let expectedReturnDate: Date | null = null
    if (expectedRaw !== undefined && expectedRaw !== null && String(expectedRaw).trim() !== '') {
      const ed = parseExcelDate(expectedRaw)
      if (ed) expectedReturnDate = ed
    }
    const proofRaw = getRowCell(row, ['凭证图片', 'proofImage'])
    const proofImage = proofRaw || undefined
    const remarkRaw = getRowCell(row, ['备注', 'remark'])
    const remark = remarkRaw || undefined

    parsed.push({
      row,
      excelRow,
      assetCode,
      action,
      actionDate,
      requestId,
      userName,
      deptLine,
      campusName,
      expectedReturnDate,
      proofImage,
      remark,
    })
  }

  parsed.sort((a, b) => a.actionDate.getTime() - b.actionDate.getTime())

  for (const p of parsed) {
    const asset = await tx.asset.findUnique({ where: { assetCode: p.assetCode }, select: { id: true } })
    if (!asset) {
      pushRecordSkip(acc, { row: p.excelRow, reason: '流转记录：电脑编号在库中不存在', assetCode: p.assetCode })
      continue
    }
    const existing = await tx.assetRecord.findUnique({
      where: { requestId: p.requestId },
      select: { id: true },
    })
    if (existing) {
      pushRecordSkip(acc, {
        row: p.excelRow,
        reason: '流转记录 requestId 已存在',
        assetCode: p.assetCode,
      })
      continue
    }

    const campusRow = await ensureCampusByName(tx, p.campusName)
    const dept = await resolveDepartmentForImport(tx, campusRow.id, p.deptLine, deptSortRef)
    const operatorId = await resolveRecordOperatorId(tx, p.row, authUserId)

    await tx.assetRecord.create({
      data: {
        assetId: asset.id,
        action: p.action,
        userName: p.userName,
        departmentId: dept.id,
        actionDate: p.actionDate,
        expectedReturnDate: p.expectedReturnDate ?? undefined,
        proofImage: p.proofImage,
        remark: p.remark,
        operatorId,
        requestId: p.requestId,
      },
    })
    acc.imported++
  }

  return acc
}

/**
 * Excel 导入单文件上限（默认 20MB）
 * - 设置 EXCEL_IMPORT_MAX_MB=0 可取消限制（不推荐，大文件会占用大量内存）
 */
const _rawMb = process.env.EXCEL_IMPORT_MAX_MB
const _maxMb = Number(_rawMb ?? '20')

const multerLimits: { fileSize?: number } = {}
if (Number.isFinite(_maxMb) && _maxMb === 0) {
  // 不设 fileSize = Multer 不限制
} else {
  const finalMb = Number.isFinite(_maxMb) && _maxMb > 0 ? _maxMb : 20
  multerLimits.fileSize = finalMb * 1024 * 1024
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: multerLimits,
})

excelRouter.post(
  '/import',
  requireAuth,
  requirePermission('excel.import'),
  upload.single('file'),
  async (req, res) => {
    const authUser = (req as any).auth as { id: number }
    if (!req.file) badRequest('file is required')

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer', cellDates: true })
    const allSheetNames = workbook.SheetNames
    const assetSheetName =
      pickFirstExistingSheet(allSheetNames, ['资产清单', '资产导入']) ?? allSheetNames[0]
    if (!assetSheetName) badRequest('Excel 工作簿为空')

    const rows = sheetRows(workbook, assetSheetName)

    const body = req.body as Record<string, unknown>
    const dryRun = parseBoolField(body?.dryRun)
    const createMissing = parseBoolField(body?.createMissingTemplates)
    const allowMissing = parseBoolField(body?.allowMissingTemplates)
    const skipDefaultFlowRecords = parseBoolField(body?.skipDefaultFlowRecords)
    const importBackupRecords = parseBoolField(body?.importBackupRecords)

    const recordSheetName = importBackupRecords
      ? pickFirstExistingSheet(allSheetNames, ['流转记录', '出入库记录'])
      : null
    const recordRows = recordSheetName ? sheetRows(workbook, recordSheetName) : []

    if (importBackupRecords && !recordSheetName) {
      badRequest('已勾选导入流转记录，但文件中未找到「流转记录」或「出入库记录」工作表')
    }

    const hasAssetData = rows.some((r) => hasImportRelatedValue(r))
    const hasRecordData = recordRows.some((r) => recordRowLooksLikeData(r))
    if (!hasAssetData && !(importBackupRecords && hasRecordData)) {
      badRequest('Empty excel file')
    }

    const rowsCount = rows.length
    const allTemplatesSnapshot = await prisma.assetTemplate.findMany()
    const snapshotIndexes = buildTemplateIndexes(allTemplatesSnapshot)

    const unknownMap = new Map<string, UnknownTemplateItem>()
    const dryRunAssetCodesOk = new Set<string>()
    let wouldImport = 0
    let detectedRows = 0
    let skippedCount = 0
    const skippedRows: ImportSkipItem[] = []
    const reasonCounter = new Map<string, number>()
    const seenSerialToAssetCode = new Map<string, string>()
    const pushDrySkip = (item: ImportSkipItem) => {
      skippedCount++
      reasonCounter.set(item.reason, (reasonCounter.get(item.reason) ?? 0) + 1)
      // 控制返回体大小，最多返回前 200 条明细
      if (skippedRows.length < 200) skippedRows.push(item)
    }

    for (let i = 0; i < rowsCount; i++) {
      const row = rows[i]
      if (!hasImportRelatedValue(row)) continue
      detectedRows++
      const assetCode = getRowCell(row, [
        '电脑编号',
        'assetCode',
        '电脑编号(电脑编号)',
        '电脑编号（电脑编号）',
      ])
      let serialNumber = parseSerialFromRow(row)
      if (!assetCode) {
        if (dryRun) {
          pushDrySkip({
            row: i + 2,
            reason: '缺少电脑编号',
            assetCode: undefined,
          })
        }
        continue
      }
      // 允许“序列号为空”：写入时使用唯一占位符（序列号字段在数据库里是 unique）
      if (!serialNumber) serialNumber = `暂无-${assetCode}`

      const seenAssetCode = seenSerialToAssetCode.get(serialNumber)
      if (seenAssetCode && seenAssetCode !== assetCode) {
        if (dryRun) {
          pushDrySkip({
            row: i + 2,
            reason: `序列号重复（与同批导入的电脑编号 ${seenAssetCode} 冲突）`,
            assetCode,
          })
        }
        continue
      }
      seenSerialToAssetCode.set(serialNumber, assetCode)

      const existedBySerial = await prisma.asset.findUnique({
        where: { serialNumber },
        select: { assetCode: true },
      })
      if (existedBySerial && existedBySerial.assetCode !== assetCode) {
        if (dryRun) {
          pushDrySkip({
            row: i + 2,
            reason: `序列号已存在（当前归属电脑编号 ${existedBySerial.assetCode}）`,
            assetCode,
          })
        }
        continue
      }
      const { unknown } = classifyTemplateNeed(allTemplatesSnapshot, row, snapshotIndexes)
      if (unknown) mergeUnknown(unknownMap, unknown, i + 2)

      // dryRun 时也给出行级跳过原因（便于你在真正写入前先确认 Excel 有问题的行）
      if (dryRun) {
        const status = mapStatus(row['设备状态'] ?? row['status'] ?? '在库') ?? AssetStatus.in_stock
        const currentUserName = parseCurrentUserFromRow(row)
        if (USER_REQUIRED_STATUSES.includes(status) && !currentUserName.trim()) {
          pushDrySkip({ row: i + 2, reason: '设备状态为待领用/使用中/借用中时，现定人必填', assetCode })
          continue
        }

        const purchaseDate = parsePurchaseDateFromRow(row)
        if (!purchaseDate) {
          pushDrySkip({ row: i + 2, reason: '采购日期格式非法', assetCode })
          continue
        }
        const warrantyExpiry = parseOptionalDateFromRow(row, ['保修到期日', 'warrantyExpiry'])
        if (warrantyExpiry === undefined) {
          pushDrySkip({ row: i + 2, reason: '保修到期日格式非法', assetCode })
          continue
        }
        dryRunAssetCodesOk.add(assetCode)
      }
      wouldImport++
    }

    if (dryRun) {
      const invalidReasonStats: InvalidReasonStat[] = Array.from(reasonCounter.entries())
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason, 'zh-CN'))

      let backupRecordsPayload: Record<string, unknown> | undefined
      if (importBackupRecords && recordSheetName) {
        const recordDetected = recordRows.filter((r) => recordRowLooksLikeData(r)).length
        const recAcc = await dryRunImportBackupRecords(recordRows, dryRunAssetCodesOk)
        const recStats: InvalidReasonStat[] = Array.from(recAcc.reasonCounter.entries())
          .map(([reason, count]) => ({ reason, count }))
          .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason, 'zh-CN'))
        backupRecordsPayload = {
          sheetName: recordSheetName,
          detectedRows: recordDetected,
          wouldImport: recAcc.imported,
          skippedCount: recAcc.skippedCount,
          skippedRows: recAcc.skippedRows,
          invalidReasonStats: recStats,
        }
      }

      res.json({
        dryRun: true,
        detectedRows,
        wouldImport,
        invalidRows: skippedCount,
        invalidReasonStats,
        unknownTemplates: Array.from(unknownMap.values()),
        skippedCount,
        skippedRows,
        importBackupRecords,
        skipDefaultFlowRecords,
        backupRecords: backupRecordsPayload,
      })
      return
    }

    if (unknownMap.size > 0 && !createMissing && !allowMissing) {
      badRequest(
        '导入已中止：存在未在系统中登记的电脑型号。请确认是否自动创建「设备型号模板」后再导入。',
        { unknownTemplates: Array.from(unknownMap.values()) },
        'EXCEL_UNKNOWN_TEMPLATES',
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      let all = await tx.assetTemplate.findMany()
      let templateIndexes = buildTemplateIndexes(all)
      let templatesCreated = 0

      if (unknownMap.size > 0 && createMissing && !allowMissing) {
        const maxSortRow = await tx.assetTemplate.aggregate({ _max: { sortOrder: true } })
        let nextSort = (maxSortRow._max.sortOrder ?? 0) + 1

        for (const u of unknownMap.values()) {
          if (findMatchingTemplate(all, u.suggestedName, u.brand, u.model, templateIndexes)) continue

          const baseName = u.suggestedName.trim().slice(0, 120) || '未命名型号'
          let name = baseName
          let suffix = 0

          while (true) {
            const ex = await tx.assetTemplate.findUnique({ where: { name } })
            if (!ex) {
              const created = await tx.assetTemplate.create({
                data: {
                  name,
                  deviceType: u.deviceType,
                  brand: u.brand,
                  model: u.model,
                  os: u.os,
                  cpu: u.cpu,
                  memory: u.memory,
                  storage: u.storage,
                  sortOrder: nextSort++,
                  isActive: true,
                },
              })
              all.push(created)
              templateIndexes = buildTemplateIndexes(all)
              templatesCreated++
              break
            }
            if (
              normKeyPart(ex.brand) === normKeyPart(u.brand) &&
              normKeyPart(ex.model) === normKeyPart(u.model)
            ) {
              break
            }
            suffix++
            name = `${baseName}_${suffix}`
          }
        }
      }

      all = await tx.assetTemplate.findMany()
      templateIndexes = buildTemplateIndexes(all)

      let imported = 0
      let skippedCount = 0
      const skippedRows: ImportSkipItem[] = []
      const reasonCounter = new Map<string, number>()
      const seenSerialToAssetCode = new Map<string, string>()
      const pushSkip = (item: ImportSkipItem) => {
        skippedCount++
        reasonCounter.set(item.reason, (reasonCounter.get(item.reason) ?? 0) + 1)
        // 控制返回体大小，最多返回前 200 条明细
        if (skippedRows.length < 200) skippedRows.push(item)
      }
      const maxDeptSort = await tx.department.aggregate({ _max: { sortOrder: true } })
      const deptSortRef = { n: maxDeptSort._max.sortOrder ?? 0 }

      // 避免重复导入时重复补“入库”台账：缓存哪些资产已存在过 stock_in
      const stockInAssetsCache = new Set<number>()

      for (let i = 0; i < rowsCount; i++) {
        const row = rows[i]
        if (!hasImportRelatedValue(row)) continue

        const assetCode = getRowCell(row, [
          '电脑编号',
          'assetCode',
          '电脑编号(电脑编号)',
          '电脑编号（电脑编号）',
        ])

        let serialNumber = parseSerialFromRow(row)
        if (!assetCode) {
          pushSkip({
            row: i + 2,
            reason: '缺少电脑编号',
            assetCode: undefined,
          })
          continue
        }
        // 允许“序列号为空”：写入时使用唯一占位符（序列号字段在数据库里是 unique）
        if (!serialNumber) serialNumber = `暂无-${assetCode}`

        const seenAssetCode = seenSerialToAssetCode.get(serialNumber)
        if (seenAssetCode && seenAssetCode !== assetCode) {
          pushSkip({
            row: i + 2,
            reason: `序列号重复（与同批导入的电脑编号 ${seenAssetCode} 冲突）`,
            assetCode,
          })
          continue
        }
        seenSerialToAssetCode.set(serialNumber, assetCode)

        const existedBySerial = await tx.asset.findUnique({
          where: { serialNumber },
          select: { assetCode: true },
        })
        if (existedBySerial && existedBySerial.assetCode !== assetCode) {
          pushSkip({
            row: i + 2,
            reason: `序列号已存在（当前归属电脑编号 ${existedBySerial.assetCode}）`,
            assetCode,
          })
          continue
        }

        const campusName = String(row['园区'] ?? row['campus'] ?? '').trim() || '泰鼎'
        const campusRow = await ensureCampusByName(tx, campusName)
        const deptLine = String(row['部门'] ?? row['department'] ?? row['departmentName'] ?? '').trim() || '未分配'
        const dept = await resolveDepartmentForImport(tx, campusRow.id, deptLine, deptSortRef)

        const templateName = parseTemplateNameFromRow(row)
        const { brand: rb, model: rm } = parseBrandModelFromRow(row)
        const template = findMatchingTemplate(all, templateName, rb, rm, templateIndexes)

        const status = mapStatus(row['设备状态'] ?? row['status'] ?? '在库') ?? AssetStatus.in_stock

        const deviceType =
          mapDeviceType(String(row['设备类型'] ?? row['deviceType'] ?? '').trim()) ??
          (template?.deviceType ?? 'laptop')

        const brand = rb || String(template?.brand ?? '')
        const model = rm || String(template?.model ?? '')
        const os = strRow(row, ['操作系统', 'os']) || String(template?.os ?? '')
        const cpu = strRow(row, ['CPU', 'cpu']) || String(template?.cpu ?? '')
        const memory = strRow(row, ['内存', 'memory']) || String(template?.memory ?? '')
        const storage = strRow(row, ['存储', 'storage']) || String(template?.storage ?? '')
        const remark = buildRemarkFromRow(row)
        const currentUserName = parseCurrentUserFromRow(row)
        if (USER_REQUIRED_STATUSES.includes(status) && !currentUserName.trim()) {
          pushSkip({ row: i + 2, reason: '设备状态为待领用/使用中/借用中时，现定人必填', assetCode })
          continue
        }

        const purchaseDate = parsePurchaseDateFromRow(row)
        if (!purchaseDate) {
          pushSkip({ row: i + 2, reason: '采购日期格式非法', assetCode })
          continue
        }

        const warrantyExpiry = parseOptionalDateFromRow(row, ['保修到期日', 'warrantyExpiry'])
        if (warrantyExpiry === undefined) {
          pushSkip({ row: i + 2, reason: '保修到期日格式非法', assetCode })
          continue
        }

        let asset: { id: number; status: AssetStatus; currentUserName: string; departmentId: number }
        try {
          asset = await tx.asset.upsert({
            where: { assetCode },
            update: {
              templateId: template?.id ?? null,
              deviceType,
              brand,
              model,
              serialNumber,
              os,
              cpu,
              memory,
              storage,
              status,
              currentUserName: status === AssetStatus.in_stock ? '' : currentUserName,
              departmentId: dept.id,
              purchaseDate,
              warrantyExpiry: warrantyExpiry ?? undefined,
              remark,
            },
            create: {
              assetCode,
              templateId: template?.id ?? null,
              deviceType,
              brand,
              model,
              serialNumber,
              os,
              cpu,
              memory,
              storage,
              status,
              currentUserName: status === AssetStatus.in_stock ? '' : currentUserName,
              departmentId: dept.id,
              purchaseDate,
              warrantyExpiry: warrantyExpiry ?? undefined,
              remark,
            },
            select: { id: true, status: true, currentUserName: true, departmentId: true },
          })
        } catch (e: any) {
          const code = String(e?.code ?? '')
          const targets: unknown[] = Array.isArray(e?.meta?.target) ? e.meta.target : []
          const bySerial = targets.some((t) => String(t).includes('serialNumber'))
          if (code === 'P2002' && bySerial) {
            pushSkip({ row: i + 2, reason: '序列号已存在（数据库唯一约束）', assetCode })
            continue
          }
          throw e
        }

        if (!skipDefaultFlowRecords) {
          // 用于时间轴排序：先写入“入库”，再写入实际状态对应的流转记录
          const baseActionDate = new Date()

          let finalAction: AssetRecordAction = AssetRecordAction.stock_in
          let recordUserName = asset.currentUserName
          const recordDeptId = asset.departmentId
          let expectedReturnDate: Date | undefined = undefined

          if (status === AssetStatus.waiting_pickup) finalAction = AssetRecordAction.assign
          if (status === AssetStatus.in_use) finalAction = AssetRecordAction.check_out
          if (status === AssetStatus.borrowed) {
            finalAction = AssetRecordAction.lend
            const expectedRaw = row['预计归还日期'] ?? row['expectedReturnDate'] ?? ''
            if (expectedRaw) {
              const d = new Date(expectedRaw)
              if (!Number.isNaN(d.getTime())) expectedReturnDate = d
            }
          }
          if (status === AssetStatus.in_repair) finalAction = AssetRecordAction.repair
          if (status === AssetStatus.retired) finalAction = AssetRecordAction.retire

          if (status === AssetStatus.in_stock) {
            recordUserName = ''
          }

          // Excel 导入来源标记：让你在“流转历史”里确认这些记录确实来自表格导入
          const excelSourceRemark = remark ? `${remark}\n来源：Excel导入` : '来源：Excel导入'

          if (status !== AssetStatus.in_stock) {
            // 先补一条入库（避免出现“只有领用没有入库”的观感问题）
            if (!stockInAssetsCache.has(asset.id)) {
              const hasStockIn = await tx.assetRecord.findFirst({
                where: { assetId: asset.id, action: AssetRecordAction.stock_in },
                select: { id: true },
              })
              if (hasStockIn) {
                stockInAssetsCache.add(asset.id)
              } else {
                await tx.assetRecord.create({
                  data: {
                    assetId: asset.id,
                    action: AssetRecordAction.stock_in,
                    userName: '',
                    departmentId: recordDeptId,
                    actionDate: new Date(baseActionDate.getTime() - 1),
                    expectedReturnDate: undefined,
                    proofImage: undefined,
                    remark: excelSourceRemark,
                    operatorId: authUser.id,
                    requestId: `import-${randomUUID()}-${i}-stock_in`,
                  },
                })
                stockInAssetsCache.add(asset.id)
              }
            }
          }

          await tx.assetRecord.create({
            data: {
              assetId: asset.id,
              action: finalAction,
              userName: recordUserName,
              departmentId: recordDeptId,
              actionDate: baseActionDate,
              expectedReturnDate,
              proofImage: undefined,
              remark: excelSourceRemark,
              operatorId: authUser.id,
              requestId: `import-${randomUUID()}-${i}-status`,
            },
          })
        }

        imported++
      }

      let backupRecordResult: RecordImportAccum | undefined
      if (importBackupRecords && recordRows.length) {
        backupRecordResult = await importBackupRecordsInTx(tx, recordRows, authUser.id, deptSortRef)
      }

      const invalidReasonStats: InvalidReasonStat[] = Array.from(reasonCounter.entries())
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason, 'zh-CN'))

      const recordInvalidReasonStats: InvalidReasonStat[] | undefined = backupRecordResult
        ? Array.from(backupRecordResult.reasonCounter.entries())
            .map(([reason, count]) => ({ reason, count }))
            .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason, 'zh-CN'))
        : undefined

      return {
        detectedRows,
        imported,
        importedRecords: backupRecordResult?.imported ?? 0,
        createdTemplates: templatesCreated,
        invalidRows: skippedCount,
        invalidReasonStats,
        skippedCount,
        skippedRows,
        importBackupRecords,
        skipDefaultFlowRecords,
        backupRecords: backupRecordResult
          ? {
              imported: backupRecordResult.imported,
              skippedCount: backupRecordResult.skippedCount,
              skippedRows: backupRecordResult.skippedRows,
              invalidReasonStats: recordInvalidReasonStats ?? [],
            }
          : undefined,
      }
    })

    res.json(result)
  },
)

/** 标准导入列顺序（与导出资产清单字段对齐，并补充导入常用列） */
const ASSET_IMPORT_TEMPLATE_HEADERS = [
  '电脑编号',
  '序列号',
  '设备类型',
  '模板名称',
  '品牌',
  '型号',
  '操作系统',
  'CPU',
  '内存',
  '存储',
  '设备状态',
  '现定人',
  '园区',
  '部门',
  '采购日期',
  '保修到期日',
  '预计归还日期',
  '配置',
  '备注',
] as const

/** 导出为独立 handler，并在 routes/index 上注册 GET /excel/template，避免子路由未命中 */
export function sendAssetImportTemplate(_req: Request, res: Response) {
  const exampleRow: Record<(typeof ASSET_IMPORT_TEMPLATE_HEADERS)[number], string> = {
    电脑编号: 'NX-PC-2506-001',
    序列号: '25129180263',
    设备类型: '笔记本',
    模板名称: '',
    品牌: '戴尔',
    型号: 'Latitude 3420',
    操作系统: 'Windows 10',
    CPU: 'i3-1115G4',
    内存: '16GB',
    存储: '256GB SSD',
    设备状态: '在库',
    现定人: '',
    园区: '泰鼎',
    部门: '未分配',
    采购日期: '2025-03-01',
    保修到期日: '',
    预计归还日期: '',
    配置: '可选：整机配置摘要（无分栏时写在这里）',
    备注: '可选说明',
  }

  const headerRow = [...ASSET_IMPORT_TEMPLATE_HEADERS]
  const sampleRow = ASSET_IMPORT_TEMPLATE_HEADERS.map((h) => exampleRow[h])
  const emptyRows = Array.from({ length: 20 }, () => ASSET_IMPORT_TEMPLATE_HEADERS.map(() => ''))
  const aoa = [headerRow, sampleRow, ...emptyRows]
  const dataSheet = xlsx.utils.aoa_to_sheet(aoa)
  dataSheet['!cols'] = ASSET_IMPORT_TEMPLATE_HEADERS.map(() => ({ wch: 14 }))

  const wb = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(wb, dataSheet, '资产导入')

  const helpAoa = [
    ['填写说明', ''],
    ['', ''],
    ['一、必填', '电脑编号必填。缺电脑编号的行将被忽略；序列号缺失将写入「暂无」。'],
    ['二、建议', '优先使用本模板列名，导入最稳定；勿改第一行列名。'],
    ['三、设备类型', '中文：笔记本、台式机、一体机、服务器；或英文：laptop、desktop、aio、server。'],
    ['四、设备状态', '在库、待领用、使用中、借用中、维修中、已报废；或对应英文枚举。'],
    ['五、模板名称', '若与「设备型号模板」中名称一致，可自动带出品牌/型号/配置等。'],
    ['六、型号未登记', '导入时系统将提示是否自动创建「设备型号模板」。'],
    ['七、日期', '采购日期、保修到期日、预计归还日期：建议 YYYY-MM-DD。'],
    ['八、借用', '状态为「借用中」时可填预计归还日期。'],
    ['九、配置', '若无单独 CPU/内存/存储列，可将摘要写在「配置」，会写入资产备注。'],
    [
      '十、园区与部门',
      '「园区」填擎鼎/爱鼎/泰鼎等；默认可填空按泰鼎。「部门」多级可用斜杠或短横线分隔，如：综合部门/信息中心 或 综合部门 - 信息中心。',
    ],
    [
      '十一、工作表',
      '导入资产时优先读取「资产清单」或「资产导入」工作表；否则使用第一个工作表。完整备份包另含「流转记录」表，需在导入页勾选对应选项。',
    ],
  ]
  const helpSheet = xlsx.utils.aoa_to_sheet(helpAoa)
  helpSheet['!cols'] = [{ wch: 22 }, { wch: 72 }]
  xlsx.utils.book_append_sheet(wb, helpSheet, '填写说明')

  const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' }) as Buffer
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', 'attachment; filename="asset-import-template.xlsx"')
  res.send(buffer)
}

excelRouter.get('/template', requireAuth, requirePermission('excel.import'), sendAssetImportTemplate)

excelRouter.get('/export', requireAuth, requirePermission('excel.export'), async (req, res) => {
  const type = typeof req.query.type === 'string' ? req.query.type : 'assets'

  if (type === 'assets') {
    const pageRaw = req.query.page
    const pageSizeRaw = req.query.pageSize
    const pageProvided = pageRaw !== undefined && pageRaw !== null && String(pageRaw).trim() !== ''
    const pageSizeProvided = pageSizeRaw !== undefined && pageSizeRaw !== null && String(pageSizeRaw).trim() !== ''

    let assets: any[]
    let fileName = 'assets.xlsx'

    const toNo = (v: unknown) => {
      const s = v === undefined || v === null ? '' : String(v)
      return s.trim() ? s : '暂无'
    }
    const fmtDate = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : '暂无')
    const displaySerial = (sn: string) => {
      const s = (sn ?? '').trim()
      if (!s) return '暂无'
      if (s === '暂无' || s.startsWith('暂无-')) return '暂无'
      return s
    }

    const pathRows = await prisma.department.findMany({ include: { campus: true } })
    const exportPathMap = buildDepartmentPathMap(pathRows)

    if (!pageProvided && !pageSizeProvided) {
      assets = await prisma.asset.findMany({
        orderBy: { id: 'desc' },
        include: { department: { include: { campus: true } }, template: true },
      })
    } else {
      const page = Number(pageRaw ?? 1)
      const pageSize = Number(pageSizeRaw ?? 500)
      if (!Number.isFinite(page) || page < 1) badRequest('page is invalid')
      if (!Number.isFinite(pageSize) || pageSize < 1 || pageSize > 10000) badRequest('pageSize is invalid')

      const total = await prisma.asset.count()
      assets = await prisma.asset.findMany({
        orderBy: { id: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { department: { include: { campus: true } }, template: true },
      })

      res.setHeader('X-Total-Count', String(total))
      res.setHeader('X-Page', String(page))
      res.setHeader('X-Page-Size', String(pageSize))
      fileName = `assets_p${page}.xlsx`
    }

    const sheet = xlsx.utils.json_to_sheet(
      assets.map((a) => {
        let 园区 = '暂无'
        let 部门 = '暂无'
        if (a.department) {
          园区 = toNo(a.department.campus?.name)
          const full = computeDepartmentDisplayPath(a.department as DepartmentWithCampus, exportPathMap)
          部门 = departmentPathWithoutCampus(full) || toNo(a.department.name)
        }
        return {
          电脑编号: a.assetCode,
          模板名称: toNo(a.template?.name),
          品牌: toNo(a.brand),
          型号: toNo(a.model),
          操作系统: toNo(a.os),
          CPU: toNo(a.cpu),
          内存: toNo(a.memory),
          存储: toNo(a.storage),
          序列号: displaySerial(a.serialNumber),
          设备状态: toNo(a.status),
          现定人: toNo(a.currentUserName),
          园区,
          部门,
          采购日期: fmtDate(a.purchaseDate ?? null),
          保修到期日: fmtDate(a.warrantyExpiry ?? null),
          备注: toNo(a.remark),
        }
      }),
    )
    const wb = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(wb, sheet, '资产清单')

    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' })
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    res.end(buffer)
    return
  }

  if (type === 'backup') {
    const toNo = (v: unknown) => {
      const s = v === undefined || v === null ? '' : String(v)
      return s.trim() ? s : '暂无'
    }
    const fmtDate = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : '暂无')
    const displaySerial = (sn: string) => {
      const s = (sn ?? '').trim()
      if (!s) return '暂无'
      if (s === '暂无' || s.startsWith('暂无-')) return '暂无'
      return s
    }

    const pathRows = await prisma.department.findMany({ include: { campus: true } })
    const exportPathMap = buildDepartmentPathMap(pathRows)

    const assets = await prisma.asset.findMany({
      orderBy: { id: 'desc' },
      include: { department: { include: { campus: true } }, template: true },
    })

    const assetSheet = xlsx.utils.json_to_sheet(
      assets.map((a) => {
        let 园区 = '暂无'
        let 部门 = '暂无'
        if (a.department) {
          园区 = toNo(a.department.campus?.name)
          const full = computeDepartmentDisplayPath(a.department as DepartmentWithCampus, exportPathMap)
          部门 = departmentPathWithoutCampus(full) || toNo(a.department.name)
        }
        return {
          电脑编号: a.assetCode,
          模板名称: toNo(a.template?.name),
          品牌: toNo(a.brand),
          型号: toNo(a.model),
          操作系统: toNo(a.os),
          CPU: toNo(a.cpu),
          内存: toNo(a.memory),
          存储: toNo(a.storage),
          序列号: displaySerial(a.serialNumber),
          设备状态: toNo(a.status),
          现定人: toNo(a.currentUserName),
          园区,
          部门,
          采购日期: fmtDate(a.purchaseDate ?? null),
          保修到期日: fmtDate(a.warrantyExpiry ?? null),
          备注: toNo(a.remark),
        }
      }),
    )

    const recPathRows = await prisma.department.findMany({ include: { campus: true } })
    const recPathMap = buildDepartmentPathMap(recPathRows)

    const records = await prisma.assetRecord.findMany({
      orderBy: { actionDate: 'asc' },
      include: { asset: true, department: { include: { campus: true } }, operator: true },
    })

    const recordSheet = xlsx.utils.json_to_sheet(
      records.map((r) => {
        let 园区 = '暂无'
        let 部门 = '暂无'
        if (r.department) {
          园区 = toNo(r.department.campus?.name)
          const full = computeDepartmentDisplayPath(r.department as DepartmentWithCampus, recPathMap)
          部门 = departmentPathWithoutCampus(full) || toNo(r.department.name)
        }
        return {
          requestId: r.requestId,
          action: r.action,
          操作时间: r.actionDate ? r.actionDate.toISOString() : '',
          操作类型: RECORD_EXPORT_ACTION_ZH[String(r.action)] ?? String(r.action),
          电脑编号: toNo(r.asset?.assetCode),
          用户: toNo(r.userName),
          园区,
          部门,
          预计归还日期: r.expectedReturnDate ? r.expectedReturnDate.toISOString().slice(0, 10) : '',
          凭证图片: toNo(r.proofImage),
          备注: toNo(r.remark),
          操作人账号: toNo(r.operator?.username),
          操作人: toNo(r.operator?.realName),
        }
      }),
    )

    const wb = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(wb, assetSheet, '资产清单')
    xlsx.utils.book_append_sheet(wb, recordSheet, '流转记录')

    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' })
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="assets_backup.xlsx"')
    res.end(buffer)
    return
  }

  if (type === 'records') {
    const startDate = typeof req.query.startDate === 'string' ? new Date(req.query.startDate) : undefined
    const endDate = typeof req.query.endDate === 'string' ? new Date(req.query.endDate) : undefined
    if (startDate && Number.isNaN(startDate.getTime())) badRequest('startDate is invalid')
    if (endDate && Number.isNaN(endDate.getTime())) badRequest('endDate is invalid')

    const where: any = {}
    if (startDate || endDate) {
      where.actionDate = {
        ...(startDate ? { gte: startDate } : {}),
        ...(endDate ? { lte: endDate } : {}),
      }
    }

    const toNo = (v: unknown) => {
      const s = v === undefined || v === null ? '' : String(v)
      return s.trim() ? s : '暂无'
    }

    const actionMap: Record<string, string> = {
      stock_in: '入库',
      assign: '待领用',
      cancel_assign: '取消分配',
      pick_up: '领用',
      check_out: '出库/领用',
      lend: '借出',
      return: '归还',
      transfer: '调拨',
      repair: '送修',
      repair_done: '维修完成',
      retire: '报废',
    }

    const pageRaw = req.query.page
    const pageSizeRaw = req.query.pageSize
    const pageProvided = pageRaw !== undefined && pageRaw !== null && String(pageRaw).trim() !== ''
    const pageSizeProvided = pageSizeRaw !== undefined && pageSizeRaw !== null && String(pageSizeRaw).trim() !== ''

    let records: any[]
    let fileName = 'records.xlsx'

    const recPathRows = await prisma.department.findMany({ include: { campus: true } })
    const recPathMap = buildDepartmentPathMap(recPathRows)

    if (!pageProvided && !pageSizeProvided) {
      records = await prisma.assetRecord.findMany({
        where,
        orderBy: { actionDate: 'desc' },
        include: { asset: true, department: { include: { campus: true } }, operator: true },
      })
    } else {
      const page = Number(pageRaw ?? 1)
      const pageSize = Number(pageSizeRaw ?? 500)
      if (!Number.isFinite(page) || page < 1) badRequest('page is invalid')
      if (!Number.isFinite(pageSize) || pageSize < 1 || pageSize > 10000) badRequest('pageSize is invalid')

      const total = await prisma.assetRecord.count({ where })
      records = await prisma.assetRecord.findMany({
        where,
        orderBy: { actionDate: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { asset: true, department: { include: { campus: true } }, operator: true },
      })

      res.setHeader('X-Total-Count', String(total))
      res.setHeader('X-Page', String(page))
      res.setHeader('X-Page-Size', String(pageSize))
      fileName = `records_p${page}.xlsx`
    }

    const sheet = xlsx.utils.json_to_sheet(
      records.map((r) => {
        let 园区 = '暂无'
        let 部门 = '暂无'
        if (r.department) {
          园区 = toNo(r.department.campus?.name)
          const full = computeDepartmentDisplayPath(r.department as DepartmentWithCampus, recPathMap)
          部门 = departmentPathWithoutCampus(full) || toNo(r.department.name)
        }
        return {
        操作时间: r.actionDate ? r.actionDate.toISOString() : '暂无',
        操作类型: actionMap[String(r.action)] ?? toNo(r.action),
        电脑编号: toNo(r.asset?.assetCode),
        用户: toNo(r.userName),
        园区,
        部门,
        预计归还日期: r.expectedReturnDate ? r.expectedReturnDate.toISOString().slice(0, 10) : '暂无',
        凭证图片: toNo(r.proofImage),
        备注: toNo(r.remark),
        操作人: toNo(r.operator?.realName ?? r.operator?.username),
        IP: '', // 这里我们不额外导出 OperationLog ipAddress，避免冗余
        }
      }),
    )

    const wb = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(wb, sheet, '出入库记录')

    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' })
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    res.end(buffer)
    return
  }

  badRequest('Invalid export type. Use type=assets|records|backup')
})

export { excelRouter }

