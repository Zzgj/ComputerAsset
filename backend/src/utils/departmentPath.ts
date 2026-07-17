/**
 * 部门展示路径的进程内缓存。部门和园区数据变更频次极低（CRUD 都集中在管理页），但
 * 列表 / 详情 / 仪表盘几乎每个请求都要算 displayPath（园区 - 一级 - 二级 …），原本
 * 每次重新 prisma.department.findMany({ include: { campus: true } })。
 *
 * 失效策略：所有 department / campus 的 create / update / delete 写完后调用
 * `invalidateDepartmentPathCache()`。读路径用 `getDepartmentPathSnapshot()`，懒加载。
 */
import type { Department } from '@prisma/client'

import { prisma } from '../prisma'
import {
  buildDepartmentPathMap,
  type DepartmentWithCampus,
} from './departmentDisplay'

export type DepartmentPathSnapshot = {
  pathRows: DepartmentWithCampus[]
  pathMap: Map<number, Pick<Department, 'name' | 'parentId'>>
}

let cached: DepartmentPathSnapshot | null = null
let inflight: Promise<DepartmentPathSnapshot> | null = null

async function load(): Promise<DepartmentPathSnapshot> {
  const pathRows = (await prisma.department.findMany({
    include: { campus: true },
  })) as DepartmentWithCampus[]
  return {
    pathRows,
    pathMap: buildDepartmentPathMap(pathRows),
  }
}

/** 拿到部门路径快照；并发首次访问只触发一次 DB 查询。 */
export async function getDepartmentPathSnapshot(): Promise<DepartmentPathSnapshot> {
  if (cached) return cached
  if (!inflight) {
    inflight = load().then((snap) => {
      cached = snap
      inflight = null
      return snap
    }).catch((e) => {
      inflight = null
      throw e
    })
  }
  return inflight
}

export function invalidateDepartmentPathCache(): void {
  cached = null
}
