import { Router } from 'express'

import type { AccessAuth } from '../auth/accessContext'
import { assertCampusAccess } from '../auth/accessContext'
import { prisma } from '../prisma'
import { requireAuth, requirePermission } from '../middleware/auth'

import { AssetStatus, AssetRecordAction, RepairResult } from '@prisma/client'

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

function badNotFound(message: string): never {
  throw { statusCode: 404, message }
}

async function getConfigBoolean(key: string, defaultValue: boolean) {
  const cfg = await prisma.systemConfig.findUnique({ where: { configKey: key } })
  if (!cfg) return defaultValue
  return cfg.configValue === 'true' || cfg.configValue === '1'
}

function toBoolean(value: unknown): boolean {
  if (value === true) return true
  if (value === false) return false
  if (value === 'true') return true
  if (value === '1') return true
  return false
}

type TxOps = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

async function getUnassignedDepartmentIdForCampus(tx: TxOps, campusId: number) {
  const dept = await tx.department.findFirst({
    where: { name: '未分配', campusId, parentId: null },
  })
  if (!dept) badRequest(`缺少园区「未分配」部门（campusId=${campusId}）`)
  return dept.id
}

async function assertDeptCampus(tx: TxOps, access: AccessAuth, departmentId: number) {
  const d = await tx.department.findUnique({ where: { id: departmentId }, select: { campusId: true } })
  if (!d) badRequest('部门不存在')
  assertCampusAccess(access, d.campusId)
}

export const operationsRouter = Router()

