import { prisma } from '../prisma'
import type { AccessAuth } from './accessContext'
import { isPermissionKey, type PermissionKey } from './permissions'

export async function loadAccessAuthByUserId(userId: number): Promise<AccessAuth | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      accessRole: {
        include: { permissions: true, campuses: true },
      },
    },
  })
  if (!user?.accessRole) return null

  const r = user.accessRole
  const bypassAll = r.bypassAll
  const permissions = new Set<PermissionKey>()
  if (!bypassAll) {
    for (const row of r.permissions) {
      if (isPermissionKey(row.key)) permissions.add(row.key)
    }
  }
  const campusesAll = r.campusesAll
  const campusIds = r.campuses.map((c) => c.campusId)

  return {
    id: user.id,
    bypassAll,
    permissions,
    campusesAll,
    campusIds,
  }
}
