/** 与入库/出库部门级联选择器配套 */

export type DeptFlat = {
  id: number
  name: string
  campusId: number
  parentId: number | null
  sortOrder: number
}

export type CampusLite = { id: number; name: string; sortOrder: number }

export type DeptCascaderOption = {
  value: number
  label: string
  disabled?: boolean
  children?: DeptCascaderOption[]
}

function buildSubTree(flat: DeptFlat[]): DeptCascaderOption[] {
  const map = new Map<number, DeptCascaderOption>()
  for (const d of flat) {
    map.set(d.id, { value: d.id, label: d.name })
  }
  const roots: DeptCascaderOption[] = []
  for (const d of flat) {
    const node = map.get(d.id)!
    if (d.parentId == null) {
      roots.push(node)
    } else {
      const p = map.get(d.parentId)
      if (p) {
        if (!p.children) p.children = []
        p.children.push(node)
      } else {
        roots.push(node)
      }
    }
  }
  const sortRec = (arr: DeptCascaderOption[]) => {
    arr.sort((a, b) => {
      const da = flat.find((x) => x.id === a.value)
      const db = flat.find((x) => x.id === b.value)
      if (!da || !db) return 0
      return da.sortOrder - db.sortOrder || da.id - db.id
    })
    for (const n of arr) {
      if (n.children?.length) sortRec(n.children)
    }
  }
  sortRec(roots)

  const prune = (arr: DeptCascaderOption[]) => {
    for (const n of arr) {
      if (n.children?.length) prune(n.children)
      else delete n.children
    }
  }
  prune(roots)
  return roots
}

/**
 * 顶层为园区（仅分组不可选），其下为部门树，任意层级可选。
 * 园区节点 value 为负数，避免与部门 id 冲突。
 */
export function buildDepartmentCascaderOptions(
  flat: DeptFlat[],
  campuses: CampusLite[],
): DeptCascaderOption[] {
  const ordered = [...campuses].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
  return ordered.map((c) => {
    const inCampus = flat.filter((d) => d.campusId === c.id)
    const children = buildSubTree(inCampus)
    return {
      value: -c.id,
      label: c.name,
      disabled: true,
      children: children.length ? children : undefined,
    }
  })
}
