import type { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

import type { AccessAuth } from '../auth/accessContext'
import { authHasPermission } from '../auth/accessContext'
import { jwtClaimsToAccessAuth } from '../auth/jwtAccess'
import type { PermissionKey } from '../auth/permissions'
import { getEnv } from '../utils/env'

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
    const decoded = verify(token, JWT_SECRET) as {
      sub?: string
      bu?: unknown
      p?: unknown
      ca?: unknown
      ci?: unknown
    }
    const userId = decoded.sub
    if (typeof userId !== 'string' || !userId) {
      return res.status(401).json({ error: { message: 'Invalid Authorization token' } })
    }

    const access = jwtClaimsToAccessAuth(Number(userId), decoded as Record<string, unknown>)
    if (!Number.isFinite(access.id) || access.id < 1) {
      return res.status(401).json({ error: { message: 'Invalid Authorization token' } })
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
