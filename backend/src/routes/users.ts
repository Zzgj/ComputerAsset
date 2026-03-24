import { Router } from 'express'
import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { prisma } from '../prisma'
import { requireAuth, requireRole } from '../middleware/auth'

const superAdminRoles: Role[] = ['super_admin']

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

export const usersRouter = Router()

usersRouter.get('/', requireAuth, requireRole(superAdminRoles), async (_req, res) => {
  const items = await prisma.user.findMany({
    orderBy: { id: 'desc' },
    select: { id: true, username: true, realName: true, role: true, isActive: true, mustChangePass: true },
  })
  res.json({ items })
})

usersRouter.post('/', requireAuth, requireRole(superAdminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any

  if (typeof body.username !== 'string' || body.username.trim() === '') badRequest('username is required')
  if (typeof body.password !== 'string' || body.password.trim() === '') badRequest('password is required')
  if (typeof body.realName !== 'string' || body.realName.trim() === '') badRequest('realName is required')
  if (!Object.values(Role).includes(body.role)) badRequest('role is invalid')

  const exist = await prisma.user.findUnique({ where: { username: body.username } })
  if (exist) badRequest('username already exists')

  const hashed = await bcrypt.hash(body.password, 10)

  const created = await prisma.user.create({
    data: {
      username: body.username,
      password: hashed,
      realName: body.realName,
      role: body.role as Role,
      isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
      mustChangePass: typeof body.mustChangePass === 'boolean' ? body.mustChangePass : true,
    },
    select: { id: true, username: true, realName: true, role: true, isActive: true, mustChangePass: true },
  })

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '新增用户',
      targetType: 'User',
      targetId: created.id,
      detail: { username: created.username, role: created.role },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ user: created })
})

usersRouter.put('/:id', requireAuth, requireRole(superAdminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid user id')

  const body = req.body as any
  const data: any = {}

  if (typeof body.realName === 'string' && body.realName.trim() !== '') data.realName = body.realName
  if (Object.values(Role).includes(body.role)) data.role = body.role as Role
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive

  if (Object.keys(data).length === 0) badRequest('No fields to update')

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, username: true, realName: true, role: true, isActive: true, mustChangePass: true },
  })

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '编辑用户',
      targetType: 'User',
      targetId: updated.id,
      detail: data,
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ user: updated })
})

usersRouter.post('/:id/reset-password', requireAuth, requireRole(superAdminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid user id')

  const hashed = await bcrypt.hash('123456', 10)

  await prisma.user.update({
    where: { id },
    data: { password: hashed, mustChangePass: true },
  })

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '重置密码',
      targetType: 'User',
      targetId: id,
      detail: { resetTo: '123456' },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ ok: true })
})

usersRouter.delete('/:id', requireAuth, requireRole(superAdminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid user id')

  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, username: true, role: true } })
  if (!target) {
    throw { statusCode: 404, message: 'User not found' }
  }

  // 避免误删：不能删自己、不能删超级管理员
  if (target.id === authUser.id) badRequest('不能删除当前登录用户')
  if (target.role === 'super_admin') badRequest('不能删除超级管理员')

  await prisma.user.delete({ where: { id } })

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '删除用户',
      targetType: 'User',
      targetId: id,
      detail: { username: target.username, role: target.role },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ ok: true })
})

