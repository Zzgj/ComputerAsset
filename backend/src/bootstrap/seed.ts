import bcrypt from 'bcryptjs'

import { prisma } from '../prisma'
import { AssetStatus } from '@prisma/client'

export async function ensureSeed() {
  const userCount = await prisma.user.count()
  if (userCount === 0) {
    const hashed = await bcrypt.hash('admin123', 10)
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashed,
        realName: '管理员',
        role: 'super_admin',
        isActive: true,
        mustChangePass: true,
      },
    })
  }

  const configCount = await prisma.systemConfig.count()
  if (configCount === 0) {
    await prisma.systemConfig.createMany({
      data: [
        { configKey: 'one_person_one_device', configValue: 'true' },
        { configKey: 'default_borrow_days', configValue: '7' },
        { configKey: 'waiting_pickup_alert_days', configValue: '3' },
        { configKey: 'borrow_advance_alert_days', configValue: '1' },
      ],
    })
  }

  // Used for "clear department/user" transitions (cancel_assign / return / repair / retire).
  await prisma.department.upsert({
    where: { name: '未分配' },
    update: { sortOrder: 0, isActive: true },
    create: { name: '未分配', sortOrder: 0, isActive: true },
  })

  // 兼容历史数据：早期版本可能把“使用中”写成了 `in_user`（拼写错误）
  // 这里在启动时做一次幂等修复，避免资产列表展示异常、且让后续状态流转逻辑可正常工作。
  // 注意：`status` 字段是 Prisma enum，直接用 `updateMany({ where: { status: 'in_user' } })`
  // 会触发 Prisma 的运行时 enum 校验失败。这里改用原生 SQL 直接修复历史脏数据。
  await prisma.$executeRaw`UPDATE Asset SET status = ${AssetStatus.in_use} WHERE status = 'in_user'`
}

