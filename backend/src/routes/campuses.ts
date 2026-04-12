import { Router } from 'express'

import type { AccessAuth } from '../auth/accessContext'
import { authHasPermission } from '../auth/accessContext'
import { prisma } from '../prisma'
import { requireAuth } from '../middleware/auth'

export const campusesRouter = Router()

function badRequest(message: string): never {
  throw { statusCode: 400, message }
}

campusesRouter.get('/', requireAuth, async (req, res) => {
  const access = (req as any).access as AccessAuth
  const all = await prisma.campus.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
  let items = all
  if (!access.bypassAll && !access.campusesAll && !authHasPermission(access, 'campuses.manage')) {
    items = all.filter((c) => access.campusIds.includes(c.id))
  }
  res.json({ items })
})

campusesRouter.post('/', requireAuth, async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  if (!access?.bypassAll) {
    throw { statusCode: 403, message: '仅超级管理员可新增园区' }
  }

  const body = req.body as { name?: unknown; sortOrder?: unknown; isActive?: unknown }
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) badRequest('name is required')
  const sortOrder =
    typeof body.sortOrder === 'number' && Number.isFinite(body.sortOrder) ? Math.trunc(body.sortOrder) : 0
  const isActive = typeof body.isActive === 'boolean' ? body.isActive : true

  try {
    const campus = await prisma.campus.create({
      data: { name, sortOrder, isActive },
    })
    await prisma.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '新增园区',
        targetType: 'Campus',
        targetId: campus.id,
        detail: { name: campus.name, sortOrder: campus.sortOrder, isActive: campus.isActive },
        ipAddress: req.ip ?? 'unknown',
      },
    })
    res.json({ campus })
  } catch (e: any) {
    if (String(e?.code ?? '') === 'P2002') {
      badRequest('园区名称已存在')
    }
    throw e
  }
})

campusesRouter.delete('/:id', requireAuth, async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  if (!access?.bypassAll) {
    throw { statusCode: 403, message: '仅超级管理员可删除园区' }
  }

  const id = Number(req.params.id)
  if (!Number.isFinite(id) || id <= 0) badRequest('Invalid campus id')

  const existing = await prisma.campus.findUnique({ where: { id } })
  if (!existing) throw { statusCode: 404, message: 'Campus not found' }

  const assetCount = await prisma.asset.count({ where: { department: { campusId: id } } })
  if (assetCount > 0) {
    badRequest('该园区下仍有关联资产数据，不能删除')
  }

  const deptCount = await prisma.department.count({ where: { campusId: id } })
  if (deptCount > 0) {
    badRequest('该园区下仍有部门，不能删除')
  }

  const roleScopeCount = await prisma.accessRoleCampus.count({ where: { campusId: id } })
  if (roleScopeCount > 0) {
    badRequest('该园区仍被角色园区范围使用，不能删除')
  }

  await prisma.campus.delete({ where: { id } })
  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '删除园区',
      targetType: 'Campus',
      targetId: id,
      detail: { name: existing.name },
      ipAddress: req.ip ?? 'unknown',
    },
  })
  res.json({ ok: true })
})
