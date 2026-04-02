import type { Prisma } from '@prisma/client'
import { Router } from 'express'

import { prisma } from '../prisma'
import { requireAuth, requirePermission } from '../middleware/auth'
import { LOG_CATEGORY_OPTIONS, operationLogWhereForCategory } from '../utils/logCategories'

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

export const logsRouter = Router()

logsRouter.get('/meta', requireAuth, requirePermission('logs.read'), async (_req, res) => {
  res.json({ categories: LOG_CATEGORY_OPTIONS })
})

logsRouter.get('/', requireAuth, requirePermission('logs.read'), async (req, res) => {
  const qAction = typeof req.query.action === 'string' ? req.query.action : undefined
  const category = typeof req.query.category === 'string' ? req.query.category : undefined
  const startDate = typeof req.query.startDate === 'string' ? new Date(req.query.startDate) : undefined
  const endDate = typeof req.query.endDate === 'string' ? new Date(req.query.endDate) : undefined

  if (startDate && Number.isNaN(startDate.getTime())) badRequest('startDate is invalid')
  if (endDate && Number.isNaN(endDate.getTime())) badRequest('endDate is invalid')

  const page = Math.max(1, toInt(req.query.page) ?? 1)
  const pageSize = Math.min(100, Math.max(1, toInt(req.query.pageSize) ?? 20))

  const parts: Prisma.OperationLogWhereInput[] = []
  const catWhere = operationLogWhereForCategory(category)
  if (catWhere) parts.push(catWhere)
  if (qAction) parts.push({ action: { contains: qAction } })
  if (startDate || endDate) {
    parts.push({
      createdAt: {
        ...(startDate ? { gte: startDate } : {}),
        ...(endDate ? { lte: endDate } : {}),
      },
    })
  }

  const where: Prisma.OperationLogWhereInput =
    parts.length === 0 ? {} : parts.length === 1 ? parts[0]! : { AND: parts }

  const total = await prisma.operationLog.count({ where })
  const items = await prisma.operationLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      operator: {
        select: {
          id: true,
          username: true,
          realName: true,
          accessRole: { select: { name: true, slug: true } },
        },
      },
    },
  })

  res.json({ items, total, page, pageSize })
})

