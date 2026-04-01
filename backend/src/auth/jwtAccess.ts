import type { AccessAuth } from './accessContext'
import { isPermissionKey, type PermissionKey } from './permissions'

export function accessAuthToJwtClaims(auth: AccessAuth): Record<string, unknown> {
  return {
    bu: auth.bypassAll ? 1 : 0,
    p: auth.bypassAll ? [] : [...auth.permissions],
    ca: auth.campusesAll ? 1 : 0,
    ci: auth.campusIds,
  }
}

export function jwtClaimsToAccessAuth(userId: number, raw: Record<string, unknown>): AccessAuth {
  const bypassAll = raw.bu === 1 || raw.bu === true
  const permissions = new Set<PermissionKey>()
  if (Array.isArray(raw.p)) {
    for (const k of raw.p) {
      if (typeof k === 'string' && isPermissionKey(k)) permissions.add(k)
    }
  }
  const campusesAll = raw.ca === 1 || raw.ca === true
  const campusIds: number[] = []
  if (Array.isArray(raw.ci)) {
    for (const n of raw.ci) {
      if (typeof n === 'number' && Number.isFinite(n)) campusIds.push(Math.trunc(n))
    }
  }
  return {
    id: userId,
    bypassAll,
    permissions,
    campusesAll,
    campusIds,
  }
}
