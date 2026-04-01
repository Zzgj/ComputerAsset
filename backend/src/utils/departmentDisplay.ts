import type { Campus, Department } from '@prisma/client'

export type DepartmentWithCampus = Department & { campus: Campus }

/** 与前端展示、Excel 导出保持一致 */
export const DEPT_DISPLAY_SEP = ' - '

/** 园区 - 一级 - 二级 … */
export function computeDepartmentDisplayPath(
  dept: DepartmentWithCampus,
  idToDept: Map<number, Pick<Department, 'name' | 'parentId'>>,
): string {
  const parts: string[] = [dept.campus.name]
  let curId: number | null = dept.id
  const names: string[] = []
  while (curId != null) {
    const row = idToDept.get(curId)
    if (!row) break
    names.unshift(row.name)
    curId = row.parentId
  }
  return [...parts, ...names].join(DEPT_DISPLAY_SEP)
}

/** 去掉首段园区名，仅保留部门链路 */
export function departmentPathWithoutCampus(displayPath: string): string {
  const parts = displayPath.split(DEPT_DISPLAY_SEP).map((s) => s.trim()).filter(Boolean)
  if (parts.length <= 1) return parts[0] ?? ''
  return parts.slice(1).join(DEPT_DISPLAY_SEP)
}

export function buildDepartmentPathMap(rows: Department[]): Map<number, Pick<Department, 'name' | 'parentId'>> {
  return new Map(rows.map((d) => [d.id, { name: d.name, parentId: d.parentId }]))
}

export type DepartmentWithPath = DepartmentWithCampus & { displayPath: string; deptPathOnly: string }

/** 为已含 campus 的部门节点挂上 displayPath / deptPathOnly（历史台账按当时 departmentId 可呈现当时园区-部门） */
export function attachDepartmentPathFields(
  dept: DepartmentWithCampus | null | undefined,
  pathMap: Map<number, Pick<Department, 'name' | 'parentId'>>,
): DepartmentWithPath | null | undefined {
  if (!dept) return dept
  const displayPath = computeDepartmentDisplayPath(dept, pathMap)
  return { ...dept, displayPath, deptPathOnly: departmentPathWithoutCampus(displayPath) }
}
