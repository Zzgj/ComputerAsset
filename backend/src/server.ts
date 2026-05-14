import 'dotenv/config'

import { app } from './app'
import { getEnv } from './utils/env'
import { ensureSeed } from './bootstrap/seed'
import { prisma } from './prisma'
import { logger, formatError } from './utils/logger'

const { PORT } = getEnv()

async function main() {
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
