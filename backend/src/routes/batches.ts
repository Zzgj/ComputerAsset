import { Router } from 'express'

import { prisma } from '../prisma'
import { requireAuth, requirePermission } from '../middleware/auth'

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

export const batchesRouter = Router()

// 生成下一个批次号（必须在 /:id 之前定义，否则会被 /:id 匹配）
batchesRouter.get('/generate-no', requireAuth, requirePermission('batches.manage'), async (_req, res) => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const prefix = `BAT-${year}${month}-`
  const existing = await prisma.assetBatch.findMany({
    where: { batchNo: { startsWith: prefix } },
    select: { batchNo: true },
  })
  let maxSeq = 0
  for (const b of existing) {
    const seqStr = b.batchNo.slice(prefix.length)
    const seq = Number(seqStr)
    if (Number.isFinite(seq) && seq > maxSeq) maxSeq = seq
  }
  const nextSeq = String(maxSeq + 1).padStart(3, '0')
  res.json({ batchNo: `${prefix}${nextSeq}` })
})

// 列表（含关联资产数）
batchesRouter.get('/', requireAuth, requirePermission('assets.read'), async (req, res) => {
  const batches = await prisma.assetBatch.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { assets: true } },
    },
  })
  const items = batches.map((b) => ({
    id: b.id,
    batchNo: b.batchNo,
    name: b.name,
    purchaseDate: b.purchaseDate,
    remark: b.remark,
    createdAt: b.createdAt,
    assetCount: b._count.assets,
  }))
  res.json({ items })
})

// 单个批次详情（含资产列表）
batchesRouter.get('/:id', requireAuth, requirePermission('assets.read'), async (req, res) => {
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid batch id')

  const batch = await prisma.assetBatch.findUnique({
    where: { id },
    include: {
      assets: {
        include: {
          department: { include: { campus: true } },
        },
        orderBy: [{ assetCode: 'asc' }],
      },
    },
  })
  if (!batch) return res.status(404).json({ error: { message: 'Batch not found' } })

  res.json({ batch })
})

// 新建批次
batchesRouter.post('/', requireAuth, requirePermission('batches.manage'), async (req, res) => {
  const authUser = req.auth!
  const body = req.body as {
    batchNo?: string
    name?: string
    purchaseDate?: string
    remark?: string
  }

  // 批次号：用户给则用，否则自动生成
  let batchNo = typeof body.batchNo === 'string' ? body.batchNo.trim() : ''
  if (!batchNo) {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const prefix = `BAT-${year}${month}-`
    const existing = await prisma.assetBatch.findMany({
      where: { batchNo: { startsWith: prefix } },
      select: { batchNo: true },
    })
    let maxSeq = 0
    for (const b of existing) {
      const seq = Number(b.batchNo.slice(prefix.length))
      if (Number.isFinite(seq) && seq > maxSeq) maxSeq = seq
    }
    batchNo = `${prefix}${String(maxSeq + 1).padStart(3, '0')}`
  }

  // 校验唯一性
  const exist = await prisma.assetBatch.findUnique({ where: { batchNo } })
  if (exist) badRequest('批次号已存在')

  let purchaseDate: Date | null = null
  if (body.purchaseDate) {
    const d = new Date(body.purchaseDate)
    if (Number.isNaN(d.getTime())) badRequest('purchaseDate is invalid')
    purchaseDate = d
  }

  const created = await prisma.assetBatch.create({
    data: {
      batchNo,
      name: typeof body.name === 'string' ? body.name.trim() || null : null,
      purchaseDate,
      remark: typeof body.remark === 'string' ? body.remark.trim() || null : null,
    },
  })

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '新建资产批次',
      targetType: 'AssetBatch',
      targetId: created.id,
      detail: { batchNo: created.batchNo, name: created.name },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ batch: created })
})

// 编辑批次
batchesRouter.patch('/:id', requireAuth, requirePermission('batches.manage'), async (req, res) => {
  const authUser = req.auth!
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid batch id')

  const existing = await prisma.assetBatch.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: { message: 'Batch not found' } })

  const body = req.body as {
    batchNo?: string
    name?: string | null
    purchaseDate?: string | null
    remark?: string | null
  }

  const data: Record<string, unknown> = {}
  if (typeof body.batchNo === 'string' && body.batchNo.trim()) {
    const next = body.batchNo.trim()
    if (next !== existing.batchNo) {
      const dup = await prisma.assetBatch.findUnique({ where: { batchNo: next } })
      if (dup) badRequest('批次号已存在')
    }
    data.batchNo = next
  }
  if (body.name !== undefined) {
    data.name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : null
  }
  if (body.purchaseDate !== undefined) {
    if (body.purchaseDate === null || body.purchaseDate === '') {
      data.purchaseDate = null
    } else {
      const d = new Date(body.purchaseDate)
      if (Number.isNaN(d.getTime())) badRequest('purchaseDate is invalid')
      data.purchaseDate = d
    }
  }
  if (body.remark !== undefined) {
    data.remark = typeof body.remark === 'string' && body.remark.trim() ? body.remark.trim() : null
  }

  if (Object.keys(data).length === 0) badRequest('No fields to update')

  const updated = await prisma.assetBatch.update({ where: { id }, data })

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '编辑资产批次',
      targetType: 'AssetBatch',
      targetId: id,
      detail: data as Record<string, any>,
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ batch: updated })
})

// 删除批次（仅当无关联资产时）
batchesRouter.delete('/:id', requireAuth, requirePermission('batches.manage'), async (req, res) => {
  const authUser = req.auth!
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid batch id')

  const batch = await prisma.assetBatch.findUnique({
    where: { id },
    include: { _count: { select: { assets: true } } },
  })
  if (!batch) return res.status(404).json({ error: { message: 'Batch not found' } })
  if (batch._count.assets > 0) {
    badRequest(`该批次下还有 ${batch._count.assets} 台资产，无法删除。请先取消关联或转移资产`)
  }

  await prisma.assetBatch.delete({ where: { id } })

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '删除资产批次',
      targetType: 'AssetBatch',
      targetId: id,
      detail: { batchNo: batch.batchNo },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ ok: true })
})