operationsRouter.post('/check-out', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')
  if (typeof body.userName !== 'string' || body.userName.trim() === '') badRequest('userName is required')
  const userName = body.userName.trim()
  const departmentId = toInt(body.departmentId)
  if (!departmentId) badRequest('departmentId is required')
  const ignoreConflict = toBoolean(body.ignoreConflict)

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const onePersonOneDeviceEnabled = await getConfigBoolean('one_person_one_device', false)
  if (onePersonOneDeviceEnabled && !ignoreConflict) {
    const conflicts = await prisma.asset.findMany({
      where: {
        currentUserName: userName,
        status: {
          in: [AssetStatus.in_use, AssetStatus.waiting_pickup, AssetStatus.borrowed, AssetStatus.in_repair],
        },
      },
      select: { id: true, assetCode: true, status: true },
    })
    if (conflicts.length > 0) {
      throw {
        statusCode: 409,
        message: 'One person one device conflict',
        code: 'ONE_PERSON_ONE_DEVICE_CONFLICT',
        details: { conflicts },
      }
    }
  }

  const now = new Date()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: assetId },
      include: { department: { select: { campusId: true } } },
    })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.in_stock) badRequest('Asset must be in_stock for check-out')
    assertCampusAccess(access, asset.department.campusId)
    await assertDeptCampus(tx, access, departmentId)

    await tx.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.pending_confirmation, currentUserName: userName, departmentId },
    })

    const assetRecord = await tx.assetRecord.create({
      data: {
        assetId,
        action: AssetRecordAction.check_out,
        userName,
        departmentId,
        actionDate: now,
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
        action: '出库（直接领用）',
        targetType: 'Asset',
        targetId: assetId,
        detail: { from: asset.status, to: AssetStatus.pending_confirmation },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/assign', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')
  if (typeof body.userName !== 'string' || body.userName.trim() === '') badRequest('userName is required')
  const departmentId = toInt(body.departmentId)
  if (!departmentId) badRequest('departmentId is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const now = new Date()
  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: assetId },
      include: { department: { select: { campusId: true } } },
    })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.in_stock) badRequest('Asset must be in_stock for assign')
    assertCampusAccess(access, asset.department.campusId)
    await assertDeptCampus(tx, access, departmentId)

    await tx.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.waiting_pickup, currentUserName: body.userName, departmentId },
    })

    const assetRecord = await tx.assetRecord.create({
      data: {
        assetId,
        action: AssetRecordAction.assign,
        userName: body.userName,
        departmentId,
        actionDate: now,
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
        action: '分配（待领用）',
        targetType: 'Asset',
        targetId: assetId,
        detail: { from: asset.status, to: AssetStatus.waiting_pickup },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/cancel-assign', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const now = new Date()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: assetId },
      include: { department: { select: { campusId: true } } },
    })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.waiting_pickup) badRequest('Asset must be waiting_pickup for cancel-assign')
    assertCampusAccess(access, asset.department.campusId)

    const unassignedDepartmentId = await getUnassignedDepartmentIdForCampus(tx, asset.department.campusId)

    await tx.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.in_stock, currentUserName: '', departmentId: unassignedDepartmentId },
    })

    const assetRecord = await tx.assetRecord.create({
      data: {
        assetId,
        action: AssetRecordAction.cancel_assign,
        userName: asset.currentUserName,
        departmentId: asset.departmentId,
        actionDate: now,
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
        action: '取消分配',
        targetType: 'Asset',
        targetId: assetId,
        detail: { from: asset.status, to: AssetStatus.in_stock },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/pick-up', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const now = new Date()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: assetId },
      include: { department: { select: { campusId: true } } },
    })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.waiting_pickup) badRequest('Asset must be waiting_pickup for pick-up')
    assertCampusAccess(access, asset.department.campusId)

    await tx.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.in_use },
    })

    const assetRecord = await tx.assetRecord.create({
      data: {
        assetId,
        action: AssetRecordAction.pick_up,
        userName: asset.currentUserName,
        departmentId: asset.departmentId,
        actionDate: now,
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
        action: '确认领用',
        targetType: 'Asset',
        targetId: assetId,
        detail: { from: asset.status, to: AssetStatus.in_use },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/lend', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')
  if (typeof body.userName !== 'string' || body.userName.trim() === '') badRequest('userName is required')
  const userName = body.userName.trim()
  const departmentId = toInt(body.departmentId)
  if (!departmentId) badRequest('departmentId is required')
  const ignoreConflict = toBoolean(body.ignoreConflict)

  if (!body.expectedReturnDate) badRequest('expectedReturnDate is required')
  const expectedReturnDate = new Date(body.expectedReturnDate as any)
  if (Number.isNaN(expectedReturnDate.getTime())) badRequest('expectedReturnDate is invalid')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const onePersonOneDeviceEnabled = await getConfigBoolean('one_person_one_device', false)
  if (onePersonOneDeviceEnabled && !ignoreConflict) {
    const conflicts = await prisma.asset.findMany({
      where: {
        currentUserName: userName,
        status: {
          in: [AssetStatus.in_use, AssetStatus.waiting_pickup, AssetStatus.borrowed, AssetStatus.in_repair],
        },
      },
      select: { id: true, assetCode: true, status: true },
    })
    if (conflicts.length > 0) {
      throw {
        statusCode: 409,
        message: 'One person one device conflict',
        code: 'ONE_PERSON_ONE_DEVICE_CONFLICT',
        details: { conflicts },
      }
    }
  }

  const now = new Date()
  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: assetId },
      include: { department: { select: { campusId: true } } },
    })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.in_stock) badRequest('Asset must be in_stock for lend')
    assertCampusAccess(access, asset.department.campusId)
    await assertDeptCampus(tx, access, departmentId)

    await tx.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.pending_confirmation, currentUserName: userName, departmentId },
    })

    const assetRecord = await tx.assetRecord.create({
      data: {
        assetId,
        action: AssetRecordAction.lend,
        userName,
        departmentId,
        actionDate: now,
        expectedReturnDate,
        proofImage: undefined,
        remark: typeof body.remark === 'string' ? body.remark : undefined,
        operatorId: authUser.id,
        requestId: body.requestId,
      },
    })

    await tx.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '借出',
        targetType: 'Asset',
        targetId: assetId,
        detail: { from: asset.status, to: AssetStatus.pending_confirmation, expectedReturnDate },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/return', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const now = new Date()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: assetId },
      include: { department: { select: { campusId: true } } },
    })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.in_use && asset.status !== AssetStatus.borrowed) {
      badRequest('Asset must be in_use or borrowed for return')
    }
    assertCampusAccess(access, asset.department.campusId)

    const unassignedDepartmentId = await getUnassignedDepartmentIdForCampus(tx, asset.department.campusId)

    await tx.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.in_stock, currentUserName: '', departmentId: unassignedDepartmentId },
    })

    const assetRecord = await tx.assetRecord.create({
      data: {
        assetId,
        action: AssetRecordAction.return,
        userName: asset.currentUserName,
        departmentId: asset.departmentId,
        actionDate: now,
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
        action: '归还',
        targetType: 'Asset',
        targetId: assetId,
        detail: { from: asset.status, to: AssetStatus.in_stock },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/transfer', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')
  if (typeof body.userName !== 'string' || body.userName.trim() === '') badRequest('userName is required')
  const departmentId = toInt(body.departmentId)
  if (!departmentId) badRequest('departmentId is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const now = new Date()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: assetId },
      include: { department: { select: { campusId: true } } },
    })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.in_use) badRequest('Asset must be in_use for transfer')
    assertCampusAccess(access, asset.department.campusId)
    await assertDeptCampus(tx, access, departmentId)

    await tx.asset.update({
      where: { id: assetId },
      data: {
        status: AssetStatus.pending_confirmation,
        // 签字确认前仍显示原使用人/部门；确认后更新为目标人/部门
        currentUserName: asset.currentUserName,
        departmentId: asset.departmentId,
      },
    })

    const assetRecord = await tx.assetRecord.create({
      data: {
        assetId,
        action: AssetRecordAction.transfer,
        userName: body.userName,
        departmentId,
        actionDate: now,
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
        action: '调拨',
        targetType: 'Asset',
        targetId: assetId,
        detail: {
          fromUser: asset.currentUserName,
          toUser: body.userName,
          fromDept: asset.departmentId,
          toDept: departmentId,
          pendingSignature: true,
        },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/repair', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')
  if (typeof body.faultDescription !== 'string' || body.faultDescription.trim() === '') badRequest('faultDescription is required')
  if (typeof body.repairVendor !== 'string' || body.repairVendor.trim() === '') badRequest('repairVendor is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const now = new Date()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: assetId },
      include: { department: { select: { campusId: true } } },
    })
    if (!asset) badNotFound('Asset not found')
    assertCampusAccess(access, asset.department.campusId)

    await tx.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.in_repair },
    })

    const repair = await tx.repairRecord.create({
      data: {
        assetId,
        faultDescription: body.faultDescription,
        repairVendor: body.repairVendor,
        repairCost: 0,
        repairResult: RepairResult.fixed,
        startDate: now,
        endDate: now,
        remark: typeof body.remark === 'string' ? body.remark : undefined,
      },
    })

    const assetRecord = await tx.assetRecord.create({
      data: {
        assetId,
        action: AssetRecordAction.repair,
        userName: asset.currentUserName,
        departmentId: asset.departmentId,
        actionDate: now,
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
        action: '送修',
        targetType: 'Asset',
        targetId: assetId,
        detail: { from: asset.status, to: AssetStatus.in_repair, faultDescription: body.faultDescription },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, repairId: repair.id, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/repair-done', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')

  if (body.repairResult !== 'fixed' && body.repairResult !== 'unfixable') badRequest('repairResult must be fixed/unfixable')
  const repairResult = body.repairResult as RepairResult

  const repairCost = typeof body.repairCost === 'number' ? body.repairCost : Number(body.repairCost)
  if (!Number.isFinite(repairCost)) badRequest('repairCost is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const now = new Date()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: assetId },
      include: { department: { select: { campusId: true } } },
    })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.in_repair) badRequest('Asset must be in_repair for repair-done')
    assertCampusAccess(access, asset.department.campusId)

    const repair = await tx.repairRecord.findFirst({
      where: { assetId },
      orderBy: { startDate: 'desc' },
    })
    if (!repair) badRequest('RepairRecord not found for this asset')

    await tx.repairRecord.update({
      where: { id: repair.id },
      data: {
        repairCost,
        repairResult,
        endDate: now,
        remark: typeof body.remark === 'string' ? body.remark : undefined,
      },
    })

    const toStatus = repairResult === RepairResult.fixed ? AssetStatus.in_stock : AssetStatus.retired

    const unassignedDepartmentId = await getUnassignedDepartmentIdForCampus(tx, asset.department.campusId)

    await tx.asset.update({
      where: { id: assetId },
      data: {
        status: toStatus,
        currentUserName: '',
        departmentId: unassignedDepartmentId,
      },
    })

    const assetRecord = await tx.assetRecord.create({
      data: {
        assetId,
        action: AssetRecordAction.repair_done,
        userName: asset.currentUserName,
        departmentId: asset.departmentId,
        actionDate: now,
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
        action: '维修完成',
        targetType: 'Asset',
        targetId: assetId,
        detail: { from: asset.status, to: toStatus, repairResult, repairCost },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, repairId: repair.id, assetRecord, toStatus }
  })

  res.json(result)
})

