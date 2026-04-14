import { randomBytes } from 'crypto'
import type { Prisma } from '@prisma/client'
import { Router } from 'express'

import { prisma } from '../prisma'
import { requireAuth, requireAnyPermission, requirePermission } from '../middleware/auth'
import type { AccessAuth } from '../auth/accessContext'
import { ALL_PERMISSION_KEYS, isPermissionKey, PERMISSION_LABELS, type PermissionKey } from '../auth/permissions'

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

function slugify(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\-]/g, '')
    .slice(0, 64)
}

async function allocateUniqueRoleSlug(tx: Prisma.TransactionClient, name: string): Promise<string> {
  let slug = slugify(name)
  if (slug) {
    const taken = await tx.accessRole.findUnique({ where: { slug } })
    if (!taken) return slug
  }
  for (let i = 0; i < 50; i++) {
    const candidate = `role_${randomBytes(8).toString('hex')}`
    const taken = await tx.accessRole.findUnique({ where: { slug: candidate } })
    if (!taken) return candidate
  }
  badRequest('无法生成角色标识，请重试')
}

export const rolesRouter = Router()

rolesRouter.get('/meta', requireAuth, requireAnyPermission('roles.manage', 'users.manage'), (_req, res) => {
  res.json({
    permissions: ALL_PERMISSION_KEYS.map((k) => ({ key: k, label: PERMISSION_LABELS[k] })),
  })
})

rolesRouter.get('/', requireAuth, requireAnyPermission('roles.manage', 'users.manage'), async (_req, res) => {
  const items = await prisma.accessRole.findMany({
    orderBy: [{ isSystem: 'desc' }, { id: 'asc' }],
    include: {
      _count: { select: { users: true, permissions: true, campuses: true } },
      campuses: { include: { campus: { select: { name: true } } } },
    },
  })
  res.json({
    items: items.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      isSystem: r.isSystem,
      bypassAll: r.bypassAll,
      campusesAll: r.campusesAll,
      campusNames: r.campuses.map((c) => c.campus.name),
      userCount: r._count.users,
      permissionCount: r._count.permissions,
      campusScopeCount: r._count.campuses,
    })),
  })
})

rolesRouter.get('/:id', requireAuth, requirePermission('roles.manage'), async (req, res) => {
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid role id')
  const role = await prisma.accessRole.findUnique({
    where: { id },
    include: {
      permissions: true,
      campuses: { include: { campus: true } },
    },
  })
  if (!role) throw { statusCode: 404, message: 'Role not found' }
  res.json({
    role: {
      ...role,
      permissionKeys: role.permissions.map((p) => p.key).filter(isPermissionKey),
      campusIds: role.campuses.map((c) => c.campusId),
    },
  })
})

rolesRouter.post('/', requireAuth, requirePermission('roles.manage'), async (req, res) => {
  const body = req.body as {
    name?: unknown
    description?: unknown
    campusesAll?: unknown
    permissionKeys?: unknown
    campusIds?: unknown
  }
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) badRequest('name is required')

  const campusesAll = typeof body.campusesAll === 'boolean' ? body.campusesAll : true
  const keys = Array.isArray(body.permissionKeys)
    ? body.permissionKeys.filter((k): k is PermissionKey => typeof k === 'string' && isPermissionKey(k))
    : []
  const campusIds = Array.isArray(body.campusIds)
    ? [...new Set(body.campusIds.map((n) => toInt(n)).filter((x): x is number => x != null && x > 0))]
    : []

  if (!campusesAll && campusIds.length === 0) {
    badRequest('未勾选「全部园区」时，请至少选择一个园区')
  }

  const authUser = (req as any).auth as { id: number }

  const created = await prisma.$transaction(async (tx) => {
    const slug = await allocateUniqueRoleSlug(tx, name)
    const r = await tx.accessRole.create({
      data: {
        name,
        slug,
        description: typeof body.description === 'string' ? body.description : null,
        isSystem: false,
        bypassAll: false,
        campusesAll,
      },
    })
    if (keys.length) {
      await tx.accessRolePermission.createMany({
        data: keys.map((key) => ({ roleId: r.id, key })),
      })
    }
    if (!campusesAll && campusIds.length) {
      await tx.accessRoleCampus.createMany({
        data: campusIds.map((campusId) => ({ roleId: r.id, campusId })),
      })
    }
    await tx.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '新建角色',
        targetType: 'AccessRole',
        targetId: r.id,
        detail: { name, slug, campusesAll, permissionCount: keys.length },
        ipAddress: req.ip ?? 'unknown',
      },
    })
    return r
  })

  res.json({ role: created })
})

