import { Router } from 'express'

import { prisma } from '../prisma'
import { requireAuth, requireRole } from '../middleware/auth'
import { getEnv } from '../utils/env'

import { AssetStatus, AssetRecordAction, DeviceType, RepairResult, Role, Prisma } from '@prisma/client'

const adminRoles: Role[] = ['super_admin', 'admin']
const superAdminRoles: Role[] = ['super_admin']

function toInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value)
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    if (Number.isFinite(n)) return Math.trunc(n)
  }
  return null
}

function badRequest(message: string, details?: unknown): never {
  throw { statusCode: 400, message, details }
}

export const assetsRouter = Router()

assetsRouter.get('/', requireAuth, async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : ''
  const status = typeof req.query.status === 'string' ? req.query.status : undefined
  const departmentId = toInt(req.query.departmentId)

  const page = Math.max(1, toInt(req.query.page) ?? 1)
  const pageSize = Math.min(100, Math.max(1, toInt(req.query.pageSize) ?? 20))

  const where: any = {}
  if (status && Object.values(AssetStatus).includes(status as AssetStatus)) {
    where.status = status
  }
  if (departmentId) {
    where.departmentId = departmentId
  }
  if (q) {
    where.OR = [
      { assetCode: { contains: q } },
      { brand: { contains: q } },
      { model: { contains: q } },
      { serialNumber: { contains: q } },
      { currentUserName: { contains: q } },
    ]
  }

  const total = await prisma.asset.count({ where })
  const items = await prisma.asset.findMany({
    where,
    orderBy: { id: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      department: true,
      template: true,
    },
  })

  res.json({ items, total, page, pageSize })
})

assetsRouter.get('/generate-code', requireAuth, requireRole(adminRoles), async (_req, res) => {
  const { YEAR, MONTH } = (() => {
    const d = new Date()
    const year = String(d.getFullYear()).slice(-2)
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return { YEAR: year, MONTH: month }
  })()

  const prefix = `NX-PC-${YEAR}${MONTH}-`
  const last = await prisma.asset.findFirst({
    where: { assetCode: { startsWith: prefix } },
    orderBy: { assetCode: 'desc' },
    select: { assetCode: true },
  })

  const lastSeq = last ? Number(last.assetCode.slice(prefix.length)) : 0
  const nextSeq = String(lastSeq + 1).padStart(3, '0')

  res.json({ assetCode: `${prefix}${nextSeq}` })
})

assetsRouter.get('/:id', requireAuth, async (req, res) => {
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid asset id')

  const asset = await prisma.asset.findUnique({
    where: { id },
    include: { department: true, template: true },
  })
  if (!asset) return res.status(404).json({ error: { message: 'Asset not found' } })

  res.json({ asset })
})

assetsRouter.get('/:id/records', requireAuth, async (req, res) => {
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid asset id')

  const records = await prisma.assetRecord.findMany({
    where: { assetId: id },
    orderBy: { actionDate: 'desc' },
    include: { department: true, operator: true },
  })

  res.json({ records })
})

assetsRouter.get('/:id/repairs', requireAuth, async (req, res) => {
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid asset id')

  const repairs = await prisma.repairRecord.findMany({
    where: { assetId: id },
    orderBy: { startDate: 'desc' },
  })

  res.json({ repairs })
})

assetsRouter.get('/:id/change-logs', requireAuth, async (req, res) => {
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid asset id')

  const logs = await prisma.operationLog.findMany({
    where: {
      targetType: 'Asset',
      targetId: id,
      action: { contains: '关键信息' },
    },
    orderBy: { createdAt: 'desc' },
    include: { operator: { select: { id: true, username: true, realName: true } } },
  })
  res.json({ logs })
})

