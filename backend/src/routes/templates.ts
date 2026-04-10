import { Router } from 'express'
import { DeviceType, Prisma } from '@prisma/client'

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

export const templatesRouter = Router()

// 入库页面：只返回启用的模板
templatesRouter.get('/', requireAuth, async (_req, res) => {
  const items = await prisma.assetTemplate.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { assets: true },
      },
    },
  })
  res.json({
    items: items.map((t) => ({
      ...t,
      assetCount: t._count.assets,
    })),
  })
})

// 管理页面：包含停用；q 模糊匹配名称/品牌/型号/配置/备注，并支持按设备类型关键词筛选
templatesRouter.get('/all', requireAuth, async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''

  const where: Prisma.AssetTemplateWhereInput = {}
  if (q) {
    const or: Prisma.AssetTemplateWhereInput[] = [
      { name: { contains: q } },
      { brand: { contains: q } },
      { model: { contains: q } },
      { os: { contains: q } },
      { cpu: { contains: q } },
      { memory: { contains: q } },
      { storage: { contains: q } },
      { remark: { contains: q } },
    ]
    const ql = q.toLowerCase()
    if (q.includes('笔记本') || ql.includes('laptop')) or.push({ deviceType: DeviceType.laptop })
    if (q.includes('台式机') || ql.includes('desktop')) or.push({ deviceType: DeviceType.desktop })
    if (q.includes('一体机') || ql.includes('aio')) or.push({ deviceType: DeviceType.aio })
    if (q.includes('服务器') || ql.includes('server')) or.push({ deviceType: DeviceType.server })
    if (q.includes('其他') || ql.includes('other')) or.push({ deviceType: DeviceType.other })
    where.OR = or
  }

  const items = await prisma.assetTemplate.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { assets: true },
      },
    },
  })
  res.json({
    items: items.map((t) => ({
      ...t,
      assetCount: t._count.assets,
    })),
  })
})

templatesRouter.post('/', requireAuth, requirePermission('templates.manage'), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any

  if (typeof body.name !== 'string' || body.name.trim() === '') badRequest('name is required')
  if (!Object.values(DeviceType).includes(body.deviceType)) badRequest('deviceType is invalid')

  let created
  try {
    created = await prisma.assetTemplate.create({
      data: {
        name: body.name,
        deviceType: body.deviceType as DeviceType,
        brand: String(body.brand ?? ''),
        model: String(body.model ?? ''),
        os: String(body.os ?? ''),
        cpu: String(body.cpu ?? ''),
        memory: String(body.memory ?? ''),
        storage: String(body.storage ?? ''),
        remark: typeof body.remark === 'string' ? body.remark : undefined,
        isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
        sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : Number(body.sortOrder ?? 0),
      },
    })
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      const targets: string[] = Array.isArray(e.meta?.target) ? (e.meta?.target as string[]) : []
      if (targets.some((t) => String(t).includes('name'))) {
        badRequest('模板名称已存在，请更换后再保存。')
      }
    }
    throw e
  }

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '新增设备型号模板',
      targetType: 'AssetTemplate',
      targetId: created.id,
      detail: { name: created.name },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ template: created })
})

templatesRouter.put('/:id', requireAuth, requirePermission('templates.manage'), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid template id')

  const body = req.body as any
  const data: any = {}
  if (typeof body.name === 'string' && body.name.trim() !== '') data.name = body.name
  if (Object.values(DeviceType).includes(body.deviceType)) data.deviceType = body.deviceType as DeviceType
  if (typeof body.brand === 'string') data.brand = body.brand
  if (typeof body.model === 'string') data.model = body.model
  if (typeof body.os === 'string') data.os = body.os
  if (typeof body.cpu === 'string') data.cpu = body.cpu
  if (typeof body.memory === 'string') data.memory = body.memory
  if (typeof body.storage === 'string') data.storage = body.storage
  if (typeof body.remark === 'string') data.remark = body.remark
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive
  if (typeof body.sortOrder !== 'undefined') data.sortOrder = Number(body.sortOrder)

  if (Object.keys(data).length === 0) badRequest('No fields to update')

  const old = await prisma.assetTemplate.findUnique({ where: { id } })
  if (!old) {
    throw { statusCode: 404, message: 'Template not found' }
  }

  const changedFields = {
    deviceType: Object.prototype.hasOwnProperty.call(data, 'deviceType'),
    brand: Object.prototype.hasOwnProperty.call(data, 'brand'),
    model: Object.prototype.hasOwnProperty.call(data, 'model'),
    os: Object.prototype.hasOwnProperty.call(data, 'os'),
    cpu: Object.prototype.hasOwnProperty.call(data, 'cpu'),
    memory: Object.prototype.hasOwnProperty.call(data, 'memory'),
    storage: Object.prototype.hasOwnProperty.call(data, 'storage'),
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updated = await tx.assetTemplate.update({ where: { id }, data })

    // 仅当模板里至少有一项“资产字段”发生变化时，才同步到已关联资产
    const anySync =
      changedFields.deviceType ||
      changedFields.brand ||
      changedFields.model ||
      changedFields.os ||
      changedFields.cpu ||
      changedFields.memory ||
      changedFields.storage

    let syncedCount = 0

    if (anySync) {
      const assets = await tx.asset.findMany({
        where: { templateId: id },
        select: {
          id: true,
          deviceType: true,
          brand: true,
          model: true,
          os: true,
          cpu: true,
          memory: true,
          storage: true,
          version: true,
        },
      })

      const isEmpty = (s: string) => !s || String(s).trim() === ''

      for (const a of assets) {
        const patch: any = {}

        // deviceType 是枚举字段：只在资产当前值与旧模板一致时覆盖
        if (changedFields.deviceType && a.deviceType === old.deviceType) {
          patch.deviceType = updated.deviceType
        }

        if (changedFields.brand && (isEmpty(a.brand) || a.brand === old.brand)) patch.brand = updated.brand
        if (changedFields.model && (isEmpty(a.model) || a.model === old.model)) patch.model = updated.model
        if (changedFields.os && (isEmpty(a.os) || a.os === old.os)) patch.os = updated.os
        if (changedFields.cpu && (isEmpty(a.cpu) || a.cpu === old.cpu)) patch.cpu = updated.cpu
        if (changedFields.memory && (isEmpty(a.memory) || a.memory === old.memory)) patch.memory = updated.memory
        if (changedFields.storage && (isEmpty(a.storage) || a.storage === old.storage)) patch.storage = updated.storage

        if (Object.keys(patch).length > 0) {
          await tx.asset.update({
            where: { id: a.id },
            data: {
              ...patch,
              // 同步操作也影响乐观锁版本：避免后续编辑报“version conflict”
              version: { increment: 1 },
            },
          })
          syncedCount++
        }
      }
    }

    await tx.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '编辑设备型号模板',
        targetType: 'AssetTemplate',
        targetId: id,
        detail: { ...data, syncedCount },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    return updated
  })

  res.json({ template: updated })
})

templatesRouter.delete('/:id', requireAuth, requirePermission('templates.manage'), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid template id')

  const assetCount = await prisma.asset.count({ where: { templateId: id } })
  if (assetCount > 0) badRequest('该设备型号模板已被资产使用，无法删除。')

  await prisma.assetTemplate.delete({ where: { id } })

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '删除设备型号模板',
      targetType: 'AssetTemplate',
      targetId: id,
      detail: {},
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ ok: true })
})

