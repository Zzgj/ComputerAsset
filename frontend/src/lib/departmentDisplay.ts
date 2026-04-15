/** 与出库页、后端台账一致的「园区 - 部门…」展示文案（用于签名链接 query） */
export function formatDepartmentDisplayLabel(
  departmentId: number | null | undefined,
  departments: Array<{ id: number; name: string; campusId: number; parentId: number | null }>,
  campuses: Array<{ id: number; name: string }>,
): string {
  const id = departmentId == null ? NaN : Number(departmentId)
  if (!Number.isFinite(id)) return ''
  const byId = new Map(departments.map((d) => [d.id, d]))
  const leaf = byId.get(id)
  if (!leaf) return ''
  const campus = campuses.find((c) => c.id === leaf.campusId)
  const campusName = campus?.name?.trim() ?? ''

  const names: string[] = []
  let cur: (typeof departments)[number] | undefined = leaf
  while (cur) {
    names.unshift(String(cur.name ?? '').trim())
    cur = cur.parentId != null ? byId.get(cur.parentId) : undefined
  }

  const parts = [campusName, ...names].filter(Boolean)
  return parts.join(' - ')
}
