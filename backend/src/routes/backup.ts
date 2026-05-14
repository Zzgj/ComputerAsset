import { Router } from 'express'
import fs from 'fs'
import path from 'path'

import { prisma } from '../prisma'
import { requireAuth, requirePermission } from '../middleware/auth'
import { getEnv } from '../utils/env'
import { logger, formatError } from '../utils/logger'

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

type BackupEntry = { name: string; path: string; size: number; mtimeMs: number }

/** 扫描备份目录，按 mtime 倒序返回符合 `predicate` 的文件。目录不存在时返回空数组。 */
function scanBackupDir(backupDir: string, predicate: (name: string) => boolean): BackupEntry[] {
  if (!fs.existsSync(backupDir)) return []
  return fs
    .readdirSync(backupDir)
    .filter(predicate)
    .map((name) => {
      const p = path.join(backupDir, name)
      const stat = fs.statSync(p)
      return { name, path: p, size: stat.size, mtimeMs: stat.mtimeMs }
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
}

const AUTO_BACKUP_PATTERN = /^backup_\d+\.db$/i
const isAutoBackup = (name: string) => AUTO_BACKUP_PATTERN.test(name)
const isDbFile = (name: string) => name.toLowerCase().endsWith('.db')

/**
 * 按 mtime 倒序保留最近 N 份备份，多余的物理删除。
 * 只清理 backup_*.db 命名的自动备份文件，避免误删用户手动放进来的同目录文件。
 */
function pruneOldBackups(backupDir: string) {
  const { BACKUP_RETENTION_COUNT } = getEnv()
  if (BACKUP_RETENTION_COUNT <= 0) return

  const toDelete = scanBackupDir(backupDir, isAutoBackup).slice(BACKUP_RETENTION_COUNT)
  for (const f of toDelete) {
    try {
      fs.unlinkSync(f.path)
    } catch (e) {
      logger.warn('backup prune failed', { file: f.name, err: formatError(e).message })
    }
  }
  if (toDelete.length > 0) {
    logger.info('backup pruned', { removed: toDelete.length, kept: BACKUP_RETENTION_COUNT })
  }
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

  pruneOldBackups(backupDir)

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
  const items = scanBackupDir(getBackupDirPath(), isDbFile).map(({ name, size, mtimeMs }) => ({
    name,
    size,
    mtimeMs,
  }))
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

