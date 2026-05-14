import { Router } from 'express'

import { prisma } from '../prisma'
import { requireAuth, requirePermission } from '../middleware/auth'

function toInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value)
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    if (Number.isFinite(n)) return Math.trunc(n)
  }
  return null
}

function badRequest(message: string, details?: unknown): never {
  throw { statusCode: 400, message, details }
}

const includeDetail = {
  asset: { select: { id: true, assetCode: true, status: true, currentUserName: true } },
  record: { select: { id: true, actionDate: true, userName: true, remark: true } },
  fromCampus: { select: { id: true, name: true } },
  toCampus: { select: { id: true, name: true } },
  sender: { select: { id: true, username: true, realName: true } },
  recipient: { select: { id: true, username: true, realName: true } },
} as const

export const transferNotificationsRouter = Router()

transferNotificationsRouter.get(
  '/',
  requireAuth,
  requirePermission('operations.execute'),
  async (req, res) => {
    const authUser = (req as any).auth as { id: number }
    const box = typeof req.query.box === 'string' ? req.query.box : 'inbox'
    const unreadOnly = req.query.unreadOnly === 'true' || req.query.unreadOnly === '1'
    const page = Math.max(1, toInt(req.query.page) ?? 1)
    const pageSize = Math.min(100, Math.max(1, toInt(req.query.pageSize) ?? 20))

    const where =
      box === 'sent'
        ? { senderId: authUser.id }
        : {
            recipientId: authUser.id,
            ...(unreadOnly ? { isRead: false } : {}),
          }

    const [total, unreadCount, items] = await Promise.all([
      prisma.assetTransferNotification.count({ where }),
      prisma.assetTransferNotification.count({ where: { recipientId: authUser.id, isRead: false } }),
      prisma.assetTransferNotification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: includeDetail,
      }),
    ])

    res.json({ items, total, page, pageSize, unreadCount })
  },
)

transferNotificationsRouter.get(
  '/unread-count',
  requireAuth,
  requirePermission('operations.execute'),
  async (req, res) => {
    const authUser = (req as any).auth as { id: number }
    const unreadCount = await prisma.assetTransferNotification.count({
      where: { recipientId: authUser.id, isRead: false },
    })
    res.json({ unreadCount })
  },
)

transferNotificationsRouter.post(
  '/:id/read',
  requireAuth,
  requirePermission('operations.execute'),
  async (req, res) => {
    const authUser = (req as any).auth as { id: number }
    const id = toInt(req.params.id)
    if (!id) badRequest('Invalid notification id')

    const row = await prisma.assetTransferNotification.findUnique({ where: { id } })
    if (!row) throw { statusCode: 404, message: 'Notification not found' }
    if (row.recipientId !== authUser.id) {
      throw { statusCode: 403, message: '只能由接收人标记已读' }
    }

    const notification = await prisma.assetTransferNotification.update({
      where: { id },
      data: row.isRead ? {} : { isRead: true, readAt: new Date() },
      include: includeDetail,
    })

    await prisma.operationLog.create({
      data: {
        operatorId: authUser.id,
        action: '调拨通知已读',
        targetType: 'AssetTransferNotification',
        targetId: id,
        detail: {
          assetId: notification.assetId,
          assetCode: notification.asset.assetCode,
          fromCampusId: notification.fromCampusId,
          toCampusId: notification.toCampusId,
        },
        ipAddress: req.ip ?? 'unknown',
      },
    })

    res.json({ notification })
  },
)
