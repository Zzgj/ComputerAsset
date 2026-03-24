import { Router } from 'express'

import { prisma } from '../prisma'
import { requireAuth, requireRole } from '../middleware/auth'

import { AssetStatus, AssetRecordAction, RepairResult, Role } from '@prisma/client'

const adminRoles: Role[] = ['super_admin', 'admin']

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

async function getUnassignedDepartmentId() {
  const dept = await prisma.department.findUnique({ where: { name: '未分配' } })
  if (!dept) badRequest('Missing department: 未分配')
  return dept.id
}

export const operationsRouter = Router()

operationsRouter.post('/check-out', requireAuth, requireRole(adminRoles), async (req, res) => {
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
    const asset = await tx.asset.findUnique({ where: { id: assetId } })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.in_stock) badRequest('Asset must be in_stock for check-out')

    await tx.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.in_use, currentUserName: userName, departmentId },
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
        detail: { from: asset.status, to: AssetStatus.in_use },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/assign', requireAuth, requireRole(adminRoles), async (req, res) => {
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
    const asset = await tx.asset.findUnique({ where: { id: assetId } })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.in_stock) badRequest('Asset must be in_stock for assign')

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

operationsRouter.post('/cancel-assign', requireAuth, requireRole(adminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const now = new Date()
  const unassignedDepartmentId = await getUnassignedDepartmentId()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({ where: { id: assetId } })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.waiting_pickup) badRequest('Asset must be waiting_pickup for cancel-assign')

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

operationsRouter.post('/pick-up', requireAuth, requireRole(adminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const now = new Date()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({ where: { id: assetId } })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.waiting_pickup) badRequest('Asset must be waiting_pickup for pick-up')

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

operationsRouter.post('/lend', requireAuth, requireRole(adminRoles), async (req, res) => {
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
    const asset = await tx.asset.findUnique({ where: { id: assetId } })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.in_stock) badRequest('Asset must be in_stock for lend')

    await tx.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.borrowed, currentUserName: userName, departmentId },
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
        detail: { from: asset.status, to: AssetStatus.borrowed, expectedReturnDate },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/return', requireAuth, requireRole(adminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const now = new Date()
  const unassignedDepartmentId = await getUnassignedDepartmentId()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({ where: { id: assetId } })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.in_use && asset.status !== AssetStatus.borrowed) {
      badRequest('Asset must be in_use or borrowed for return')
    }

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

operationsRouter.post('/transfer', requireAuth, requireRole(adminRoles), async (req, res) => {
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
    const asset = await tx.asset.findUnique({ where: { id: assetId } })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.in_use) badRequest('Asset must be in_use for transfer')

    await tx.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.in_use, currentUserName: body.userName, departmentId },
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
        detail: { fromUser: asset.currentUserName, toUser: body.userName, fromDept: asset.departmentId, toDept: departmentId },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/repair', requireAuth, requireRole(adminRoles), async (req, res) => {
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
    const asset = await tx.asset.findUnique({ where: { id: assetId } })
    if (!asset) badNotFound('Asset not found')

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

operationsRouter.post('/repair-done', requireAuth, requireRole(adminRoles), async (req, res) => {
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
  const unassignedDepartmentId = await getUnassignedDepartmentId()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({ where: { id: assetId } })
    if (!asset) badNotFound('Asset not found')
    if (asset.status !== AssetStatus.in_repair) badRequest('Asset must be in_repair for repair-done')

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

operationsRouter.post('/retire', requireAuth, requireRole(adminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: body.requestId } })
  if (exist) return res.json({ alreadyProcessed: true, assetRecord: exist })

  const now = new Date()
  const unassignedDepartmentId = await getUnassignedDepartmentId()

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({ where: { id: assetId } })
    if (!asset) badNotFound('Asset not found')
    if (asset.status === AssetStatus.retired) badRequest('Asset already retired')

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

