import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

import { getEnv } from './utils/env'
import { logger } from './utils/logger'

// PrismaClient 在开发环境下避免重复创建（ts/tsx 可能触发多次加载）
const globalForPrisma = global as unknown as { prisma?: PrismaClient }

function createClient() {
  const env = getEnv()
  const base = new PrismaClient({
    adapter: new PrismaLibSql({ url: env.DATABASE_URL }),
    log: ['error', 'warn'],
  })

  // 仅在非生产环境启用慢查询监控，避免内网生产环境噪音
  if (env.NODE_ENV !== 'production' && env.SLOW_QUERY_MS > 0) {
    return base.$extends({
      query: {
        $allModels: {
          async $allOperations({ operation, model, args, query }) {
            const start = Date.now()
            try {
              return await query(args)
            } finally {
              const elapsed = Date.now() - start
              if (elapsed > env.SLOW_QUERY_MS) {
                logger.warn('slow prisma query', {
                  model,
                  operation,
                  elapsedMs: elapsed,
                })
              }
            }
          },
        },
      },
    }) as unknown as PrismaClient
  }

  return base
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma
