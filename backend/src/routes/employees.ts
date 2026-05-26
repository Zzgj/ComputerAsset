import { Router } from 'express'

import { applyCampusScopeToAssetWhere, applyCampusScopeToEmployeeWhere, assertCampusAccess } from '../auth/accessContext'
import { prisma } from '../prisma'
import { requireAuth, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  CreateEmployeeSchema,
  CreateResourceSchema,
  ListEmployeesQuerySchema,
  QuickCreateEmployeeSchema,
  ResignSchema,
  UpdateEmployeeCampusSchema,
  UpdateEmployeeSchema,
  UpdateResourceSchema,
} from './employees.schemas'

function badRequest(message: string, details?: unknown): never {
  throw { statusCode: 400, message, details }
}

function notFound(message: string): never {
  throw { statusCode: 404, message }
}

function toInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value)
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    if (Number.isFinite(n)) return Math.trunc(n)
  }
  return null
}

async function ensureEmployeeNoUnique(employeeNo: string, excludeId?: number) {
  const exist = await prisma.employee.findUnique({ where: { employeeNo } })
  if (exist && exist.id !== excludeId) badRequest('员工编号已存在')
}

async function loadEmployeeOr404(id: number) {
  const e = await prisma.employee.findUnique({
    where: { id },
    include: {
      campus: { select: { id: true, name: true } },
      department: { select: { id: true, name: true, campusId: true } },
      resources: { orderBy: { id: 'asc' } },
    },
  })
  if (!e) notFound('员工不存在')
  return e
}

export const employeesRouter = Router()

employeesRouter.get(
  '/',
  requireAuth,
  requirePermission('employees.read'),
  async (req, res) => {
    const access = req.access!
    const { keyword, campusId, departmentId, status, page, pageSize } = ListEmployeesQuerySchema.parse(req.query)

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (campusId) where.campusId = campusId
    if (departmentId) where.departmentId = departmentId
    if (keyword && keyword.trim()) {
      const kw = keyword.trim()
      where.OR = [{ name: { contains: kw } }, { employeeNo: { contains: kw } }]
    }
    applyCampusScopeToEmployeeWhere(where, access)

    const [total, items] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.findMany({
        where,
        orderBy: [{ status: 'asc' }, { id: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          campus: { select: { id: true, name: true } },
          department: { select: { id: true, name: true } },
        },
      }),
    ])

    res.json({ total, page, pageSize, items })
  },
)

employeesRouter.get(
  '/:id',
  requireAuth,
  requirePermission('employees.read'),
  async (req, res) => {
    const access = req.access!
    const id = toInt(req.params.id)
    if (!id) badRequest('Invalid employee id')

    const employee = await loadEmployeeOr404(id)
    assertCampusAccess(access, employee.campusId)

    // 资产范围按 access 园区过滤：员工调过园区后，原园区资产仍由原园区管理员可见
    const assetWhere: Record<string, unknown> = { currentEmployeeId: id }
    applyCampusScopeToAssetWhere(assetWhere, access)

    const assets = await prisma.asset.findMany({
      where: assetWhere,
      include: {
        department: { select: { id: true, name: true, campusId: true } },
      },
      orderBy: { id: 'asc' },
    })

    res.json({ employee, assets })
  },
)

employeesRouter.post(
  '/',
  requireAuth,
  requirePermission('employees.write'),
  validate({ body: CreateEmployeeSchema }),
  async (req, res) => {
    const access = req.access!
    const authUser = req.auth!
    const body = req.body as {
      employeeNo: string
      name: string
      campusId: number
      departmentId?: number
      joinedAt?: string
      remark?: string
    }

    assertCampusAccess(access, body.campusId)
    await ensureEmployeeNoUnique(body.employeeNo)

    if (body.departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: body.departmentId },
        select: { campusId: true },
      })
      if (!dept) badRequest('部门不存在')
      if (dept.campusId !== body.campusId) badRequest('部门与员工园区不一致')
    }

    let joinedAt: Date | null = null
    if (body.joinedAt) {
      const d = new Date(body.joinedAt)
      if (Number.isNaN(d.getTime())) badRequest('joinedAt 无效')
      joinedAt = d
    }

    const created = await prisma.employee.create({
      data: {
        employeeNo: body.employeeNo.trim(),
        name: body.name.trim(),
        campusId: body.campusId,
        departmentId: body.departmentId ?? null,
        status: 'active',
        joinedAt,
        remark: body.remark?.trim() || null,
      },
    })

    await prisma.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '新建员工',
        targetType: 'Employee',
        targetId: created.id,
        detail: { employeeNo: created.employeeNo, name: created.name, campusId: created.campusId },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    res.json({ employee: created })
  },
)

