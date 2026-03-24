import type { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { Role } from '@prisma/client'

import { getEnv } from '../utils/env'

type AuthUser = {
  id: number
  role: Role
}

function getTokenFromRequest(req: Request): string | null {
  const header = req.headers.authorization
  if (!header) return null
  const [scheme, token] = header.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null
  return token
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getTokenFromRequest(req)
  if (!token) {
    return res.status(401).json({ error: { message: 'Missing Authorization token' } })
  }

  const { JWT_SECRET } = getEnv()
  try {
    const decoded = verify(token, JWT_SECRET) as { sub?: string; role?: unknown }
    const userId = decoded.sub
    const role = decoded.role

    if (typeof userId !== 'string' || !role) {
      return res.status(401).json({ error: { message: 'Invalid Authorization token' } })
    }

    const authUser: AuthUser = {
      id: Number(userId),
      role: role as Role,
    }

    ;(req as any).auth = authUser
    next()
  } catch (_e) {
    return res.status(401).json({ error: { message: 'Invalid or expired token' } })
  }
}

export function requireRole(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authUser = (req as any).auth as AuthUser | undefined
    if (!authUser) return res.status(401).json({ error: { message: 'Unauthenticated' } })
    if (!roles.includes(authUser.role)) {
      return res.status(403).json({ error: { message: 'Forbidden' } })
    }
    next()
  }
}