assetsRouter.post('/', requireAuth, requireRole(adminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }

  // 这里用 `any` 是为了避免 TypeScript 对 req.body 的重载/unknown 过度收紧。
  // 我们依赖下面的 `typeof` 校验来保证运行时类型正确。
  const body = req.body as any

  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  if (typeof body.serialNumber !== 'string' || body.serialNumber.trim() === '') badRequest('serialNumber is required')
  if (typeof body.departmentId !== 'number') badRequest('departmentId is required')

  const existRecord = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (existRecord) {
    const existingAsset = await prisma.asset.findUnique({ where: { id: existRecord.assetId } })
    return res.json({ alreadyProcessed: true, asset: existingAsset })
  }

  const templateId = toInt(body.templateId)
  const template = templateId ? await prisma.assetTemplate.findUnique({ where: { id: templateId } }) : null

  const assetCode =
    typeof body.assetCode === 'string' && body.assetCode.trim() !== ''
      ? body.assetCode
      : (() => {
          // 为了保持阶段 2 可跑通，这里要求前端/调用方给出 assetCode 或使用 generate-code。
          badRequest('assetCode is required unless you call /generate-code')
        })()

  const deviceTypeCandidate =
    body.deviceType && Object.values(DeviceType).includes(body.deviceType as DeviceType)
      ? (body.deviceType as DeviceType)
      : template?.deviceType
  const deviceType: DeviceType = deviceTypeCandidate ?? badRequest('deviceType is required (or templateId provides it)')

  const brand = (typeof body.brand === 'string' ? body.brand : template?.brand) ?? badRequest('brand is required')
  const model = (typeof body.model === 'string' ? body.model : template?.model) ?? badRequest('model is required')
  const os = (typeof body.os === 'string' ? body.os : template?.os) ?? badRequest('os is required')
  const cpu = (typeof body.cpu === 'string' ? body.cpu : template?.cpu) ?? badRequest('cpu is required')
  const memory = (typeof body.memory === 'string' ? body.memory : template?.memory) ?? badRequest('memory is required')
  const storage = (typeof body.storage === 'string' ? body.storage : template?.storage) ?? badRequest('storage is required')

  const purchaseDate = body.purchaseDate ? new Date(body.purchaseDate as any) : new Date()
  if (Number.isNaN(purchaseDate.getTime())) badRequest('purchaseDate is invalid')

  const warrantyExpiry = body.warrantyExpiry ? new Date(body.warrantyExpiry as any) : null
  if (warrantyExpiry && Number.isNaN(warrantyExpiry.getTime())) badRequest('warrantyExpiry is invalid')

  const currentUserName = typeof body.currentUserName === 'string' ? body.currentUserName : ''

  const departmentId: number = body.departmentId

  let asset: any
  try {
    asset = await prisma.$transaction(async (tx) => {
      const created = await tx.asset.create({
        data: {
          assetCode,
          templateId: template?.id ?? null,
          deviceType,
          brand,
          model,
          serialNumber: body.serialNumber,
          os,
          cpu,
          memory,
          storage,
          status: AssetStatus.in_stock,
          currentUserName,
          departmentId,
          purchaseDate,
          warrantyExpiry: warrantyExpiry ?? undefined,
          remark: typeof body.remark === 'string' ? body.remark : undefined,
        },
      })

      await tx.assetRecord.create({
        data: {
          assetId: created.id,
          action: AssetRecordAction.stock_in,
          userName: currentUserName,
          departmentId,
          actionDate: new Date(),
          expectedReturnDate: undefined,
          proofImage: undefined,
          remark: typeof body.remark === 'string' ? body.remark : undefined,
          operatorId: authUser.id,
          requestId: body.requestId,
        },
      })

      await tx.operationLog.create({
        data: {
          operatorId: authUser.id,
          action: '新增资产/入库',
          targetType: 'Asset',
          targetId: created.id,
          detail: {
            assetCode: created.assetCode,
            serialNumber: created.serialNumber,
          },
          ipAddress: req.ip ?? 'unknown',
        },
      })

      return created
    })
  } catch (e: any) {
    if (e?.code === 'P2002') {
      const metaTarget = (e.meta as any)?.target
      const targets = Array.isArray(metaTarget) ? metaTarget : metaTarget ? [metaTarget] : []
      if (targets.some((t) => String(t).includes('assetCode'))) {
        throw { statusCode: 400, code: 'DUPLICATE_ASSET_CODE', message: '电脑编号（assetCode）已存在，请勿重复入库' }
      }
      if (targets.some((t) => String(t).includes('serialNumber'))) {
        throw { statusCode: 400, code: 'DUPLICATE_SERIAL_NUMBER', message: '序列号（serialNumber）已存在，请勿重复入库' }
      }
      throw { statusCode: 400, code: 'DUPLICATE_UNIQUE_FIELD', message: '唯一性校验失败：字段已存在' }
    }
    throw e
  }

  res.json({ asset })
})

