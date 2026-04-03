<template>
  <div class="ca-page ca-animate">
    <el-card shadow="never">
      <div class="ca-page-header">
        <div>
          <div class="ca-page-title">部门管理</div>
          <div class="ca-page-subtitle">
            先选园区，仅展示该园区下的部门树。路径示例：<strong>泰鼎 - 综合部门 - 信息中心</strong>。新增默认落在当前园区；变更上级可跨园区移动。
          </div>
        </div>
        <el-button type="primary" :disabled="!activeCampusId" @click="openAdd">在当前园区新增</el-button>
      </div>
    </el-card>

    <el-card shadow="never">
      <div style="margin-bottom: 16px">
        <el-radio-group v-model="activeCampusId" size="large">
          <el-radio-button v-for="c in displayCampuses" :key="c.id" :value="c.id">
            {{ c.name }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <div v-loading="loading">
        <el-empty v-if="!activeCampusId" description="正在加载园区…" />
        <template v-else>
          <el-empty
            v-if="treeDataForCampus.length === 0"
            :description="`「${currentCampusName}」下暂无部门，请点击右上角新增`"
          />
          <el-table
            v-else
            :data="treeDataForCampus"
            row-key="id"
            size="small"
            style="width: 100%"
            border
            :tree-props="{ children: 'children' }"
          >
            <el-table-column prop="name" label="部门" min-width="160" />
            <el-table-column label="完整路径" min-width="320">
              <template #default="{ row }">
                <span style="color: var(--ca-text-secondary)">{{ row.displayPath }}</span>
              </template>
            </el-table-column>
            <el-table-column label="启用" width="88" align="center">
              <template #default="{ row }">
                <el-tag :type="row.isActive ? 'success' : 'info'" size="small" effect="light">
                  {{ row.isActive ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right" align="center">
              <template #default="{ row }">
                <el-button size="small" text type="primary" @click="openEdit(row)">编辑</el-button>
                <el-button size="small" text type="danger" @click="remove(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑部门' : '新增部门'" width="560px" destroy-on-close>
      <el-form :model="form" label-width="100px">
        <el-form-item label="所属园区">
          <el-input :model-value="campusNameById(form.campusId)" disabled />
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="form.name" placeholder="同级下名称唯一" />
        </el-form-item>
        <el-form-item label="上级部门">
          <el-select
            v-model="form.parentId"
            placeholder="不选 = 直属当前园区（顶级）"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="opt in parentOptions"
              :key="opt.id"
              :label="opt.displayPath"
              :value="opt.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="form.sortOrder" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.isActive" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { apiRequest, type ApiError } from '../services/api'

type CampusItem = { id: number; name: string; sortOrder: number }
type DeptItem = {
  id: number
  name: string
  campusId: number
  parentId: number | null
  sortOrder: number
  isActive: boolean
  displayPath: string
  deptPathOnly?: string
  campus?: { id: number; name: string }
  children?: DeptItem[]
}

const loading = ref(false)
const flatItems = ref<DeptItem[]>([])
const campuses = ref<CampusItem[]>([])
const activeCampusId = ref<number | null>(null)
const dialogVisible = ref(false)

const form = reactive<{
  id: number | null
  name: string
  campusId: number | null
  parentId: number | null
  sortOrder: number
  isActive: boolean
}>({
  id: null,
  name: '',
  campusId: null,
  parentId: null,
  sortOrder: 0,
  isActive: true,
})

const displayCampuses = computed(() =>
  [...campuses.value].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id).slice(0, 3),
)

const currentCampusName = computed(() => {
  if (!activeCampusId.value) return ''
  return displayCampuses.value.find((c) => c.id === activeCampusId.value)?.name ?? ''
})

function campusNameById(id: number | null) {
  if (id == null) return '—'
  return campuses.value.find((c) => c.id === id)?.name ?? '—'
}

function collectForbiddenIds(rootId: number, items: DeptItem[]): Set<number> {
  const byParent = new Map<number | null, DeptItem[]>()
  for (const d of items) {
    const k = d.parentId
    const arr = byParent.get(k) ?? []
    arr.push(d)
    byParent.set(k, arr)
  }
  const out = new Set<number>([rootId])
  const walk = (id: number) => {
    for (const k of byParent.get(id) ?? []) {
      out.add(k.id)
      walk(k.id)
    }
  }
  walk(rootId)
  return out
}

const parentOptions = computed(() => {
  const items = flatItems.value
  if (!form.id) {
    return items.map((d) => ({ id: d.id, displayPath: d.displayPath }))
  }
  const bad = collectForbiddenIds(form.id, items)
  return items.filter((d) => !bad.has(d.id)).map((d) => ({ id: d.id, displayPath: d.displayPath }))
})

function buildTree(items: DeptItem[]): DeptItem[] {
  const map = new Map<number, DeptItem>()
  for (const d of items) {
    map.set(d.id, { ...d, children: [] })
  }
  const roots: DeptItem[] = []
  for (const d of items) {
    const node = map.get(d.id)!
    if (d.parentId == null) roots.push(node)
    else {
      const p = map.get(d.parentId)
      if (p) (p.children as DeptItem[]).push(node)
      else roots.push(node)
    }
  }
  const sortRec = (arr: DeptItem[]) => {
    arr.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
    for (const n of arr) {
      if (n.children?.length) sortRec(n.children)
    }
  }
  sortRec(roots)
  return roots
}

const treeDataForCampus = computed(() => {
  if (!activeCampusId.value) return []
  return buildTree(flatItems.value.filter((d) => d.campusId === activeCampusId.value))
})

async function loadCampuses() {
  const data = await apiRequest<{ items: CampusItem[] }>('/api/campuses')
  campuses.value = data.items ?? []
}

async function load() {
  loading.value = true
  try {
    const data = await apiRequest<{ items: DeptItem[] }>('/api/departments')
    flatItems.value = data.items ?? []
  } finally {
    loading.value = false
  }
}

function pickDefaultCampus() {
  const list = displayCampuses.value
  if (!list.length) {
    activeCampusId.value = null
    return
  }
  if (activeCampusId.value != null && list.some((c) => c.id === activeCampusId.value)) return
  const tai = list.find((c) => c.name === '泰鼎')
  const first = list[0]
  activeCampusId.value = tai?.id ?? first?.id ?? null
}

function openAdd() {
  if (!activeCampusId.value) return
  const inCampus = flatItems.value.filter((d) => d.campusId === activeCampusId.value)
  const maxSort = inCampus.length ? Math.max(...inCampus.map((x) => x.sortOrder)) + 1 : 0
  Object.assign(form, {
    id: null,
    name: '',
    campusId: activeCampusId.value,
    parentId: null,
    sortOrder: maxSort,
    isActive: true,
  })
  dialogVisible.value = true
}

function openEdit(row: DeptItem) {
  Object.assign(form, {
    id: row.id,
    name: row.name,
    campusId: row.campusId,
    parentId: row.parentId,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
  })
  dialogVisible.value = true
}

async function save() {
  if (!form.name.trim()) return ElMessage.error('请填写名称')
  if (!form.campusId) return ElMessage.error('缺少园区')

  const payload: Record<string, unknown> = {
    name: form.name.trim(),
    sortOrder: form.sortOrder,
    isActive: form.isActive,
    parentId: form.parentId,
  }

  if (form.id) {
    if (!form.parentId) payload.campusId = form.campusId
    await apiRequest(`/api/departments/${form.id}`, { method: 'PUT', body: payload })
  } else {
    payload.campusId = form.campusId
    await apiRequest('/api/departments', { method: 'POST', body: payload })
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  await load()
  pickDefaultCampus()
}

async function remove(row: DeptItem) {
  try {
    await ElMessageBox.confirm(`确认删除：${row.displayPath}？`, '提示', { type: 'warning' })
  } catch {
    return
  }
  try {
    await apiRequest(`/api/departments/${row.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    await load()
  } catch (e) {
    const err = e as ApiError
    const msg = err.message || '删除失败'
    ElMessage.error(
      err.status === 403
        ? `无权限：${msg}（仅管理员可删部门；访客请使用管理员账号）`
        : msg,
    )
  }
}

watch(
  () => form.parentId,
  (pid) => {
    if (pid == null) return
    const p = flatItems.value.find((d) => d.id === pid)
    if (p) form.campusId = p.campusId
  },
)

watch(displayCampuses, pickDefaultCampus, { immediate: true })

onMounted(async () => {
  await loadCampuses()
  await load()
  pickDefaultCampus()
})
</script>
