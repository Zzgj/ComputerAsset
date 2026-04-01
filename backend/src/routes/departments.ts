import { Router } from 'express'

import type { AccessAuth } from '../auth/accessContext'
import { assertCampusAccess } from '../auth/accessContext'
import { prisma } from '../prisma'
import { requireAuth, requirePermission } from '../middleware/auth'
import {
  buildDepartmentPathMap,
  computeDepartmentDisplayPath,
  departmentPathWithoutCampus,
} from '../utils/departmentDisplay'

type Tx = Omit<
  typeof prisma,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends' | '$disconnect'
>

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

async function assertNoCycle(tx: Tx, deptId: number, newParentId: number | null) {
  if (newParentId === null) return
  let cur: number | null = newParentId
  while (cur != null) {
    if (cur === deptId) badRequest('不能移动到自身或子部门下')
    const row: { parentId: number | null } | null = await tx.department.findUnique({
      where: { id: cur },
      select: { parentId: true },
    })
    cur = row?.parentId ?? null
  }
}

async function syncSubtreeCampus(tx: Tx, rootId: number, campusId: number) {
  await tx.department.update({ where: { id: rootId }, data: { campusId } })
  const children = await tx.department.findMany({
    where: { parentId: rootId },
    select: { id: true },
  })
  for (const c of children) {
    await syncSubtreeCampus(tx, c.id, campusId)
  }
}

async function assertSiblingNameUnique(
  tx: Tx,
  campusId: number,
  parentId: number | null,
  name: string,
  excludeId?: number,
) {
  const dup = await tx.department.findFirst({
    where: {
      campusId,
      parentId,
      name,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  })
  if (dup) badRequest('同一上级下已存在同名部门')
}

export const departmentsRouter = Router()

departmentsRouter.get('/', requireAuth, async (req, res) => {
  const access = (req as any).access as AccessAuth
  const campusId = toInt(req.query.campusId)
  const where: { campusId?: number | { in: number[] } } = {}
  if (campusId) {
    if (!access.bypassAll && !access.campusesAll && !access.campusIds.includes(campusId)) {
      return res.json({ items: [] })
    }
    where.campusId = campusId
  } else if (!access.bypassAll && !access.campusesAll) {
    if (!access.campusIds.length) return res.json({ items: [] })
    where.campusId = { in: access.campusIds }
  }
  const items = await prisma.department.findMany({
    where: Object.keys(where).length ? where : undefined,
    orderBy: [{ campusId: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }],
    include: { campus: true },
  })
  const pathMap = buildDepartmentPathMap(items)
  const enriched = items.map((d) => {
    const displayPath = computeDepartmentDisplayPath(d, pathMap)
    return {
      ...d,
      displayPath,
      deptPathOnly: departmentPathWithoutCampus(displayPath),
    }
  })
  res.json({ items: enriched })
})

departmentsRouter.post('/', requireAuth, requirePermission('departments.manage'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const body = req.body as {
    campusId?: unknown
    parentId?: unknown
    name?: unknown
    sortOrder?: unknown
    isActive?: unknown
  }
  if (typeof body.name !== 'string' || body.name.trim() === '') badRequest('name is required')

  const sortOrder = typeof body.sortOrder === 'number' ? body.sortOrder : Number(body.sortOrder)
  if (!Number.isFinite(sortOrder)) badRequest('sortOrder is required')

  const isActive = typeof body.isActive === 'boolean' ? body.isActive : true
  let parentId = body.parentId === null || body.parentId === undefined ? null : toInt(body.parentId)
  if (parentId === undefined) badRequest('parentId invalid')

  let campusId = toInt(body.campusId)
  if (parentId !== null) {
    const parent = await prisma.department.findUnique({ where: { id: parentId } })
    if (!parent) badRequest('上级部门不存在')
    campusId = parent.campusId
  } else {
    if (!campusId) badRequest('顶级部门必须指定园区 campusId')
    const c = await prisma.campus.findUnique({ where: { id: campusId } })
    if (!c) badRequest('园区不存在')
  }

  assertCampusAccess(access, campusId!)

  await assertSiblingNameUnique(prisma, campusId!, parentId, body.name.trim())

  const created = await prisma.department.create({
    data: {
      name: body.name.trim(),
      sortOrder,
      isActive,
      campusId: campusId!,
      parentId,
    },
    include: { campus: true },
  })
  const pathMap = buildDepartmentPathMap(await prisma.department.findMany())
  const displayPath = computeDepartmentDisplayPath(created, pathMap)

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '新增部门',
      targetType: 'Department',
      targetId: created.id,
      detail: { name: created.name, campusId: campusId!, parentId, displayPath },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ department: { ...created, displayPath } })
})

