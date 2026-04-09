import { Router } from 'express'
import bcrypt from 'bcryptjs'

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

export const usersRouter = Router()

usersRouter.get('/', requireAuth, requirePermission('users.manage'), async (_req, res) => {
  const items = await prisma.user.findMany({
    orderBy: { id: 'desc' },
    select: {
      id: true,
      username: true,
      realName: true,
      isActive: true,
      mustChangePass: true,
      accessRoleId: true,
      accessRole: { select: { id: true, name: true, slug: true, bypassAll: true } },
    },
  })
  res.json({ items })
})

usersRouter.post('/', requireAuth, requirePermission('users.manage'), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any

  if (typeof body.username !== 'string' || body.username.trim() === '') badRequest('username is required')
  if (typeof body.password !== 'string' || body.password.trim() === '') badRequest('password is required')
  if (typeof body.realName !== 'string' || body.realName.trim() === '') badRequest('realName is required')

  const accessRoleId = toInt(body.accessRoleId)
  if (!accessRoleId) badRequest('accessRoleId is required')

  const roleRow = await prisma.accessRole.findUnique({ where: { id: accessRoleId } })
  if (!roleRow) badRequest('accessRoleId is invalid')

  if (roleRow.bypassAll) {
    const authAccess = (req as any).access
    if (!authAccess?.bypassAll) {
      badRequest('仅超级管理员可将用户绑定为「超级管理员」角色')
    }
  }

  const exist = await prisma.user.findUnique({ where: { username: body.username } })
  if (exist) badRequest('username already exists')

  const hashed = await bcrypt.hash(body.password, 10)

  const created = await prisma.user.create({
    data: {
      username: body.username,
      password: hashed,
      realName: body.realName,
      accessRoleId,
      isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
      mustChangePass: typeof body.mustChangePass === 'boolean' ? body.mustChangePass : true,
    },
    select: {
      id: true,
      username: true,
      realName: true,
      isActive: true,
      mustChangePass: true,
      accessRoleId: true,
      accessRole: { select: { id: true, name: true, slug: true, bypassAll: true } },
    },
  })

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '新增用户',
      targetType: 'User',
      targetId: created.id,
      detail: { username: created.username, accessRoleId },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ user: created })
})

usersRouter.put('/:id', requireAuth, requirePermission('users.manage'), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid user id')

  const body = req.body as any
  const data: any = {}

  if (typeof body.realName === 'string' && body.realName.trim() !== '') data.realName = body.realName
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive

  const newRoleId = toInt(body.accessRoleId)
  if (newRoleId) {
    const roleRow = await prisma.accessRole.findUnique({ where: { id: newRoleId } })
    if (!roleRow) badRequest('accessRoleId is invalid')
    if (roleRow.bypassAll) {
      const authAccess = (req as any).access
      if (!authAccess?.bypassAll) {
        badRequest('仅超级管理员可将用户绑定为「超级管理员」角色')
      }
    }
    data.accessRoleId = newRoleId
  }

  if (Object.keys(data).length === 0) badRequest('No fields to update')

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      realName: true,
      isActive: true,
      mustChangePass: true,
      accessRoleId: true,
      accessRole: { select: { id: true, name: true, slug: true, bypassAll: true } },
    },
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

usersRouter.post('/:id/reset-password', requireAuth, requirePermission('users.manage'), async (req, res) => {
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
      detail: { action: '密码已重置为默认值' },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ ok: true })
})

usersRouter.delete('/:id', requireAuth, requirePermission('users.manage'), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid user id')

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, accessRole: { select: { bypassAll: true } } },
  })
  if (!target) {
    throw { statusCode: 404, message: 'User not found' }
  }

  if (target.id === authUser.id) badRequest('不能删除当前登录用户')
  if (target.accessRole?.bypassAll) badRequest('不能删除超级管理员账号')

  await prisma.user.delete({ where: { id } })

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '删除用户',
      targetType: 'User',
      targetId: id,
      detail: { username: target.username },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ ok: true })
})
