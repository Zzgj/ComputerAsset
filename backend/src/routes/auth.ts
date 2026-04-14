import { randomBytes } from 'crypto'
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import { accessAuthToJwtClaims } from '../auth/jwtAccess'
import { loadAccessAuthByUserId } from '../auth/loadAccessAuth'
import { prisma } from '../prisma'
import { getEnv } from '../utils/env'
import { requireAuth } from '../middleware/auth'

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body as {
    username?: unknown
    password?: unknown
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: { message: 'Invalid request body' } })
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      password: true,
      realName: true,
      isActive: true,
      mustChangePass: true,
      accessRoleId: true,
      accessRole: { select: { id: true, name: true, slug: true } },
    },
  })

  if (!user) {
    return res.status(401).json({ error: { message: 'Invalid username or password' } })
  }

  if (!user.isActive) {
    await prisma.operationLog.create({
      data: {
        operatorId: user.id,
        action: '登录失败',
        targetType: 'auth',
        targetId: user.id,
        detail: {
          username: user.username,
          reason: 'account_inactive',
        },
        ipAddress: req.ip ?? 'unknown',
      },
    })
    return res.status(401).json({ error: { message: 'Invalid username or password' } })
  }

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    await prisma.operationLog.create({
      data: {
        operatorId: user.id,
        action: '登录失败',
        targetType: 'auth',
        targetId: user.id,
        detail: {
          username: user.username,
          reason: 'wrong_password',
        },
        ipAddress: req.ip ?? 'unknown',
      },
    })
    return res.status(401).json({ error: { message: 'Invalid username or password' } })
  }

  const access = await loadAccessAuthByUserId(user.id)
  if (!access) {
    return res.status(500).json({ error: { message: 'User access role is missing' } })
  }

  const sessionToken = randomBytes(32).toString('hex')
  await prisma.user.update({
    where: { id: user.id },
    data: { sessionToken },
  })

  const { JWT_SECRET, JWT_EXPIRES_IN } = getEnv()
  const claims = { ...accessAuthToJwtClaims(access), st: sessionToken }
  const token = (sign as any)(
    claims,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN, subject: String(user.id) },
  ) as string

  await prisma.operationLog.create({
    data: {
      operatorId: user.id,
      action: '登录',
      targetType: 'auth',
      targetId: user.id,
      detail: {
        username: user.username,
        accessRoleId: user.accessRoleId,
        accessRoleSlug: user.accessRole?.slug ?? null,
      },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({
    token,
    me: {
      id: user.id,
      username: user.username,
      realName: user.realName,
      mustChangePass: user.mustChangePass,
      bypassAll: access.bypassAll,
      permissions: access.bypassAll ? [] : [...access.permissions],
      campusesAll: access.campusesAll,
      campusIds: access.campusIds,
      accessRole: user.accessRole,
    },
  })
})

authRouter.get('/me', requireAuth, async (req, res) => {
  const access = (req as any).access as { id: number }
  const user = await prisma.user.findUnique({
    where: { id: access.id },
    select: {
      id: true,
      username: true,
      realName: true,
      isActive: true,
      mustChangePass: true,
      accessRoleId: true,
      accessRole: { select: { id: true, name: true, slug: true } },
    },
  })

  if (!user) {
    return res.status(401).json({ error: { message: 'Invalid user' } })
  }

  const fullAccess = await loadAccessAuthByUserId(user.id)
  if (!fullAccess) {
    return res.status(500).json({ error: { message: 'User access role is missing' } })
  }

  res.json({
    me: {
      id: user.id,
      username: user.username,
      realName: user.realName,
      mustChangePass: user.mustChangePass,
      bypassAll: fullAccess.bypassAll,
      permissions: fullAccess.bypassAll ? [] : [...fullAccess.permissions],
      campusesAll: fullAccess.campusesAll,
      campusIds: fullAccess.campusIds,
      accessRole: user.accessRole,
    },
  })
})

authRouter.post('/logout', requireAuth, async (req, res) => {
  const access = (req as any).access as { id: number; username?: string }

  await prisma.user.update({
    where: { id: access.id },
    data: { sessionToken: null },
  })

  await prisma.operationLog.create({
    data: {
      operatorId: access.id,
      action: '退出登录',
      targetType: 'auth',
      targetId: access.id,
      detail: {
        username: access.username ?? null,
      },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ ok: true })
})

authRouter.post('/change-password', requireAuth, async (req, res) => {
  const access = (req as any).access as { id: number; username?: string }
  const { oldPassword, newPassword } = req.body as {
    oldPassword?: unknown
    newPassword?: unknown
  }

  if (typeof oldPassword !== 'string' || typeof newPassword !== 'string') {
    return res.status(400).json({ error: { message: 'Invalid request body' } })
  }
  if (newPassword.trim().length < 6) {
    return res.status(400).json({ error: { message: '新密码长度不能少于 6 位' } })
  }
  if (oldPassword === newPassword) {
    return res.status(400).json({ error: { message: '新密码不能与旧密码相同' } })
  }

  const user = await prisma.user.findUnique({
    where: { id: access.id },
    select: { id: true, username: true, password: true },
  })
  if (!user) {
    return res.status(401).json({ error: { message: 'Invalid user' } })
  }

  const ok = await bcrypt.compare(oldPassword, user.password)
  if (!ok) {
    await prisma.operationLog.create({
      data: {
        operatorId: user.id,
        action: '修改密码失败',
        targetType: 'auth',
        targetId: user.id,
        detail: {
          username: user.username,
          reason: 'wrong_old_password',
        },
        ipAddress: req.ip ?? 'unknown',
      },
    })
    return res.status(400).json({ error: { message: '旧密码不正确' } })
  }

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      mustChangePass: false,
    },
  })

  await prisma.operationLog.create({
    data: {
      operatorId: user.id,
      action: '修改密码',
      targetType: 'auth',
      targetId: user.id,
      detail: {
        username: user.username,
      },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ ok: true })
})
