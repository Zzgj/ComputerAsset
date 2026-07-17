import { Router } from 'express'

import { prisma } from '../prisma'
import { formatError } from '../utils/logger'
import { authRouter } from './auth'
import { assetsRouter } from './assets'
import { operationsRouter } from './operations'
import { departmentsRouter } from './departments'
import { campusesRouter } from './campuses'
import { templatesRouter } from './templates'
import { usersRouter } from './users'
import { rolesRouter } from './roles'
import { configRouter } from './config'
import { dashboardRouter } from './dashboard'
import { logsRouter } from './logs'
import { excelRouter } from './excel'
import { backupRouter } from './backup'
import { recordsRouter } from './records'
import { transferNotificationsRouter } from './transferNotifications'
import { employeesRouter } from './employees'

export const router = Router()

async function checkDb(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { ok: true }
  } catch (e) {
    return { ok: false, error: formatError(e).message }
  }
}

// Liveness：仅判断进程是否存活（不依赖 DB），用于 PM2/守护进程心跳
router.get('/health/live', (_req, res) => {
  res.json({ ok: true })
})

// Readiness：进程 + DB 都就绪才返回 200，DB 故障时返回 503
router.get('/health/ready', async (_req, res) => {
  const result = await checkDb()
  if (result.ok) return res.json({ ok: true, db: 'up' })
  res.status(503).json({ ok: false, db: 'down', error: result.error })
})

// 兼容旧路径：默认走 readiness 语义，监控只 ping /api/health 时也能反映 DB 状态
router.get('/health', async (_req, res) => {
  const result = await checkDb()
  if (result.ok) return res.json({ ok: true })
  res.status(503).json({ ok: false, error: result.error })
})

router.use('/auth', authRouter)
router.use('/assets', assetsRouter)
router.use('/operations', operationsRouter)
router.use('/departments', departmentsRouter)
router.use('/campuses', campusesRouter)
router.use('/templates', templatesRouter)
router.use('/users', usersRouter)
router.use('/roles', rolesRouter)
router.use('/config', configRouter)
router.use('/dashboard', dashboardRouter)
router.use('/logs', logsRouter)
router.use('/records', recordsRouter)
router.use('/transfer-notifications', transferNotificationsRouter)
router.use('/employees', employeesRouter)
router.use('/excel', excelRouter)
router.use('/backup', backupRouter)
