import { Router } from 'express'
import { AssetStatus, AssetRecordAction } from '@prisma/client'

import type { AccessAuth } from '../auth/accessContext'
import { applyCampusScopeToAssetWhere, applyCampusScopeToRecordWhere } from '../auth/accessContext'
import { prisma } from '../prisma'
import { requireAuth, requirePermission } from '../middleware/auth'
import {
  attachDepartmentPathFields,
  computeDepartmentDisplayPath,
  type DepartmentWithCampus,
} from '../utils/departmentDisplay'
import { getDepartmentPathSnapshot } from '../utils/departmentPath'

/** 与「一人一机」一致：这些状态下资产记在某人名下 */
const HOLDER_STATUSES: AssetStatus[] = [
  AssetStatus.in_use,
  AssetStatus.waiting_pickup,
  AssetStatus.borrowed,
  AssetStatus.in_repair,
]

function badRequest(message: string, details?: unknown): never {
  throw { statusCode: 400, message, details }
}

function toInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value)
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    if (Number.isFinite(n)) return Math.trunc(n)
  }
  return null
}

async function getConfigNumber(key: string, defaultValue: number) {
  const cfg = await prisma.systemConfig.findUnique({ where: { configKey: key } })
  if (!cfg) return defaultValue
  const n = Number(cfg.configValue)
  return Number.isFinite(n) ? n : defaultValue
}

export const dashboardRouter = Router()

function scopedAssetWhere(access: AccessAuth, extra: Record<string, unknown> = {}) {
  const w = { ...extra }
  applyCampusScopeToAssetWhere(w, access)
  return w
}

dashboardRouter.get('/stats', requireAuth, requirePermission('dashboard.view'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const [
    totalCount,
    inStockCount,
    waitingPickupCount,
    inUseCount,
    borrowedCount,
    inRepairCount,
  ] = await Promise.all([
    prisma.asset.count({ where: scopedAssetWhere(access) }),
    prisma.asset.count({ where: scopedAssetWhere(access, { status: AssetStatus.in_stock }) }),
    prisma.asset.count({ where: scopedAssetWhere(access, { status: AssetStatus.waiting_pickup }) }),
    prisma.asset.count({ where: scopedAssetWhere(access, { status: AssetStatus.in_use }) }),
    prisma.asset.count({ where: scopedAssetWhere(access, { status: AssetStatus.borrowed }) }),
    prisma.asset.count({ where: scopedAssetWhere(access, { status: AssetStatus.in_repair }) }),
  ])

  const statusPie = [
    { name: '在库', value: inStockCount },
    { name: '待领用', value: waitingPickupCount },
    { name: '使用中', value: inUseCount },
    { name: '借用中', value: borrowedCount },
    { name: '维修中', value: inRepairCount },
  ]

  const [inUseByDept, borrowedByDept, typeByType] = await Promise.all([
    prisma.asset.groupBy({
      by: ['departmentId'],
      where: scopedAssetWhere(access, { status: AssetStatus.in_use }),
      _count: { _all: true },
    }),
    prisma.asset.groupBy({
      by: ['departmentId'],
      where: scopedAssetWhere(access, { status: AssetStatus.borrowed }),
      _count: { _all: true },
    }),
    prisma.asset.groupBy({
      by: ['deviceType'],
      where: scopedAssetWhere(access),
      _count: { _all: true },
    }),
  ])

  const deptIds = new Set<number>([
    ...inUseByDept.map((x) => x.departmentId),
    ...borrowedByDept.map((x) => x.departmentId),
  ])
  const { pathRows: allDeptsForPath, pathMap } = await getDepartmentPathSnapshot()
  const deptById = new Map(allDeptsForPath.map((d) => [d.id, d]))
  const deptLabel = (id: number) => {
    const d = deptById.get(id)
    return d ? computeDepartmentDisplayPath(d as DepartmentWithCampus, pathMap) : String(id)
  }

  const departments = Array.from(deptIds).map((id) => {
    const u = inUseByDept.find((x) => x.departmentId === id)
    const b = borrowedByDept.find((x) => x.departmentId === id)
    return {
      departmentId: id,
      departmentName: deptLabel(id),
      inUse: u?._count._all ?? 0,
      borrowed: b?._count._all ?? 0,
    }
  })

  const deviceTypeDistribution = typeByType.map((x) => ({
    deviceType: x.deviceType,
    count: x._count._all,
  }))

  const multiGroups = await prisma.asset.groupBy({
    by: ['currentUserName'],
    where: scopedAssetWhere(access, {
      currentUserName: { not: '' },
      status: { in: HOLDER_STATUSES },
    }),
    _count: { _all: true },
  })
  const multiNameRows = multiGroups.filter((g) => g._count._all >= 2 && g.currentUserName.trim() !== '')
  const multiUserNames = multiNameRows.map((g) => g.currentUserName)

  let multiDeviceHolders: Array<{
    userName: string
    count: number
    assets: Array<{
      id: number
      assetCode: string
      status: AssetStatus
      departmentName: string
    }>
  }> = []

  if (multiUserNames.length > 0) {
    const holderAssets = await prisma.asset.findMany({
      where: scopedAssetWhere(access, {
        currentUserName: { in: multiUserNames },
        status: { in: HOLDER_STATUSES },
      }),
      include: {
        department: { include: { campus: true } },
      },
      orderBy: [{ currentUserName: 'asc' }, { assetCode: 'asc' }],
    })
    const byUser = new Map<string, typeof holderAssets>()
    for (const a of holderAssets) {
      const key = a.currentUserName
      const list = byUser.get(key)
      if (list) list.push(a)
      else byUser.set(key, [a])
    }
    multiDeviceHolders = multiNameRows
      .map((g) => ({
        userName: g.currentUserName,
        count: g._count._all,
        assets: (byUser.get(g.currentUserName) ?? []).map((a) => ({
          id: a.id,
          assetCode: a.assetCode,
          status: a.status,
          departmentName: a.department
            ? computeDepartmentDisplayPath(a.department as DepartmentWithCampus, pathMap)
            : '',
        })),
      }))
      .sort((a, b) => b.count - a.count || a.userName.localeCompare(b.userName, 'zh-CN'))
  }

  res.json({
    totalCount,
    inStockCount,
    waitingPickupCount,
    inUseCount,
    borrowedCount,
    inRepairCount,
    statusPie,
    departments,
    deviceTypeDistribution,
    multiDeviceHolders,
  })
})

