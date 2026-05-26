import bcrypt from 'bcryptjs'

import { prisma } from '../prisma'

const PAREN_DEPT_FIX_KEY = 'data_fix.split_paren_named_departments'
const EMPLOYEE_BOOTSTRAP_KEY = 'data_fix.bootstrap_employees_from_assets_v1'
const EMPLOYEE_PERMS_BACKFILL_KEY = 'data_fix.backfill_employee_permissions_v1'

/** 「综合部门（人事部）」「信息部（运维）」→ 上级「综合部门」+ 子「人事部」，各园区幂等。
 * 这段嵌套循环 + 字符串解析的修复无法用 SQL 表达，保留在 seed 中；通过 SystemConfig 打标，避免每次启动重扫全表。
 */
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

/** 从历史 Asset.currentUserName 自动生成员工记录（一次性，打标后跳过）。
 *  - 全部归属泰鼎园区（约定）
 *  - employeeNo 用 `AUTO-{n}` 前缀，避免与未来人工录入冲突
 *  - departmentId 取该名字下任意一台资产（id 最小）的部门
 *  - 回填 Asset.currentEmployeeId
 */
async function bootstrapEmployeesFromAssets() {
  const taiding = await prisma.campus.findUnique({ where: { name: '泰鼎' } })
  if (!taiding) return

  const assets = await prisma.asset.findMany({
    where: { currentUserName: { not: '' } },
    select: { id: true, currentUserName: true, departmentId: true },
    orderBy: { id: 'asc' },
  })

  const grouped = new Map<string, { departmentId: number; assetIds: number[] }>()
  for (const a of assets) {
    const key = String(a.currentUserName || '').trim()
    if (!key) continue
    const cur = grouped.get(key)
    if (cur) {
      cur.assetIds.push(a.id)
    } else {
      grouped.set(key, { departmentId: a.departmentId, assetIds: [a.id] })
    }
  }

  let seq = (await prisma.employee.count({ where: { employeeNo: { startsWith: 'AUTO-' } } })) + 1
  for (const [name, info] of grouped) {
    const existing = await prisma.employee.findFirst({ where: { name, campusId: taiding.id } })
    let employeeId: number
    if (existing) {
      employeeId = existing.id
    } else {
      let employeeNo = `AUTO-${seq}`
      while (await prisma.employee.findUnique({ where: { employeeNo } })) {
        seq++
        employeeNo = `AUTO-${seq}`
      }
      const created = await prisma.employee.create({
        data: {
          employeeNo,
          name,
          campusId: taiding.id,
          departmentId: info.departmentId,
          status: 'active',
          remark: '由系统从历史资产数据自动生成，请补全工号',
        },
      })
      employeeId = created.id
      seq++
    }
    await prisma.asset.updateMany({
      where: { id: { in: info.assetIds }, currentEmployeeId: null },
      data: { currentEmployeeId: employeeId },
    })
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

  // 「父（子）」式部门拆分：仅在未做过时跑一次，跑完打标。
  // 其余 in_user 修复、泰鼎部门归位已迁移到 SQL migration。
  const parenFixDone = await prisma.systemConfig.findUnique({ where: { configKey: PAREN_DEPT_FIX_KEY } })
  if (!parenFixDone) {
    await splitParenNamedDepartments()
    await prisma.systemConfig.create({
      data: {
        configKey: PAREN_DEPT_FIX_KEY,
        configValue: new Date().toISOString(),
        description: '一次性数据修复：拆分「父（子）」格式部门为父子层级',
      },
    })
  }

  // 一次性从历史资产数据自动生成员工记录（仅在未做过时跑）
  const employeeBootstrapDone = await prisma.systemConfig.findUnique({
    where: { configKey: EMPLOYEE_BOOTSTRAP_KEY },
  })
  if (!employeeBootstrapDone) {
    await bootstrapEmployeesFromAssets()
    await prisma.systemConfig.create({
      data: {
        configKey: EMPLOYEE_BOOTSTRAP_KEY,
        configValue: new Date().toISOString(),
        description: '一次性数据回填：从 Asset.currentUserName 生成员工记录并归属泰鼎园区',
      },
    })
  }

  // 为已有非 bypassAll 角色补全 employees.* 权限（一次性）
  const permsBackfillDone = await prisma.systemConfig.findUnique({
    where: { configKey: EMPLOYEE_PERMS_BACKFILL_KEY },
  })
  if (!permsBackfillDone) {
    const newPerms = ['employees.read', 'employees.write', 'employees.resign']
    const roles = await prisma.accessRole.findMany({
      where: { bypassAll: false },
      select: { id: true, permissions: { select: { key: true } } },
    })
    for (const role of roles) {
      const existing = new Set(role.permissions.map((p) => p.key))
      // 只给已有 operations.execute 的角色补全（说明是业务管理角色而非只读）
      if (!existing.has('operations.execute')) continue
      for (const perm of newPerms) {
        if (!existing.has(perm)) {
          await prisma.accessRolePermission.create({ data: { roleId: role.id, key: perm } })
        }
      }
    }
    await prisma.systemConfig.create({
      data: {
        configKey: EMPLOYEE_PERMS_BACKFILL_KEY,
        configValue: new Date().toISOString(),
        description: '一次性权限回填：为已有业务管理角色补全 employees.read/write/resign',
      },
    })
  }
}
