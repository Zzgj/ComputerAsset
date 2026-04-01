import type { PermissionKey } from './permissions'

/** 从 JWT 解析并挂在 req.auth */
export type AccessAuth = {
  id: number
  bypassAll: boolean
  permissions: Set<PermissionKey>
  campusesAll: boolean
  campusIds: number[]
}

export function authHasPermission(auth: AccessAuth, key: PermissionKey): boolean {
  if (auth.bypassAll) return true
  return auth.permissions.has(key)
}

/** 将园区范围合并进资产查询的 where（department.campusId） */
export function applyCampusScopeToAssetWhere(where: Record<string, unknown>, auth: AccessAuth): void {
  if (auth.bypassAll || auth.campusesAll) return
  if (!auth.campusIds.length) {
    where.id = -1
    return
  }
  const campusClause = { campusId: { in: auth.campusIds } }
  const existing = where.department
  if (existing && typeof existing === 'object' && existing !== null && !Array.isArray(existing)) {
    where.department = { AND: [existing, campusClause] }
  } else {
    where.department = campusClause
  }
}

/** 流转记录：按部门园区筛选 */
export function applyCampusScopeToRecordWhere(where: Record<string, unknown>, auth: AccessAuth): void {
  if (auth.bypassAll || auth.campusesAll) return
  if (!auth.campusIds.length) {
    where.id = -1
    return
  }
  const campusClause = { campusId: { in: auth.campusIds } }
  const existing = where.department
  if (existing && typeof existing === 'object' && existing !== null && !Array.isArray(existing)) {
    where.department = { AND: [existing, campusClause] }
  } else {
    where.department = campusClause
  }
}

export function applyCampusScopeToAssetCountWhere(where: Record<string, unknown>, auth: AccessAuth): void {
  applyCampusScopeToAssetWhere(where, auth)
}

export function campusIdsAllowed(auth: AccessAuth): number[] | null {
  if (auth.bypassAll || auth.campusesAll) return null
  return auth.campusIds
}

export function assertCampusAccess(auth: AccessAuth, campusId: number): void {
  if (auth.bypassAll || auth.campusesAll) return
  if (!auth.campusIds.includes(campusId)) {
    throw { statusCode: 403, message: '该资源不在您的园区权限范围内' }
  }
}