assetsRouter.put('/:id', requireAuth, requireRole(superAdminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid asset id')

  const body = req.body as any

  const version = typeof body.version === 'number' ? body.version : null
  if (!version) badRequest('version is required for optimistic lock')

  const templateId = toInt(body.templateId)
  const template = templateId ? await prisma.assetTemplate.findUnique({ where: { id: templateId } }) : null

  const deviceTypeCandidate =
    body.deviceType && Object.values(DeviceType).includes(body.deviceType as DeviceType)
      ? (body.deviceType as DeviceType)
      : template?.deviceType
  const deviceType: DeviceType = deviceTypeCandidate ?? badRequest('deviceType is required (or templateId provides it)')

  const old = await prisma.asset.findUnique({ where: { id } })
  if (!old) return res.status(404).json({ error: { message: 'Asset not found' } })

  const forceCustom = Boolean(body.forceCustom)
  const resolvedTemplateId =
    forceCustom ? null : typeof body.templateId === 'undefined' ? old.templateId : (template?.id ?? null)

  const nextData = {
    assetCode: typeof body.assetCode === 'string' && body.assetCode.trim() ? body.assetCode.trim() : old.assetCode,
    serialNumber:
      typeof body.serialNumber === 'string' && body.serialNumber.trim() ? body.serialNumber.trim() : old.serialNumber,
    templateId: resolvedTemplateId,
    deviceType,
    brand: typeof body.brand === 'string' ? body.brand : template?.brand,
    model: typeof body.model === 'string' ? body.model : template?.model,
    os: typeof body.os === 'string' ? body.os : template?.os,
    cpu: typeof body.cpu === 'string' ? body.cpu : template?.cpu,
    memory: typeof body.memory === 'string' ? body.memory : template?.memory,
    storage: typeof body.storage === 'string' ? body.storage : template?.storage,
    remark: typeof body.remark === 'string' ? body.remark : undefined,
    currentUserName: typeof body.currentUserName === 'string' ? body.currentUserName : undefined,
    departmentId: typeof body.departmentId === 'number' ? body.departmentId : undefined,
  }

  let updated
  try {
    updated = await prisma.asset.updateMany({
      where: { id, version },
      data: {
        ...nextData,
        version: { increment: 1 },
      },
    })
  } catch (e: any) {
    if (e?.code === 'P2002') {
      const metaTarget = (e.meta as any)?.target
      const targets = Array.isArray(metaTarget) ? metaTarget : metaTarget ? [metaTarget] : []
      if (targets.some((t) => String(t).includes('assetCode'))) {
        throw { statusCode: 400, code: 'DUPLICATE_ASSET_CODE', message: '电脑编号（assetCode）已存在，请勿重复' }
      }
      if (targets.some((t) => String(t).includes('serialNumber'))) {
        throw { statusCode: 400, code: 'DUPLICATE_SERIAL_NUMBER', message: '序列号（serialNumber）已存在，请勿重复' }
      }
      throw { statusCode: 400, code: 'DUPLICATE_UNIQUE_FIELD', message: '唯一性校验失败：字段已存在' }
    }
    throw e
  }

  if (updated.count === 0) {
    return res.status(409).json({ error: { message: 'Version conflict, please refresh and retry' } })
  }

  const asset = await prisma.asset.findUnique({ where: { id }, include: { department: true, template: true } })

  const before = {
    templateId: old.templateId,
    assetCode: old.assetCode,
    serialNumber: old.serialNumber,
    brand: old.brand,
    model: old.model,
    os: old.os,
    cpu: old.cpu,
    memory: old.memory,
    storage: old.storage,
  }
  const after = {
    templateId: asset?.templateId,
    assetCode: asset?.assetCode,
    serialNumber: asset?.serialNumber,
    brand: asset?.brand,
    model: asset?.model,
    os: asset?.os,
    cpu: asset?.cpu,
    memory: asset?.memory,
    storage: asset?.storage,
  }
  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '编辑资产关键信息',
      targetType: 'Asset',
      targetId: id,
      detail: {
        versionFrom: version,
        versionTo: version + 1,
        before,
        after,
        detachedTemplate: old.templateId && asset?.templateId === null ? true : undefined,
      },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ asset })
})

assetsRouter.delete('/:id', requireAuth, requireRole(['super_admin']), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid asset id')

  const asset = await prisma.asset.findUnique({ where: { id } })
  if (!asset) return res.status(404).json({ error: { message: 'Asset not found' } })

  if (asset.status !== AssetStatus.in_stock && asset.status !== AssetStatus.retired) {
    badRequest('Only assets in_stock or retired can be deleted')
  }

  await prisma.$transaction(async (tx) => {
    await tx.assetRecord.deleteMany({ where: { assetId: id } })
    await tx.repairRecord.deleteMany({ where: { assetId: id } })
    await tx.asset.delete({ where: { id } })
    await tx.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '删除资产',
        targetType: 'Asset',
        targetId: id,
        detail: { assetCode: asset.assetCode },
        ipAddress: req.ip ?? 'unknown',
      },
    })
  })

  res.json({ ok: true })
})

