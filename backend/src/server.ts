import 'dotenv/config'

import path from 'path'
import { spawnSync } from 'child_process'

import { app } from './app'
import { getEnv } from './utils/env'
import { ensureSeed } from './bootstrap/seed'
import { prisma } from './prisma'
import { logger, formatError } from './utils/logger'

const { PORT } = getEnv()

/**
 * 直接 `node dist/server.js` 启动时（如部署包脚本未先跑迁移），AUTO_MIGRATE=1 兜底跑一次
 * `prisma migrate deploy`，避免 schema 落后引起的运行时崩。
 */
function autoMigrate() {
  if (process.env.AUTO_MIGRATE !== '1') return
  const isWin = process.platform === 'win32'
  const cmd = path.resolve(__dirname, '..', 'node_modules', '.bin', isWin ? 'prisma.cmd' : 'prisma')
  logger.info('running prisma migrate deploy', { cmd })
  const result = spawnSync(cmd, ['migrate', 'deploy'], { stdio: 'inherit' })
  if (result.status !== 0) {
    throw new Error(`prisma migrate deploy exited with code ${result.status}`)
  }
}

async function main() {
  autoMigrate()
  await ensureSeed()

  const server = app.listen(PORT, () => {
    logger.info('backend listening', { port: PORT })
  })

  const shutdown = async (signal: string) => {
    logger.info('backend shutting down', { signal })
    server.close()
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

main().catch((e) => {
  logger.error('backend failed to start', { err: formatError(e) })
  process.exit(1)
})
