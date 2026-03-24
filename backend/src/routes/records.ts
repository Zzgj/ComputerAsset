import { Router } from 'express'
import { AssetRecordAction } from '@prisma/client'

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

export const recordsRouter = Router()

recordsRouter.get('/', requireAuth, async (req, res) => {
  const assetCode = typeof req.query.assetCode === 'string' ? req.query.assetCode.trim() : ''
  const action = typeof req.query.action === 'string' ? req.query.action.trim() : ''
  const userName = typeof req.query.userName === 'string' ? req.query.userName.trim() : ''
  const startDate = typeof req.query.startDate === 'string' ? new Date(req.query.startDate) : undefined
  const endDate = typeof req.query.endDate === 'string' ? new Date(req.query.endDate) : undefined

  if (startDate && Number.isNaN(startDate.getTime())) badRequest('startDate is invalid')
  if (endDate && Number.isNaN(endDate.getTime())) badRequest('endDate is invalid')

  const page = Math.max(1, toInt(req.query.page) ?? 1)
  const pageSize = Math.min(100, Math.max(1, toInt(req.query.pageSize) ?? 20))

  const where: any = {}
  if (action && Object.values(AssetRecordAction).includes(action as AssetRecordAction)) {
    where.action = action as AssetRecordAction
  }
  if (userName) {
    where.userName = { contains: userName }
  }
  if (startDate || endDate) {
    where.actionDate = {
      ...(startDate ? { gte: startDate } : {}),
      ...(endDate ? { lte: endDate } : {}),
    }
  }
  if (assetCode) {
    where.asset = {
      assetCode: { contains: assetCode },
    }
  }

  const total = await prisma.assetRecord.count({ where })
  const items = await prisma.assetRecord.findMany({
    where,
    orderBy: { actionDate: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      asset: { select: { id: true, assetCode: true } },
      department: { select: { id: true, name: true } },
      operator: { select: { id: true, username: true, realName: true } },
    },
  })

  res.json({ items, total, page, pageSize })
})

