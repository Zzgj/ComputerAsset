import { Router } from 'express'
import { Role } from '@prisma/client'

import { prisma } from '../prisma'
import { requireAuth, requireRole } from '../middleware/auth'

const superAdminRoles: Role[] = ['super_admin']
const readRoles: Role[] = ['super_admin', 'admin']

function badRequest(message: string, details?: unknown): never {
  throw { statusCode: 400, message, details }
}

export const configRouter = Router()

configRouter.get('/', requireAuth, requireRole(readRoles), async (_req, res) => {
  const items = await prisma.systemConfig.findMany()
  res.json({ items })
})

configRouter.put('/', requireAuth, requireRole(superAdminRoles), async (req, res) => {
  const authUser = (req as any).auth as { id: number }
  const body = req.body as any

  const keys = [
    'one_person_one_device',
    'default_borrow_days',
    'waiting_pickup_alert_days',
    'borrow_advance_alert_days',
  ]

  const updateData: Record<string, string> = {}
  for (const k of keys) {
    if (typeof body[k] === 'undefined') continue
    const v = body[k]
    if (typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string') {
      updateData[k] = String(v)
    } else {
      badRequest(`config value for ${k} is invalid`)
    }
  }

  if (Object.keys(updateData).length === 0) badRequest('No config to update')

  await prisma.$transaction(async (tx) => {
    for (const [configKey, configValue] of Object.entries(updateData)) {
      await tx.systemConfig.update({
        where: { configKey },
        data: { configValue },
      })
    }
  })

  const items = await prisma.systemConfig.findMany()

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '更新系统配置',
      targetType: 'SystemConfig',
      targetId: 0,
      detail: updateData,
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ items })
})