rolesRouter.put('/:id', requireAuth, requirePermission('roles.manage'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid role id')

  const existing = await prisma.accessRole.findUnique({ where: { id } })
  if (!existing) throw { statusCode: 404, message: 'Role not found' }

  if (existing.bypassAll && !access.bypassAll) {
    badRequest('仅超级管理员可修改「超级管理员」角色')
  }

  const body = req.body as {
    name?: unknown
    description?: unknown
    campusesAll?: unknown
    permissionKeys?: unknown
    campusIds?: unknown
  }

  if (existing.isSystem && existing.slug === 'super_admin') {
    badRequest('内置超级管理员角色不可编辑')
  }

  const data: {
    name?: string
    description?: string | null
    campusesAll?: boolean
  } = {}
  if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim()
  if (typeof body.description === 'string') data.description = body.description
  if (typeof body.campusesAll === 'boolean') data.campusesAll = body.campusesAll

  const keys = Array.isArray(body.permissionKeys)
    ? body.permissionKeys.filter((k): k is PermissionKey => typeof k === 'string' && isPermissionKey(k))
    : null
  const campusIds = Array.isArray(body.campusIds)
    ? [...new Set(body.campusIds.map((n) => toInt(n)).filter((x): x is number => x != null && x > 0))]
    : null

  const nextCampusesAll = data.campusesAll ?? existing.campusesAll
  if (keys !== null && existing.bypassAll) {
    // bypass role ignores stored permissions; skip updating permissions
  }

  if (!nextCampusesAll && campusIds !== null && campusIds.length === 0) {
    badRequest('未勾选「全部园区」时，请至少选择一个园区')
  }

  const authUser = (req as any).auth as { id: number }

  await prisma.$transaction(async (tx) => {
    await tx.accessRole.update({
      where: { id },
      data,
    })
    if (keys !== null && !existing.bypassAll) {
      await tx.accessRolePermission.deleteMany({ where: { roleId: id } })
      if (keys.length) {
        await tx.accessRolePermission.createMany({
          data: keys.map((key) => ({ roleId: id, key })),
        })
      }
    }
    if (campusIds !== null) {
      await tx.accessRoleCampus.deleteMany({ where: { roleId: id } })
      if (!nextCampusesAll && campusIds.length) {
        await tx.accessRoleCampus.createMany({
          data: campusIds.map((campusId) => ({ roleId: id, campusId })),
        })
      }
    }
    await tx.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '编辑角色',
        targetType: 'AccessRole',
        targetId: id,
        detail: { name: data.name ?? existing.name, changes: data, permissionKeys: keys, campusIds },
        ipAddress: req.ip ?? 'unknown',
      },
    })
  })

  const updated = await prisma.accessRole.findUnique({
    where: { id },
    include: { permissions: true, campuses: true },
  })
  res.json({
    role: {
      ...updated,
      permissionKeys: updated?.permissions.map((p) => p.key).filter(isPermissionKey) ?? [],
      campusIds: updated?.campuses.map((c) => c.campusId) ?? [],
    },
  })
})

rolesRouter.delete('/:id', requireAuth, requirePermission('roles.manage'), async (req, res) => {
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid role id')
  const existing = await prisma.accessRole.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } },
  })
  if (!existing) throw { statusCode: 404, message: 'Role not found' }
  if (existing.isSystem) badRequest('不能删除系统内置角色')
  if (existing._count.users > 0) badRequest('该角色仍有关联用户，无法删除')

  const authUser = (req as any).auth as { id: number }
  await prisma.$transaction(async (tx) => {
    await tx.accessRole.delete({ where: { id } })
    await tx.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '删除角色',
        targetType: 'AccessRole',
        targetId: id,
        detail: { name: existing.name, slug: existing.slug },
        ipAddress: req.ip ?? 'unknown',
      },
    })
  })
  res.json({ ok: true })
})