dashboardRouter.get('/monthly-stats', requireAuth, requirePermission('dashboard.view'), async (req, res) => {
  const access = (req as any).access as AccessAuth

  // 最近 12 个月（含当月）
  const now = new Date()
  const months: string[] = []
  const buckets: { start: Date; end: Date }[] = []
  for (let i = 11; i >= 0; i--) {
    const y = now.getFullYear()
    const m = now.getMonth() - i
    const d = new Date(y, m, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.push(key)
    buckets.push({ start: d, end: new Date(d.getFullYear(), d.getMonth() + 1, 1) })
  }

  // 业务动作分组：排除 manual_note / signature_reset / transfer_undo
  const businessActions: AssetRecordAction[] = [
    AssetRecordAction.stock_in,
    AssetRecordAction.check_out,
    AssetRecordAction.pick_up,
    AssetRecordAction.transfer,
    AssetRecordAction.lend,
    AssetRecordAction.return,
    AssetRecordAction.repair,
    AssetRecordAction.repair_done,
    AssetRecordAction.retire,
  ]

  const recWhere: Record<string, unknown> = {
    action: { in: businessActions },
    actionDate: { gte: buckets[0].start, lt: buckets[buckets.length - 1].end },
  }
  applyCampusScopeToRecordWhere(recWhere, access)

  // 取窗口内所有业务记录，按月份+动作在 JS 中归桶（SQLite 不便按月 groupBy）
  const rows = await prisma.assetRecord.findMany({
    where: recWhere as any,
    select: { actionDate: true, action: true },
  })

  const countByMonthAction = new Map<string, number>()
  for (const r of rows) {
    const d = r.actionDate instanceof Date ? r.actionDate : new Date(r.actionDate as any)
    if (Number.isNaN(d.getTime())) continue
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!months.includes(key)) continue
    const k = `${key}|${String(r.action)}`
    countByMonthAction.set(k, (countByMonthAction.get(k) ?? 0) + 1)
  }

  // 输出分组：入库 / 出库 / 调拨 / 借出 / 归还 / 维修 / 报废
  const result = months.map((month) => {
    const get = (...actions: AssetRecordAction[]) =>
      actions.reduce(
        (sum, a) => sum + (countByMonthAction.get(`${month}|${a}`) ?? 0),
        0,
      )
    return {
      month,
      stockIn: get(AssetRecordAction.stock_in),
      checkOut:
        get(AssetRecordAction.check_out) + get(AssetRecordAction.pick_up),
      transfer: get(AssetRecordAction.transfer),
      lend: get(AssetRecordAction.lend),
      return: get(AssetRecordAction.return),
      repair:
        get(AssetRecordAction.repair) + get(AssetRecordAction.repair_done),
      retire: get(AssetRecordAction.retire),
    }
  })

  res.json({ months: result })
})

