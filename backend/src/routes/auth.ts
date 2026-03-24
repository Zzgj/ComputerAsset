import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { Role } from '@prisma/client'

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
    select: { id: true, username: true, password: true, realName: true, role: true, isActive: true, mustChangePass: true },
  })

  if (!user || !user.isActive) {
    return res.status(401).json({ error: { message: 'Invalid username or password' } })
  }

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    return res.status(401).json({ error: { message: 'Invalid username or password' } })
  }

  const { JWT_SECRET, JWT_EXPIRES_IN } = getEnv()

  // `jsonwebtoken` typings 在某些版本/配置下会对参数进行严格重载判断，这里用 `as any` 保证编译通过
  const token = (sign as any)(
    { role: user.role as Role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN, subject: String(user.id) },
  ) as string

  res.json({
    token,
    me: {
      id: user.id,
      username: user.username,
      realName: user.realName,
      role: user.role,
      mustChangePass: user.mustChangePass,
    },
  })
})

authRouter.get('/me', requireAuth, async (req, res) => {
  const authUser = (req as any).auth as { id: number; role: Role }
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { id: true, username: true, realName: true, role: true, isActive: true, mustChangePass: true },
  })

  if (!user) {
    return res.status(401).json({ error: { message: 'Invalid user' } })
  }

  res.json({
    me: {
      id: user.id,
      username: user.username,
      realName: user.realName,
      role: user.role,
      mustChangePass: user.mustChangePass,
    },
  })
})

