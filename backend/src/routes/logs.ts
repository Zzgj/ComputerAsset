import { Router } from 'express'
import { Role } from '@prisma/client'

import { prisma } from '../prisma'
import { requireAuth } from '../middleware/auth'

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

logsRouter.get('/', requireAuth, async (req, res) => {
  const qAction = typeof req.query.action === 'string' ? req.query.action : undefined
  const startDate = typeof req.query.startDate === 'string' ? new Date(req.query.startDate) : undefined
  const endDate = typeof req.query.endDate === 'string' ? new Date(req.query.endDate) : undefined

  if (startDate && Number.isNaN(startDate.getTime())) badRequest('startDate is invalid')
  if (endDate && Number.isNaN(endDate.getTime())) badRequest('endDate is invalid')

  const page = Math.max(1, toInt(req.query.page) ?? 1)
  const pageSize = Math.min(100, Math.max(1, toInt(req.query.pageSize) ?? 20))

  const where: any = {}
  if (qAction) {
    where.action = { contains: qAction }
  }
  if (startDate || endDate) {
    where.createdAt = {
      ...(startDate ? { gte: startDate } : {}),
      ...(endDate ? { lte: endDate } : {}),
    }
  }

  const total = await prisma.operationLog.count({ where })
  const items = await prisma.operationLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      operator: { select: { id: true, username: true, realName: true, role: true } },
    },
  })

  res.json({ items, total, page, pageSize })
})