operationsRouter.post('/retire', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const now = new Date()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: assetId },
      include: { department: { select: { campusId: true } } },
    })
    if (!asset) badNotFound('Asset not found')
    if (asset.status === AssetStatus.retired) badRequest('Asset already retired')
    assertCampusAccess(access, asset.department.campusId)

    const unassignedDepartmentId = await getUnassignedDepartmentIdForCampus(tx, asset.department.campusId)

    await tx.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.retired, currentUserName: '', departmentId: unassignedDepartmentId },
    })

    const assetRecord = await tx.assetRecord.create({
      data: {
        assetId,
        action: AssetRecordAction.retire,
        userName: asset.currentUserName,
        departmentId: asset.departmentId,
        actionDate: now,
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
        action: '报废',
        targetType: 'Asset',
        targetId: assetId,
        detail: { from: asset.status, to: AssetStatus.retired },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/confirm-signature', async (req, res) => {
  const body = req.body as { recordId?: unknown; signatureImage?: unknown }
  const recordId = toInt(body.recordId)
  if (!recordId) return res.status(400).json({ error: { message: 'recordId is required' } })
  if (typeof body.signatureImage !== 'string' || !body.signatureImage.startsWith('data:image/')) {
    return res.status(400).json({ error: { message: 'Invalid signature image' } })
  }

  const record = await prisma.assetRecord.findUnique({ where: { id: recordId } })
  if (!record) return res.status(404).json({ error: { message: 'Record not found' } })
  if (
    record.action !== AssetRecordAction.check_out &&
    record.action !== AssetRecordAction.lend &&
    record.action !== AssetRecordAction.transfer
  ) {
    return res.status(400).json({ error: { message: 'This record type cannot be signed' } })
  }
  if (record.proofImage) {
    return res.status(400).json({ error: { message: 'Already signed' } })
  }

  await prisma.$transaction(async (tx) => {
    await tx.assetRecord.update({
      where: { id: recordId },
      data: { proofImage: body.signatureImage as string },
    })

    const asset = await tx.asset.findUnique({ where: { id: record.assetId } })
    if (asset && asset.status === AssetStatus.pending_confirmation) {
      if (record.action === AssetRecordAction.transfer) {
        await tx.asset.update({
          where: { id: record.assetId },
          data: {
            status: AssetStatus.in_use,
            currentUserName: record.userName,
            departmentId: record.departmentId,
          },
        })
      } else {
        const targetStatus = record.action === AssetRecordAction.lend ? AssetStatus.borrowed : AssetStatus.in_use
        await tx.asset.update({
          where: { id: record.assetId },
          data: { status: targetStatus },
        })
      }
    }
  })

  res.json({ ok: true })
})
