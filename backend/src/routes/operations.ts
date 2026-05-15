import { Router } from 'express'

import type { AccessAuth } from '../auth/accessContext'
import { assertCampusAccess } from '../auth/accessContext'
import { prisma } from '../prisma'
import { HttpError } from '../utils/httpError'
import { requireAuth, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  runFlowOperation,
  staleAssetConflict,
  updateAssetWithVersion,
  type FlowTx as TxOps,
} from './operations/_shared'
import {
  CheckOutSchema,
  AssignSchema,
  CancelAssignSchema,
  PickUpSchema,
  LendSchema,
  ReturnSchema,
  RetireSchema,
  ConfirmSignatureSchema,
} from './operations.schemas'

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

/** 一人一机冲突校验：当配置启用时，给某人重新分配/借出资产前确认其名下没有占用资产 */
async function assertNoOnePersonOneDeviceConflict(userName: string) {
  const enabled = await getConfigBoolean('one_person_one_device', false)
  if (!enabled) return
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

/** 7 个简单流转端点的日志动作名集中处。其他端点（transfer/repair 等）日志在各自 handler 内声明 */
const FLOW_LOG_ACTIONS = {
  check_out: '出库（直接领用）',
  assign: '分配（待领用）',
  cancel_assign: '取消分配',
  pick_up: '确认领用',
  lend: '借出',
  return: '归还',
  retire: '报废',
} as const

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

async function getActiveDeptCampusId(tx: TxOps, departmentId: number) {
  const d = await tx.department.findUnique({
    where: { id: departmentId },
    select: { campusId: true, isActive: true, campus: { select: { isActive: true } } },
  })
  if (!d || !d.isActive || !d.campus.isActive) badRequest('目标部门不存在或已停用')
  return d.campusId
}

async function createCrossCampusTransferNotifications(
  tx: TxOps,
  params: {
    assetId: number
    assetCode: string
    recordId: number
    fromCampusId: number
    toCampusId: number
    senderId: number
    message: string
  },
) {
  if (params.fromCampusId === params.toCampusId) return 0

  const recipients = await tx.user.findMany({
    where: {
      isActive: true,
      NOT: { id: params.senderId },
      accessRole: {
        OR: [
          { bypassAll: true },
          {
            permissions: { some: { key: 'operations.execute' } },
            OR: [
              { campusesAll: true },
              { campuses: { some: { campusId: params.toCampusId } } },
            ],
          },
        ],
      },
    },
    select: { id: true },
  })

  if (!recipients.length) return 0
  await tx.assetTransferNotification.createMany({
    data: recipients.map((u) => ({
      assetId: params.assetId,
      recordId: params.recordId,
      fromCampusId: params.fromCampusId,
      toCampusId: params.toCampusId,
      senderId: params.senderId,
      recipientId: u.id,
      message: params.message,
    })),
  })
  return recipients.length
}

export const operationsRouter = Router()

operationsRouter.post('/check-out', requireAuth, requirePermission('operations.execute'), validate({ body: CheckOutSchema }), async (req, res) => {
  const body = req.body as any
  const userName = body.userName.trim()
  const departmentId = body.departmentId
  const ignoreConflict = toBoolean(body.ignoreConflict)

  await runFlowOperation(req, res, {
    requestId: body.requestId,
    assetId: body.assetId,
    logAction: FLOW_LOG_ACTIONS.check_out,
    recordAction: AssetRecordAction.check_out,
    preflight: ignoreConflict ? undefined : () => assertNoOnePersonOneDeviceConflict(userName),
    async mutate(asset, tx, { access }) {
      if (asset.status !== AssetStatus.in_stock) badRequest('Asset must be in_stock for check-out')
      await assertDeptCampus(tx, access, departmentId)
      return {
        updateData: { status: AssetStatus.pending_confirmation, currentUserName: userName, departmentId },
        expectedStatus: AssetStatus.in_stock,
        recordData: {
          userName,
          departmentId,
          remark: typeof body.remark === 'string' ? body.remark : undefined,
        },
      }
    },
  })
})

operationsRouter.post('/assign', requireAuth, requirePermission('operations.execute'), validate({ body: AssignSchema }), async (req, res) => {
  const body = req.body as any
  const departmentId = body.departmentId

  await runFlowOperation(req, res, {
    requestId: body.requestId,
    assetId: body.assetId,
    logAction: FLOW_LOG_ACTIONS.assign,
    recordAction: AssetRecordAction.assign,
    async mutate(asset, tx, { access }) {
      if (asset.status !== AssetStatus.in_stock) badRequest('Asset must be in_stock for assign')
      await assertDeptCampus(tx, access, departmentId)
      return {
        updateData: { status: AssetStatus.waiting_pickup, currentUserName: body.userName, departmentId },
        expectedStatus: AssetStatus.in_stock,
        recordData: {
          userName: body.userName,
          departmentId,
          remark: typeof body.remark === 'string' ? body.remark : undefined,
        },
      }
    },
  })
})

operationsRouter.post('/cancel-assign', requireAuth, requirePermission('operations.execute'), validate({ body: CancelAssignSchema }), async (req, res) => {
  const body = req.body as any

  await runFlowOperation(req, res, {
    requestId: body.requestId,
    assetId: body.assetId,
    logAction: FLOW_LOG_ACTIONS.cancel_assign,
    recordAction: AssetRecordAction.cancel_assign,
    async mutate(asset, tx) {
      if (asset.status !== AssetStatus.waiting_pickup) badRequest('Asset must be waiting_pickup for cancel-assign')
      const unassignedDepartmentId = await getUnassignedDepartmentIdForCampus(tx, asset.department.campusId)
      return {
        updateData: { status: AssetStatus.in_stock, currentUserName: '', departmentId: unassignedDepartmentId },
        expectedStatus: AssetStatus.waiting_pickup,
        recordData: {
          userName: asset.currentUserName,
          departmentId: asset.departmentId,
          remark: typeof body.remark === 'string' ? body.remark : undefined,
        },
      }
    },
  })
})

operationsRouter.post('/pick-up', requireAuth, requirePermission('operations.execute'), validate({ body: PickUpSchema }), async (req, res) => {
  const body = req.body as any

  await runFlowOperation(req, res, {
    requestId: body.requestId,
    assetId: body.assetId,
    logAction: FLOW_LOG_ACTIONS.pick_up,
    recordAction: AssetRecordAction.pick_up,
    async mutate(asset) {
      if (asset.status !== AssetStatus.waiting_pickup) badRequest('Asset must be waiting_pickup for pick-up')
      return {
        updateData: { status: AssetStatus.in_use },
        expectedStatus: AssetStatus.waiting_pickup,
        recordData: {
          userName: asset.currentUserName,
          departmentId: asset.departmentId,
          remark: typeof body.remark === 'string' ? body.remark : undefined,
        },
      }
    },
  })
})

operationsRouter.post('/lend', requireAuth, requirePermission('operations.execute'), validate({ body: LendSchema }), async (req, res) => {
  const body = req.body as any
  const userName = body.userName.trim()
  const departmentId = body.departmentId
  const ignoreConflict = toBoolean(body.ignoreConflict)

  const expectedReturnDate = new Date(body.expectedReturnDate as string)
  if (Number.isNaN(expectedReturnDate.getTime())) badRequest('expectedReturnDate is invalid')

  await runFlowOperation(req, res, {
    requestId: body.requestId,
    assetId: body.assetId,
    logAction: FLOW_LOG_ACTIONS.lend,
    recordAction: AssetRecordAction.lend,
    preflight: ignoreConflict ? undefined : () => assertNoOnePersonOneDeviceConflict(userName),
    async mutate(asset, tx, { access }) {
      if (asset.status !== AssetStatus.in_stock) badRequest('Asset must be in_stock for lend')
      await assertDeptCampus(tx, access, departmentId)
      return {
        updateData: { status: AssetStatus.pending_confirmation, currentUserName: userName, departmentId },
        expectedStatus: AssetStatus.in_stock,
        recordData: {
          userName,
          departmentId,
          expectedReturnDate,
          remark: typeof body.remark === 'string' ? body.remark : undefined,
        },
        logDetail: { from: asset.status, to: AssetStatus.pending_confirmation, expectedReturnDate },
      }
    },
  })
})

operationsRouter.post('/return', requireAuth, requirePermission('operations.execute'), validate({ body: ReturnSchema }), async (req, res) => {
  const body = req.body as any

  await runFlowOperation(req, res, {
    requestId: body.requestId,
    assetId: body.assetId,
    logAction: FLOW_LOG_ACTIONS.return,
    recordAction: AssetRecordAction.return,
    async mutate(asset, tx) {
      if (asset.status !== AssetStatus.in_use && asset.status !== AssetStatus.borrowed) {
        badRequest('Asset must be in_use or borrowed for return')
      }
      const unassignedDepartmentId = await getUnassignedDepartmentIdForCampus(tx, asset.department.campusId)
      return {
        updateData: { status: AssetStatus.in_stock, currentUserName: '', departmentId: unassignedDepartmentId },
        expectedStatus: [AssetStatus.in_use, AssetStatus.borrowed],
        recordData: {
          userName: asset.currentUserName,
          departmentId: asset.departmentId,
          remark: typeof body.remark === 'string' ? body.remark : undefined,
        },
      }
    },
  })
})

operationsRouter.post('/transfer', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = req.access!
  const authUser = req.auth!
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
    const fromCampusId = asset.department.campusId
    assertCampusAccess(access, fromCampusId)
    const toCampusId = await getActiveDeptCampusId(tx, departmentId)

    await updateAssetWithVersion(
      tx,
      asset,
      {
        status: AssetStatus.pending_confirmation,
        // 签字确认前仍显示原使用人/部门；确认后更新为目标人/部门
        currentUserName: asset.currentUserName,
        departmentId: asset.departmentId,
      },
      AssetStatus.in_use,
    )

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

    const notificationCount = await createCrossCampusTransferNotifications(tx, {
      assetId,
      assetCode: asset.assetCode,
      recordId: assetRecord.id,
      fromCampusId,
      toCampusId,
      senderId: authUser.id,
      message: `资产 ${asset.assetCode} 已跨园区调拨，请接收园区管理员关注并处理`,
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
          notificationCount,
        },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/stock-transfer', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = req.access!
  const authUser = req.auth!
  const body = req.body as any
  if (typeof body.requestId !== 'string') badRequest('requestId is required')
  const assetId = toInt(body.assetId)
  if (!assetId) badRequest('assetId is required')
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
    if (asset.status !== AssetStatus.in_stock) badRequest('Asset must be in_stock for stock-transfer')
    const fromCampusId = asset.department.campusId
    assertCampusAccess(access, fromCampusId)
    const toCampusId = await getActiveDeptCampusId(tx, departmentId)
    if (asset.departmentId === departmentId) badRequest('目标部门与当前部门一致，无需调拨')

    await updateAssetWithVersion(
      tx,
      asset,
      { status: AssetStatus.in_stock, currentUserName: '', departmentId },
      AssetStatus.in_stock,
    )

    const assetRecord = await tx.assetRecord.create({
      data: {
        assetId,
        action: AssetRecordAction.transfer,
        userName: '',
        departmentId,
        actionDate: now,
        expectedReturnDate: undefined,
        proofImage: undefined,
        remark: typeof body.remark === 'string' ? body.remark : undefined,
        operatorId: authUser.id,
        requestId: body.requestId,
      },
    })

    const notificationCount = await createCrossCampusTransferNotifications(tx, {
      assetId,
      assetCode: asset.assetCode,
      recordId: assetRecord.id,
      fromCampusId,
      toCampusId,
      senderId: authUser.id,
      message: `在库资产 ${asset.assetCode} 已跨园区调拨，请接收园区管理员关注并处理`,
    })

    await tx.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '在库调拨',
        targetType: 'Asset',
        targetId: assetId,
        detail: {
          fromStatus: asset.status,
          toStatus: AssetStatus.in_stock,
          fromDept: asset.departmentId,
          toDept: departmentId,
          remark: typeof body.remark === 'string' ? body.remark : undefined,
          notificationCount,
        },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
})

operationsRouter.post('/repair', requireAuth, requirePermission('operations.execute'), async (req, res) => {
  const access = req.access!
  const authUser = req.auth!
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

    await updateAssetWithVersion(tx, asset, { status: AssetStatus.in_repair })

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
  const access = req.access!
  const authUser = req.auth!
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

    await updateAssetWithVersion(
      tx,
      asset,
      {
        status: toStatus,
        currentUserName: '',
        departmentId: unassignedDepartmentId,
      },
      AssetStatus.in_repair,
    )

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

operationsRouter.post('/retire', requireAuth, requirePermission('operations.execute'), validate({ body: RetireSchema }), async (req, res) => {
  const body = req.body as any

  await runFlowOperation(req, res, {
    requestId: body.requestId,
    assetId: body.assetId,
    logAction: FLOW_LOG_ACTIONS.retire,
    recordAction: AssetRecordAction.retire,
    async mutate(asset, tx) {
      if (asset.status === AssetStatus.retired) badRequest('Asset already retired')
      const unassignedDepartmentId = await getUnassignedDepartmentIdForCampus(tx, asset.department.campusId)
      return {
        updateData: { status: AssetStatus.retired, currentUserName: '', departmentId: unassignedDepartmentId },
        recordData: {
          userName: asset.currentUserName,
          departmentId: asset.departmentId,
          remark: typeof body.remark === 'string' ? body.remark : undefined,
        },
      }
    },
  })
})

operationsRouter.post('/confirm-signature', validate({ body: ConfirmSignatureSchema }), async (req, res) => {
  const { recordId, signatureImage } = req.body as { recordId: number; signatureImage: string }

  const record = await prisma.assetRecord.findUnique({ where: { id: recordId } })
  if (!record) throw HttpError.notFound('Record not found')
  if (
    record.action !== AssetRecordAction.check_out &&
    record.action !== AssetRecordAction.lend &&
    record.action !== AssetRecordAction.transfer
  ) {
    throw HttpError.badRequest('This record type cannot be signed')
  }
  if (record.proofImage) {
    throw HttpError.badRequest('Already signed')
  }

  await prisma.$transaction(async (tx) => {
    const signed = await tx.assetRecord.updateMany({
      where: { id: recordId, proofImage: null },
      data: { proofImage: signatureImage },
    })
    if (signed.count !== 1) {
      throw new HttpError(409, '该签字已完成，请勿重复提交', { code: 'SIGNATURE_ALREADY_COMPLETED' })
    }

    const asset = await tx.asset.findUnique({ where: { id: record.assetId } })
    if (asset && asset.status === AssetStatus.pending_confirmation) {
      if (record.action === AssetRecordAction.transfer) {
        await updateAssetWithVersion(
          tx,
          asset,
          {
            status: AssetStatus.in_use,
            currentUserName: record.userName,
            departmentId: record.departmentId,
          },
          AssetStatus.pending_confirmation,
        )
      } else {
        const targetStatus = record.action === AssetRecordAction.lend ? AssetStatus.borrowed : AssetStatus.in_use
        await updateAssetWithVersion(tx, asset, { status: targetStatus }, AssetStatus.pending_confirmation)
      }
    }
  })

  res.json({ ok: true })
})

operationsRouter.get('/signature-record/:id', async (req, res) => {
  const id = toInt(req.params.id)
  if (!id) return res.status(400).json({ error: { message: 'recordId is required' } })

  const record = await prisma.assetRecord.findUnique({
    where: { id },
    include: {
      asset: { select: { id: true, assetCode: true, status: true } },
      department: { include: { campus: true } },
    },
  })
  if (!record) return res.status(404).json({ error: { message: 'Record not found' } })
  if (
    record.action !== AssetRecordAction.check_out &&
    record.action !== AssetRecordAction.lend &&
    record.action !== AssetRecordAction.transfer
  ) {
    return res.status(400).json({ error: { message: 'This record type cannot be signed' } })
  }

  res.json({
    record: {
      id: record.id,
      action: record.action,
      signed: Boolean(record.proofImage),
      userName: record.userName,
      department: record.department,
      actionDate: record.actionDate,
      remark: record.remark,
      asset: record.asset,
    },
  })
})
