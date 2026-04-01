import express from 'express'
import cors from 'cors'

import { router } from './routes'
import { errorHandler } from './middleware/errorHandler'
import { requireAuth, requirePermission } from './middleware/auth'
import { sendAssetImportTemplate } from './routes/excel'

export const app = express()

app.use(cors())
app.use(express.json({ limit: '20mb' }))

// 挂在 app 上且先于 /api Router，避免嵌套路由在部分 Express 版本下 GET 返回 404
app.get('/api/excel/template', requireAuth, requirePermission('excel.import'), sendAssetImportTemplate)

app.use('/api', router)

app.use(errorHandler)

