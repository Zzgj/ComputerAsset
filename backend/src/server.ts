import 'dotenv/config'

import { app } from './app'
import { getEnv } from './utils/env'
import { ensureSeed } from './bootstrap/seed'
import { prisma } from './prisma'

const { PORT } = getEnv()

async function main() {
  await ensureSeed()

  const server = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[backend] listening on :${PORT}`)
  })

  const shutdown = async (signal: string) => {
    // eslint-disable-next-line no-console
    console.log(`\n[backend] received ${signal}, shutting down ...`)
    server.close()
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('[backend] failed to start', e)
  process.exit(1)
})

