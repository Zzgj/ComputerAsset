import type { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

import type { AccessAuth } from '../auth/accessContext'
import { authHasPermission } from '../auth/accessContext'
import { jwtClaimsToAccessAuth } from '../auth/jwtAccess'
import type { PermissionKey } from '../auth/permissions'
import { getEnv } from '../utils/env'
import { prisma } from '../prisma'

function getTokenFromRequest(req: Request): string | null {
  const header = req.headers.authorization
  if (!header) return null
  const [scheme, token] = header.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null
  return token
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getTokenFromRequest(req)
  if (!token) {
    return res.status(401).json({ error: { message: 'Missing Authorization token' } })
  }

  const { JWT_SECRET } = getEnv()
  try {
    const decoded = verify(token, JWT_SECRET) as {
      sub?: string
      bu?: unknown
      p?: unknown
      ca?: unknown
      ci?: unknown
      st?: string
    }
    const userId = decoded.sub
    if (typeof userId !== 'string' || !userId) {
      return res.status(401).json({ error: { message: 'Invalid Authorization token' } })
    }

    const access = jwtClaimsToAccessAuth(Number(userId), decoded as Record<string, unknown>)
    if (!Number.isFinite(access.id) || access.id < 1) {
      return res.status(401).json({ error: { message: 'Invalid Authorization token' } })
    }

    if (decoded.st) {
      const user = await prisma.user.findUnique({
        where: { id: access.id },
        select: { sessionToken: true, isActive: true },
      })
      if (!user || !user.isActive) {
        return res.status(401).json({ error: { message: 'Account disabled', code: 'ACCOUNT_DISABLED' } })
      }
      if (user.sessionToken && user.sessionToken !== decoded.st) {
        return res.status(401).json({ error: { message: 'Session expired, logged in from another location', code: 'SESSION_REPLACED' } })
      }
    }

    ;(req as any).access = access
    ;(req as any).auth = { id: access.id }
    next()
  } catch (_e) {
    return res.status(401).json({ error: { message: 'Invalid or expired token' } })
  }
}

/** 需同时具备所列权限（AND） */
export function requirePermission(...keys: PermissionKey[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const access = (req as any).access as AccessAuth | undefined
    if (!access) return res.status(401).json({ error: { message: 'Unauthenticated' } })
    const ok = keys.every((k) => authHasPermission(access, k))
    if (!ok) {
      return res.status(403).json({ error: { message: 'Forbidden' } })
    }
    next()
  }
}

/** 满足任一权限即可（OR） */
export function requireAnyPermission(...keys: PermissionKey[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const access = (req as any).access as AccessAuth | undefined
    if (!access) return res.status(401).json({ error: { message: 'Unauthenticated' } })
    const ok = keys.some((k) => authHasPermission(access, k))
    if (!ok) {
      return res.status(403).json({ error: { message: 'Forbidden' } })
    }
    next()
  }
}

/** 仅 bypass（超级管理员） */
export function requireBypass(req: Request, res: Response, next: NextFunction) {
  const access = (req as any).access as AccessAuth | undefined
  if (!access) return res.status(401).json({ error: { message: 'Unauthenticated' } })
  if (!access.bypassAll) {
    return res.status(403).json({ error: { message: 'Forbidden' } })
  }
  next()
}