departmentsRouter.put('/:id', requireAuth, requirePermission('departments.manage'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid department id')

  const existing = await prisma.department.findUnique({ where: { id }, include: { campus: true } })
  if (!existing) badRequest('Department not found')
  assertCampusAccess(access, existing.campusId)

  const body = req.body as {
    name?: unknown
    sortOrder?: unknown
    isActive?: unknown
    parentId?: unknown
    campusId?: unknown
  }

  const name =
    typeof body.name === 'string' && body.name.trim() !== '' ? body.name.trim() : existing.name

  let sortOrder = existing.sortOrder
  if (typeof body.sortOrder !== 'undefined') {
    const s = typeof body.sortOrder === 'number' ? body.sortOrder : Number(body.sortOrder)
    if (!Number.isFinite(s)) badRequest('sortOrder is invalid')
    sortOrder = s
  }

  let isActive = existing.isActive
  if (typeof body.isActive === 'boolean') isActive = body.isActive

  let newParentId = existing.parentId
  let newCampusId = existing.campusId

  const parentIdProvided = Object.prototype.hasOwnProperty.call(body, 'parentId')
  const campusIdProvided = Object.prototype.hasOwnProperty.call(body, 'campusId')

  if (parentIdProvided) {
    if (body.parentId === null) {
      newParentId = null
      if (campusIdProvided) {
        const c = toInt(body.campusId)
        if (!c) badRequest('campusId invalid')
        newCampusId = c
      } else {
        newCampusId = existing.campusId
      }
    } else {
      const pid = toInt(body.parentId)
      if (!pid) badRequest('parentId invalid')
      const parent = await prisma.department.findUnique({ where: { id: pid } })
      if (!parent) badRequest('上级部门不存在')
      newParentId = pid
      newCampusId = parent.campusId
    }
  } else if (campusIdProvided && existing.parentId === null) {
    const c = toInt(body.campusId)
    if (!c) badRequest('campusId invalid')
    newCampusId = c
  }

  assertCampusAccess(access, newCampusId)

  const updated = await prisma.$transaction(async (tx) => {
    await assertNoCycle(tx, id, newParentId)
    await assertSiblingNameUnique(tx, newCampusId, newParentId, name, id)

    const cExist = await tx.campus.findUnique({ where: { id: newCampusId } })
    if (!cExist) badRequest('园区不存在')

    const row = await tx.department.update({
      where: { id },
      data: {
        name,
        sortOrder,
        isActive,
        parentId: newParentId,
        campusId: newCampusId,
      },
      include: { campus: true },
    })
    await syncSubtreeCampus(tx, id, newCampusId)
    return row
  })

  const pathMap = buildDepartmentPathMap(await prisma.department.findMany())
  const displayPath = computeDepartmentDisplayPath(updated, pathMap)

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '编辑部门',
      targetType: 'Department',
      targetId: id,
      detail: { name, sortOrder, isActive, parentId: newParentId, campusId: newCampusId, displayPath },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ department: { ...updated, displayPath } })
})

departmentsRouter.delete('/:id', requireAuth, requirePermission('departments.manage'), async (req, res) => {
  const access = (req as any).access as AccessAuth
  const authUser = (req as any).auth as { id: number }
  const id = toInt(req.params.id)
  if (!id) badRequest('Invalid department id')

  const row = await prisma.department.findUnique({ where: { id }, select: { campusId: true } })
  if (!row) badRequest('Department not found')
  assertCampusAccess(access, row.campusId)

  const childCount = await prisma.department.count({ where: { parentId: id } })
  if (childCount > 0) badRequest('存在子部门，请先删除或移动子部门')

  const assetCount = await prisma.asset.count({ where: { departmentId: id } })
  if (assetCount > 0) badRequest('Cannot delete: department has related assets')

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '删除部门',
      targetType: 'Department',
      targetId: id,
      detail: {},
      ipAddress: req.ip ?? 'unknown',
    },
  })

  await prisma.department.delete({ where: { id } })
  res.json({ ok: true })
})
