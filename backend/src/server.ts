import 'dotenv/config'

import { app } from './app'
import { getEnv } from './utils/env'
import { ensureSeed } from './bootstrap/seed'

const { PORT } = getEnv()

async function main() {
  await ensureSeed()

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[backend] listening on :${PORT}`)
  })
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('[backend] failed to start', e)
  process.exit(1)
})