employeesRouter.post(
  '/quick-create',
  requireAuth,
  requirePermission('employees.write'),
  validate({ body: QuickCreateEmployeeSchema }),
  async (req, res) => {
    const access = req.access!
    const authUser = req.auth!
    const body = req.body as {
      employeeNo: string
      name: string
      campusId: number
      departmentId?: number
      remark?: string
    }

    assertCampusAccess(access, body.campusId)
    await ensureEmployeeNoUnique(body.employeeNo)

    if (body.departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: body.departmentId },
        select: { campusId: true },
      })
      if (!dept) badRequest('部门不存在')
      if (dept.campusId !== body.campusId) badRequest('部门与员工园区不一致')
    }

    const created = await prisma.employee.create({
      data: {
        employeeNo: body.employeeNo.trim(),
        name: body.name.trim(),
        campusId: body.campusId,
        departmentId: body.departmentId ?? null,
        status: 'active',
        remark: body.remark?.trim() || '快速新建（出库流程）',
      },
    })

    await prisma.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '快速新建员工',
        targetType: 'Employee',
        targetId: created.id,
        detail: { employeeNo: created.employeeNo, name: created.name, campusId: created.campusId },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    res.json({ employee: created })
  },
)

employeesRouter.patch(
  '/:id',
  requireAuth,
  requirePermission('employees.write'),
  validate({ body: UpdateEmployeeSchema }),
  async (req, res) => {
    const access = req.access!
    const authUser = req.auth!
    const id = toInt(req.params.id)
    if (!id) badRequest('Invalid employee id')

    const existing = await prisma.employee.findUnique({ where: { id }, select: { id: true, campusId: true, employeeNo: true } })
    if (!existing) notFound('员工不存在')
    assertCampusAccess(access, existing.campusId)

    const body = req.body as {
      name?: string
      employeeNo?: string
      departmentId?: number | null
      joinedAt?: string | null
      remark?: string | null
    }

    const data: Record<string, unknown> = {}
    if (typeof body.name === 'string') data.name = body.name.trim()
    if (typeof body.employeeNo === 'string') {
      const next = body.employeeNo.trim()
      if (next !== existing.employeeNo) {
        await ensureEmployeeNoUnique(next, id)
      }
      data.employeeNo = next
    }

    if (Object.prototype.hasOwnProperty.call(body, 'departmentId')) {
      if (body.departmentId === null || body.departmentId === undefined) {
        data.departmentId = null
      } else {
        const dept = await prisma.department.findUnique({
          where: { id: body.departmentId },
          select: { campusId: true },
        })
        if (!dept) badRequest('部门不存在')
        if (dept.campusId !== existing.campusId) badRequest('部门与员工园区不一致')
        data.departmentId = body.departmentId
      }
    }
    if (Object.prototype.hasOwnProperty.call(body, 'joinedAt')) {
      if (body.joinedAt) {
        const d = new Date(body.joinedAt)
        if (Number.isNaN(d.getTime())) badRequest('joinedAt 无效')
        data.joinedAt = d
      } else {
        data.joinedAt = null
      }
    }
    if (Object.prototype.hasOwnProperty.call(body, 'remark')) {
      data.remark = body.remark ? String(body.remark).trim() : null
    }

    const updated = await prisma.employee.update({ where: { id }, data })

    await prisma.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '编辑员工',
        targetType: 'Employee',
        targetId: id,
        detail: data as Record<string, any>,
        ipAddress: req.ip ?? 'unknown',
      },
    })

    res.json({ employee: updated })
  },
)