dashboardRouter.get('/recent-records', requireAuth, requirePermission('dashboard.view'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const allowed: AssetRecordAction[] = [
    AssetRecordAction.stock_in,
    AssetRecordAction.check_out,
    AssetRecordAction.assign,
    AssetRecordAction.cancel_assign,
    AssetRecordAction.pick_up,
    AssetRecordAction.lend,
    AssetRecordAction.return,
    AssetRecordAction.transfer,
    AssetRecordAction.repair_done,
    AssetRecordAction.retire,
  ]

  const recWhere: Record<string, unknown> = { action: { in: allowed } }
  applyCampusScopeToRecordWhere(recWhere, access)
  const records = await prisma.assetRecord.findMany({
    where: recWhere as any,
    orderBy: { actionDate: 'desc' },
    take: 10,
    include: {
      asset: true,
      department: { include: { campus: true } },
      operator: { select: { id: true, username: true, realName: true } },
    },
  })

  const { pathMap: listPathMap } = await getDepartmentPathSnapshot()
  const enriched = records.map((rec) => ({
    ...rec,
    department: attachDepartmentPathFields(rec.department as DepartmentWithCampus | null, listPathMap) ?? null,
  }))

  res.json({ records: enriched })
})

dashboardRouter.get('/notifications', requireAuth, requirePermission('dashboard.view'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const borrowAdvanceAlertDays = await getConfigNumber('borrow_advance_alert_days', 1)
  const waitingPickupAlertDays = await getConfigNumber('waiting_pickup_alert_days', 3)

  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const borrowedAssets = await prisma.asset.findMany({
    where: scopedAssetWhere(access, { status: AssetStatus.borrowed }),
    include: {
      department: { include: { campus: true } },
      records: {
        where: { action: AssetRecordAction.lend },
        orderBy: { actionDate: 'desc' },
        take: 1,
      },
    },
  })

  const overdue: any[] = []
  const dueSoon: any[] = []

  const { pathMap: notifPathMap } = await getDepartmentPathSnapshot()

  for (const a of borrowedAssets) {
    const rec = a.records[0]
    const expected = rec?.expectedReturnDate
    if (!expected) continue
    const diffDays = Math.ceil((expected.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) {
      overdue.push({
        assetId: a.id,
        assetCode: a.assetCode,
        currentUserName: a.currentUserName,
        departmentId: a.departmentId,
        departmentName: a.department
          ? computeDepartmentDisplayPath(a.department as DepartmentWithCampus, notifPathMap)
          : '',
        expectedReturnDate: rec.expectedReturnDate,
        daysOverdue: Math.abs(diffDays),
      })
    } else if (diffDays <= borrowAdvanceAlertDays) {
      dueSoon.push({
        assetId: a.id,
        assetCode: a.assetCode,
        currentUserName: a.currentUserName,
        departmentId: a.departmentId,
        departmentName: a.department
          ? computeDepartmentDisplayPath(a.department as DepartmentWithCampus, notifPathMap)
          : '',
        expectedReturnDate: rec.expectedReturnDate,
        daysRemaining: diffDays,
      })
    }
  }

  const waitingAssets = await prisma.asset.findMany({
    where: scopedAssetWhere(access, { status: AssetStatus.waiting_pickup }),
    include: {
      department: { include: { campus: true } },
      records: {
        where: { action: AssetRecordAction.assign },
        orderBy: { actionDate: 'desc' },
        take: 1,
      },
    },
  })

  const waitingPickupTimeout: any[] = []
  for (const a of waitingAssets) {
    const rec = a.records[0]
    const assignedAt = rec?.actionDate
    if (!assignedAt) continue
    const diffDays = Math.ceil((startOfToday.getTime() - assignedAt.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays > waitingPickupAlertDays) {
      waitingPickupTimeout.push({
        assetId: a.id,
        assetCode: a.assetCode,
        currentUserName: a.currentUserName,
        departmentId: a.departmentId,
        departmentName: a.department
          ? computeDepartmentDisplayPath(a.department as DepartmentWithCampus, notifPathMap)
          : '',
        assignedAt: rec.actionDate,
        daysWaiting: diffDays,
      })
    }
  }

  res.json({
    overdue,
    dueSoon,
    waitingPickupTimeout,
  })
})

