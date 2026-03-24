import { Router } from 'express'

import { authRouter } from './auth'
import { assetsRouter } from './assets'
import { operationsRouter } from './operations'
import { departmentsRouter } from './departments'
import { templatesRouter } from './templates'
import { usersRouter } from './users'
import { configRouter } from './config'
import { dashboardRouter } from './dashboard'
import { logsRouter } from './logs'
import { excelRouter } from './excel'
import { backupRouter } from './backup'
import { recordsRouter } from './records'

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ ok: true })
})

router.use('/auth', authRouter)
router.use('/assets', assetsRouter)
router.use('/operations', operationsRouter)
router.use('/departments', departmentsRouter)
router.use('/templates', templatesRouter)
router.use('/users', usersRouter)
router.use('/config', configRouter)
router.use('/dashboard', dashboardRouter)
router.use('/logs', logsRouter)
router.use('/records', recordsRouter)
router.use('/excel', excelRouter)
router.use('/backup', backupRouter)

