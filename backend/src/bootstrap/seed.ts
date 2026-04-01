import bcrypt from 'bcryptjs'

import { prisma } from '../prisma'
import { AssetStatus } from '@prisma/client'

/** 「综合部门（人事部）」「信息部（运维）」→ 上级「综合部门」+ 子「人事部」，各园区幂等 */
async function splitParenNamedDepartments() {
  const parenRe = /^(.+?)[（(](.+?)[）)]$/
  for (let iter = 0; iter < 20; iter++) {
    const all = await prisma.department.findMany({ orderBy: { id: 'asc' } })
    const batch = all.filter((d) => parenRe.test(String(d.name).trim()))
    if (!batch.length) break

    for (const d of batch) {
      const m = String(d.name).trim().match(parenRe)
      if (!m) continue
      const outer = m[1].trim()
      const inner = m[2].trim()
      if (!outer || !inner || outer === inner) continue

      let parent = await prisma.department.findFirst({
        where: { campusId: d.campusId, parentId: null, name: outer },
        orderBy: { id: 'asc' },
      })
      if (!parent) {
        parent = await prisma.department.create({
          data: {
            campusId: d.campusId,
            parentId: null,
            name: outer,
            sortOrder: d.sortOrder,
            isActive: d.isActive,
          },
        })
      }

      if (parent.id === d.id) continue

      const sibling = await prisma.department.findFirst({
        where: {
          campusId: d.campusId,
          parentId: parent.id,
          name: inner,
          NOT: { id: d.id },
        },
        orderBy: { id: 'asc' },
      })

      if (sibling) {
        await prisma.asset.updateMany({ where: { departmentId: d.id }, data: { departmentId: sibling.id } })
        await prisma.assetRecord.updateMany({ where: { departmentId: d.id }, data: { departmentId: sibling.id } })
        await prisma.department.updateMany({ where: { parentId: d.id }, data: { parentId: sibling.id } })
        await prisma.department.delete({ where: { id: d.id } })
        continue
      }

      await prisma.department.update({
        where: { id: d.id },
        data: { name: inner, parentId: parent.id },
      })
    }
  }
}

export async function ensureSeed() {
  const userCount = await prisma.user.count()
  if (userCount === 0) {
    const hashed = await bcrypt.hash('admin123', 10)
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashed,
        realName: '管理员',
        accessRoleId: 1,
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

  // 园区（迁移已插入三个默认园区；此处保证排序与启用状态）
  const campusNames = ['擎鼎', '爱鼎', '泰鼎'] as const
  for (let i = 0; i < campusNames.length; i++) {
    const name = campusNames[i]
    await prisma.campus.upsert({
      where: { name },
      update: { sortOrder: i, isActive: true },
      create: { name, sortOrder: i, isActive: true },
    })
  }

  // 每个园区下保留「未分配」（用于归还/取消分配等回到在库）
  const campuses = await prisma.campus.findMany({ orderBy: { sortOrder: 'asc' } })
  for (const c of campuses) {
    const exist = await prisma.department.findFirst({
      where: { name: '未分配', campusId: c.id, parentId: null },
    })
    if (!exist) {
      await prisma.department.create({
        data: { name: '未分配', campusId: c.id, parentId: null, sortOrder: 0, isActive: true },
      })
    }
  }

  // 将「某某（子部门）」写成一行的历史数据拆成两级目录（与擎鼎「点父展开子」的结构一致）
  await splitParenNamedDepartments()

  // 泰鼎：若「综合部门」（或「综合部」）与「信息中心」同为顶级部门，则将「信息中心」归入其下（启动时幂等整理）
  const taidong = await prisma.campus.findUnique({ where: { name: '泰鼎' } })
  if (taidong) {
    const zonghe =
      (await prisma.department.findFirst({
        where: { campusId: taidong.id, parentId: null, name: '综合部门' },
      })) ??
      (await prisma.department.findFirst({
        where: { campusId: taidong.id, parentId: null, name: '综合部' },
      }))
    const xxzx = await prisma.department.findFirst({
      where: { campusId: taidong.id, parentId: null, name: '信息中心' },
    })
    if (zonghe && xxzx) {
      await prisma.department.update({
        where: { id: xxzx.id },
        data: { parentId: zonghe.id },
      })
    }
  }

  // 兼容历史数据：早期版本可能把“使用中”写成了 `in_user`（拼写错误）
  // 这里在启动时做一次幂等修复，避免资产列表展示异常、且让后续状态流转逻辑可正常工作。
  // 注意：`status` 字段是 Prisma enum，直接用 `updateMany({ where: { status: 'in_user' } })`
  // 会触发 Prisma 的运行时 enum 校验失败。这里改用原生 SQL 直接修复历史脏数据。
  await prisma.$executeRaw`UPDATE Asset SET status = ${AssetStatus.in_use} WHERE status = 'in_user'`
}