employeesRouter.patch(
  '/:id/campus',
  requireAuth,
  requirePermission('employees.transfer_campus'),
  validate({ body: UpdateEmployeeCampusSchema }),
  async (req, res) => {
    const access = req.access!
    const authUser = req.auth!
    const id = toInt(req.params.id)
    if (!id) badRequest('Invalid employee id')

    const existing = await prisma.employee.findUnique({ where: { id }, select: { id: true, campusId: true } })
    if (!existing) notFound('员工不存在')

    const { campusId } = req.body as { campusId: number }
    // 校验源/目标园区都在调用者范围内（防止把员工调离自己看不见的园区）
    assertCampusAccess(access, existing.campusId)
    assertCampusAccess(access, campusId)
    if (existing.campusId === campusId) return res.json({ ok: true, unchanged: true })

    const updated = await prisma.employee.update({
      where: { id },
      data: { campusId, departmentId: null },
    })

    await prisma.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '修改员工园区',
        targetType: 'Employee',
        targetId: id,
        detail: { from: existing.campusId, to: campusId },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    res.json({ employee: updated })
  },
)

employeesRouter.post(
  '/:id/resources',
  requireAuth,
  requirePermission('employees.write'),
  validate({ body: CreateResourceSchema }),
  async (req, res) => {
    const access = req.access!
    const authUser = req.auth!
    const id = toInt(req.params.id)
    if (!id) badRequest('Invalid employee id')

    const employee = await prisma.employee.findUnique({ where: { id }, select: { id: true, campusId: true } })
    if (!employee) notFound('员工不存在')
    assertCampusAccess(access, employee.campusId)

    const body = req.body as {
      type: string
      identifier: string
      status: 'active' | 'closed'
      assignedAt?: string
      remark?: string
    }

    let assignedAt: Date | undefined
    if (body.assignedAt) {
      const d = new Date(body.assignedAt)
      if (Number.isNaN(d.getTime())) badRequest('assignedAt 无效')
      assignedAt = d
    }

    const created = await prisma.employeeResource.create({
      data: {
        employeeId: id,
        type: body.type as any,
        identifier: body.identifier.trim(),
        status: body.status,
        assignedAt: assignedAt ?? new Date(),
        closedAt: body.status === 'closed' ? new Date() : null,
        remark: body.remark?.trim() || null,
      },
    })

    await prisma.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '新增员工资源',
        targetType: 'EmployeeResource',
        targetId: created.id,
        detail: { employeeId: id, type: created.type, identifier: created.identifier },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    res.json({ resource: created })
  },
)

employeesRouter.patch(
  '/:id/resources/:resourceId',
  requireAuth,
  requirePermission('employees.write'),
  validate({ body: UpdateResourceSchema }),
  async (req, res) => {
    const access = req.access!
    const authUser = req.auth!
    const id = toInt(req.params.id)
    const resourceId = toInt(req.params.resourceId)
    if (!id || !resourceId) badRequest('Invalid id')

    const employee = await prisma.employee.findUnique({ where: { id }, select: { id: true, campusId: true } })
    if (!employee) notFound('员工不存在')
    assertCampusAccess(access, employee.campusId)

    const existing = await prisma.employeeResource.findUnique({ where: { id: resourceId } })
    if (!existing || existing.employeeId !== id) notFound('资源不存在')

    const body = req.body as {
      type?: string
      identifier?: string
      status?: 'active' | 'closed'
      remark?: string | null
    }

    const data: Record<string, unknown> = {}
    if (body.type) data.type = body.type
    if (body.identifier) data.identifier = body.identifier.trim()
    if (body.status && body.status !== existing.status) {
      data.status = body.status
      data.closedAt = body.status === 'closed' ? new Date() : null
    }
    if (Object.prototype.hasOwnProperty.call(body, 'remark')) {
      data.remark = body.remark ? String(body.remark).trim() : null
    }

    const updated = await prisma.employeeResource.update({ where: { id: resourceId }, data })

    await prisma.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '编辑员工资源',
        targetType: 'EmployeeResource',
        targetId: resourceId,
        detail: data as Record<string, any>,
        ipAddress: req.ip ?? 'unknown',
      },
    })

    res.json({ resource: updated })
  },
)

