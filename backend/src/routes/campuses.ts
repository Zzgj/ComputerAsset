import { Router } from 'express'

import type { AccessAuth } from '../auth/accessContext'
import { authHasPermission } from '../auth/accessContext'
import { prisma } from '../prisma'
import { requireAuth } from '../middleware/auth'

export const campusesRouter = Router()

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
