/**
 * 资产流转端点的公共骨架。把 11 个 handler 中前 7 个高度重复的部分（requestId 幂等、
 * 事务、findUnique asset、园区/部门校验、updateAssetWithVersion、assetRecord.create、
 * operationLog.create）收敛到 runFlowOperation。
 *
 * 不动的端点（特殊业务）保留原样：
 * - /transfer、/stock-transfer：跨园区通知
 * - /repair、/repair-done：额外 repairRecord
 * - /confirm-signature：流程不同
 */
import type { Request, Response } from 'express'
import type { Asset, AssetStatus, AssetRecordAction, Prisma } from '@prisma/client'

import type { AccessAuth } from '../../auth/accessContext'
import { assertCampusAccess } from '../../auth/accessContext'
import { prisma } from '../../prisma'

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
type AssetWithCampus = Asset & { department: { campusId: number } }

type FlowMutateResult = {
  updateData: Prisma.AssetUncheckedUpdateManyInput
  expectedStatus?: AssetStatus | AssetStatus[]
  recordData: {
    userName: string
    departmentId: number
    expectedReturnDate?: Date | null
    proofImage?: string | null
    remark?: string | null
  }
  logDetail?: Prisma.InputJsonValue
}

export type RunFlowOperationOptions = {
  /** 必填：从 req.body 拿到的 requestId */
  requestId: unknown
  /** 必填：从 req.body 拿到的 assetId（数字或可解析为正整数的字符串） */
  assetId: unknown
  /** 流转动作日志名（写入 operationLog.action） */
  logAction: string
  /** AssetRecord.action 枚举值 */
  recordAction: AssetRecordAction
  /**
   * 在事务内、读到 asset 后执行：校验状态、计算 update/record/log 字段。
   * 抛错使用 throw { statusCode, message } 形状，由全局 errorHandler 翻译。
   */
  mutate: (
    asset: AssetWithCampus,
    tx: Tx,
    ctx: { access: AccessAuth; body: any },
  ) => Promise<FlowMutateResult>
  /** 前置业务校验，比如「一人一机」冲突。事务外执行。 */
  preflight?: () => Promise<void>
}

function badRequest(message: string): never {
  throw { statusCode: 400, message }
}

function badNotFound(message: string): never {
  throw { statusCode: 404, message }
}

function toPositiveInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return Math.trunc(value)
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    if (Number.isFinite(n) && n > 0) return Math.trunc(n)
  }
  return null
}

export function staleAssetConflict(): never {
  throw {
    statusCode: 409,
    code: 'ASSET_VERSION_CONFLICT',
    message: '资产已被其他人修改，请刷新后重试',
  }
}

export async function updateAssetWithVersion(
  tx: Tx,
  asset: { id: number; version: number; status: AssetStatus },
  data: Prisma.AssetUncheckedUpdateManyInput,
  expectedStatus?: AssetStatus | AssetStatus[],
) {
  const statusWhere = Array.isArray(expectedStatus)
    ? { in: expectedStatus }
    : expectedStatus ?? undefined
  const updated = await tx.asset.updateMany({
    where: {
      id: asset.id,
      version: asset.version,
      ...(statusWhere ? { status: statusWhere } : {}),
    },
    data: {
      ...data,
      version: { increment: 1 },
    },
  })
  if (updated.count !== 1) staleAssetConflict()
}

export async function runFlowOperation(
  req: Request,
  res: Response,
  opts: RunFlowOperationOptions,
): Promise<void> {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any

  if (typeof opts.requestId !== 'string' || opts.requestId.trim() === '') badRequest('requestId is required')
  const assetId = toPositiveInt(opts.assetId)
  if (!assetId) badRequest('assetId is required')

  const exist = await prisma.assetRecord.findUnique({ where: { requestId: opts.requestId } })
  if (exist) {
    res.json({ alreadyProcessed: true, assetRecord: exist })
    return
  }

  if (opts.preflight) await opts.preflight()

  const now = new Date()
  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: assetId },
      include: { department: { select: { campusId: true } } },
    })
    if (!asset) badNotFound('Asset not found')
    assertCampusAccess(access, asset.department.campusId)

    const mutated = await opts.mutate(asset, tx, { access, body })

    await updateAssetWithVersion(tx, asset, mutated.updateData, mutated.expectedStatus)

    const assetRecord = await tx.assetRecord.create({
      data: {
        ...mutated.recordData,
        assetId,
        action: opts.recordAction,
        actionDate: now,
        operatorId: authUser.id,
        requestId: opts.requestId as string,
      },
    })

    await tx.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: opts.logAction,
        targetType: 'Asset',
        targetId: assetId,
        detail:
          mutated.logDetail ??
          ({ from: asset.status, to: mutated.updateData.status } as Prisma.InputJsonValue),
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return { assetId, assetRecord }
  })

  res.json(result)
}

export type { Tx as FlowTx, AssetWithCampus }