employeesRouter.delete(
  '/:id/resources/:resourceId',
  requireAuth,
  requirePermission('employees.write'),
  async (req, res) => {
    const access = req.access!
    const authUser = req.auth!
    const id = toInt(req.params.id)
    const resourceId = toInt(req.params.resourceId)
    if (!id || !resourceId) badRequest('Invalid id')

    const employee = await prisma.employee.findUnique({ where: { id }, select: { id: true, campusId: true } })
    if (!employee) notFound('员工不存在')
    assertCampusAccess(access, employee.campusId)

    const existing = await prisma.employeeResource.findUnique({ where: { id: resourceId } })
    if (!existing || existing.employeeId !== id) notFound('资源不存在')

    await prisma.employeeResource.delete({ where: { id: resourceId } })

    await prisma.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '删除员工资源',
        targetType: 'EmployeeResource',
        targetId: resourceId,
        detail: { type: existing.type, identifier: existing.identifier },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    res.json({ ok: true })
  },
)

employeesRouter.post(
  '/:id/resign',
  requireAuth,
  requirePermission('employees.resign'),
  validate({ body: ResignSchema }),
  async (req, res) => {
    const access = req.access!
    const authUser = req.auth!
    const id = toInt(req.params.id)
    if (!id) badRequest('Invalid employee id')

    const employee = await prisma.employee.findUnique({ where: { id } })
    if (!employee) notFound('员工不存在')
    assertCampusAccess(access, employee.campusId)
    if (employee.status === 'resigned') badRequest('员工已离职')

    const body = req.body as {
      resourceIds: number[]
      forceMarkResign: boolean
      resignedAt?: string
      remark?: string
    }

    const pendingAssets = await prisma.asset.findMany({
      where: { currentEmployeeId: id },
      select: { id: true, assetCode: true, status: true },
    })

    if (pendingAssets.length > 0 && !body.forceMarkResign) {
      return res.status(409).json({
        error: {
          code: 'EMPLOYEE_HAS_PENDING_ASSETS',
          message: `员工名下还有 ${pendingAssets.length} 台未归还资产，请先处理或选择强制完成`,
          details: { pendingAssets },
        },
      })
    }

    const resignedAt = body.resignedAt ? new Date(body.resignedAt) : new Date()
    if (Number.isNaN(resignedAt.getTime())) badRequest('resignedAt 无效')

    const result = await prisma.$transaction(async (tx) => {
      let closedResourceIds: number[] = []
      if (body.resourceIds.length) {
        const resources = await tx.employeeResource.findMany({
          where: { employeeId: id, id: { in: body.resourceIds }, status: 'active' },
          select: { id: true },
        })
        closedResourceIds = resources.map((r) => r.id)
        if (closedResourceIds.length) {
          await tx.employeeResource.updateMany({
            where: { id: { in: closedResourceIds } },
            data: { status: 'closed', closedAt: resignedAt },
          })
        }
      }

      const updated = await tx.employee.update({
        where: { id },
        data: {
          status: 'resigned',
          resignedAt,
          remark: body.remark
            ? employee.remark
              ? `${employee.remark}\n[离职] ${body.remark}`
              : `[离职] ${body.remark}`
            : employee.remark,
        },
      })

      await tx.operationLog.create({
        data: {
          operatorId: authUser.id,
          action: '办理员工离职',
          targetType: 'Employee',
          targetId: id,
          detail: {
            employeeNo: employee.employeeNo,
            name: employee.name,
            closedResourceIds,
            pendingAssetIds: pendingAssets.map((a) => a.id),
            forceMarkResign: body.forceMarkResign,
            resignedAt,
          },
          ipAddress: req.ip ?? 'unknown',
        },
      })

      return { employee: updated, closedResourceIds, pendingAssets }
    })

    res.json(result)
  },
)

employeesRouter.post(
  '/:id/reactivate',
  requireAuth,
  requirePermission('employees.transfer_campus'),
  async (req, res) => {
    const access = req.access!
    const authUser = req.auth!
    const id = toInt(req.params.id)
    if (!id) badRequest('Invalid employee id')

    const employee = await prisma.employee.findUnique({ where: { id } })
    if (!employee) notFound('员工不存在')
    assertCampusAccess(access, employee.campusId)
    if (employee.status === 'active') badRequest('员工已是在职状态')

    const updated = await prisma.employee.update({
      where: { id },
      data: { status: 'active', resignedAt: null },
    })

    await prisma.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '重新激活员工',
        targetType: 'Employee',
        targetId: id,
        detail: { employeeNo: employee.employeeNo, name: employee.name },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    res.json({ employee: updated })
  },
)
