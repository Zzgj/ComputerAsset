import path from 'path'
import fs from 'fs'
import express from 'express'
import cors from 'cors'

import { router } from './routes'
import { errorHandler } from './middleware/errorHandler'
import { requireAuth, requirePermission } from './middleware/auth'
import { requestId } from './middleware/requestId'
import { sendAssetImportTemplate } from './routes/excel'
import { getEnv } from './utils/env'

const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export const app = express()

// 反代环境下 req.ip 才能反映真实客户端，否则审计日志全是 127.0.0.1
app.set('trust proxy', getEnv().TRUST_PROXY)

app.use(requestId)
app.use(
  cors(
    allowedOrigins.length > 0
      ? { origin: allowedOrigins, credentials: true }
      : undefined,
  ),
)
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))

// 挂在 app 上且先于 /api Router，避免嵌套路由在部分 Express 版本下 GET 返回 404
app.get('/api/excel/template', requireAuth, requirePermission('excel.import'), sendAssetImportTemplate)

app.use('/api', router)

const staticDir = process.env.STATIC_DIR
  ? path.resolve(process.env.STATIC_DIR)
  : path.resolve(__dirname, '../../frontend/dist')

if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir))
  app.get('/{*path}', (_req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'))
  })
}

app.use(errorHandler)

