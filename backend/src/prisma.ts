import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

import { getEnv } from './utils/env'

// PrismaClient 在开发环境下避免重复创建（ts/tsx 可能触发多次加载）
const globalForPrisma = global as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaLibSql({ url: getEnv().DATABASE_URL }),
    log: ['error', 'warn'],
  })

if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma

