import { Router } from 'express'
import fs from 'fs'
import path from 'path'

import { prisma } from '../prisma'
import { requireAuth, requirePermission } from '../middleware/auth'
import { getEnv } from '../utils/env'

const backupRouter = Router()
function badRequest(message: string, details?: unknown): never {
  throw { statusCode: 400, message, details }
}

function getDbPath() {
  const { DATABASE_URL } = getEnv()
  if (!DATABASE_URL.startsWith('file:')) badRequest('Only file: DATABASE_URL is supported for local sqlite backup')
  const relative = DATABASE_URL.replace(/^file:/, '')
  const resolved = path.isAbsolute(relative) ? relative : path.resolve(process.cwd(), relative)
  return resolved
}

function getBackupDirPath() {
  const { BACKUP_DIR } = getEnv()
  return path.resolve(process.cwd(), BACKUP_DIR)
}

backupRouter.post('/', requireAuth, requirePermission('backup.run'), async (req, res) => {
  const authUser = (req as any).auth as { id: number }

  const srcPath = getDbPath()
  if (!fs.existsSync(srcPath)) badRequest('Database file not found')

  const backupDir = getBackupDirPath()
  fs.mkdirSync(backupDir, { recursive: true })

  const name = `backup_${Date.now()}.db`
  const destPath = path.join(backupDir, name)
  fs.copyFileSync(srcPath, destPath)

  const stat = fs.statSync(destPath)

  await prisma.operationLog.create({
    data: {
      operatorId: authUser.id,
      action: '本地备份',
      targetType: 'Backup',
      targetId: 0,
      detail: { name, size: stat.size, mtimeMs: stat.mtimeMs },
      ipAddress: req.ip ?? 'unknown',
    },
  })

  res.json({ name, size: stat.size, mtimeMs: stat.mtimeMs })
})

backupRouter.get('/list', requireAuth, requirePermission('backup.run'), async (_req, res) => {
  const backupDir = getBackupDirPath()
  if (!fs.existsSync(backupDir)) {
    return res.json({ items: [] })
  }

  const files = fs.readdirSync(backupDir)
  const items = files
    .filter((f) => f.toLowerCase().endsWith('.db'))
    .map((name) => {
      const p = path.join(backupDir, name)
      const stat = fs.statSync(p)
      return { name, size: stat.size, mtimeMs: stat.mtimeMs }
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs)

  res.json({ items })
})

backupRouter.get('/download/:name', requireAuth, requirePermission('backup.run'), async (req, res) => {
  const backupDir = getBackupDirPath()
  const nameParam = req.params.name
  const name = Array.isArray(nameParam) ? nameParam[0] : nameParam
  if (typeof name !== 'string') badRequest('Invalid backup name')
  if (!/^[a-zA-Z0-9_.-]+$/.test(name)) badRequest('Invalid backup name')

  const abs = path.resolve(backupDir, name)
  if (!abs.startsWith(backupDir)) badRequest('Invalid backup path')
  if (!fs.existsSync(abs)) badRequest('Backup not found')

  res.download(abs, name)
})

export { backupRouter }

