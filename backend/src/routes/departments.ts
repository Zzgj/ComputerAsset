import { Router } from 'express'
import { Department, Role } from '@prisma/client'

import { prisma } from '../prisma'
import { requireAuth, requireRole } from '../middleware/auth'

const adminRoles: Role[] = ['super_admin', 'admin']

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

export const departmentsRouter = Router()

departmentsRouter.get('/', requireAuth, async (_req, res) => {
  const items = await prisma.department.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  res.json({ items })
})

departmentsRouter.post('/', requireAuth, requireRole(adminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const body = req.body as { name?: unknown; sortOrder?: unknown; isActive?: unknown }
  if (typeof body.name !== 'string' || body.name.trim() === '') badRequest('name is required')

  const sortOrder = typeof body.sortOrder === 'number' ? body.sortOrder : Number(body.sortOrder)
  if (!Number.isFinite(sortOrder)) badRequest('sortOrder is required')

  const isActive = typeof body.isActive === 'boolean' ? body.isActive : true

  const exist = await prisma.department.findUnique({ where: { name: body.name } })
  if (exist) badRequest('Department name already exists')

  const created = await prisma.department.create({
    data: { name: body.name, sortOrder, isActive },
  })

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '新增部门',
      targetType: 'Department',
      targetId: created.id,
      detail: { name: created.name },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ department: created })
})

departmentsRouter.put('/:id', requireAuth, requireRole(adminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid department id')

  const body = req.body as { name?: unknown; sortOrder?: unknown; isActive?: unknown }
  const data: any = {}

  if (typeof body.name === 'string' && body.name.trim() !== '') data.name = body.name
  if (typeof body.sortOrder !== 'undefined') {
    const sortOrder = typeof body.sortOrder === 'number' ? body.sortOrder : Number(body.sortOrder)
    if (!Number.isFinite(sortOrder)) badRequest('sortOrder is invalid')
    data.sortOrder = sortOrder
  }
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive

  if (Object.keys(data).length === 0) badRequest('No fields to update')

  const updated = await prisma.department.update({ where: { id }, data })

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '编辑部门',
      targetType: 'Department',
      targetId: id,
      detail: data,
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ department: updated })
})

departmentsRouter.delete('/:id', requireAuth, requireRole(['super_admin']), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid department id')

  const assetCount = await prisma.asset.count({ where: { departmentId: id } })
  if (assetCount > 0) badRequest('Cannot delete: department has related assets')

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '删除部门',
      targetType: 'Department',
      targetId: id,
      detail: {},
      ipAddress: req.ip ?? 'unknown',
    },
  })

  await prisma.department.delete({ where: { id } })
  res.json({ ok: true })
})

