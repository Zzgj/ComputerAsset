<template>
  <div class="ca-page ca-animate">
    <el-card shadow="never">
      <div class="ca-page-header">
        <div>
          <div class="ca-page-title">资产列表</div>
          <div class="ca-page-subtitle">查看和管理所有电脑资产，支持多维度搜索和筛选</div>
        </div>
        <el-button v-if="canStockIn" type="primary" @click="router.push('/stock-in')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增入库
        </el-button>
      </div>
      <div class="filter-bar">
        <el-input
          v-model="query.q"
          placeholder="搜索：编号/品牌/型号/序列号/使用人"
          style="width: 320px"
          @keyup.enter="search"
          @change="search"
          clearable
        />
        <el-select v-model="query.status" placeholder="状态" style="width: 140px" clearable>
          <el-option v-for="s in statusOptions" :key="s.value" :label="s.label" :value="s.value" />
        </el-select>
        <el-select v-model="query.deviceType" placeholder="设备类型" style="width: 120px" clearable>
          <el-option v-for="o in deviceTypeFilterOptions" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
        <el-select v-model="query.campusId" placeholder="园区" style="width: 130px" clearable>
          <el-option v-for="c in campuses" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
        <el-select v-model="query.departmentId" placeholder="部门" style="width: 220px" filterable clearable>
          <el-option v-for="d in departments" :key="d.id" :label="d.displayPath ?? d.name" :value="d.id" />
        </el-select>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-popover placement="bottom-end" :width="240" trigger="click">
          <template #reference>
            <el-button>列设置</el-button>
          </template>
          <div class="assets-col-settings">
            <div v-for="c in columnDefs" :key="c.key" class="assets-col-settings__row">
              <el-checkbox v-model="colVisible[c.key]" @change="persistColumnPrefs">{{ c.label }}</el-checkbox>
            </div>
            <div class="assets-col-settings__hint">设置保存在本浏览器</div>
          </div>
        </el-popover>
      </div>
    </el-card>

    <el-card shadow="never">
      <el-table :data="assets" v-loading="loading" style="width: 100%" border class="assets-table">
        <el-table-column prop="assetCode" label="电脑编号" min-width="140" />
        <el-table-column v-if="colVisible.deviceType" label="设备类型" min-width="100">
          <template #default="{ row }">{{ deviceTypeLabel(row.deviceType) }}</template>
        </el-table-column>
        <el-table-column v-if="colVisible.brand" label="品牌" min-width="120">
          <template #default="{ row }">{{ formatText(row.brand) }}</template>
        </el-table-column>
        <el-table-column v-if="colVisible.model" label="型号" min-width="150">
          <template #default="{ row }">{{ formatText(row.model) }}</template>
        </el-table-column>
        <el-table-column v-if="colVisible.serial" label="序列号" min-width="160">
          <template #default="{ row }">{{ formatSerial(row.serialNumber) }}</template>
        </el-table-column>
        <el-table-column v-if="colVisible.status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" effect="light">
              {{ statusOptions.find((s) => s.value === row.status)?.label ?? row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="colVisible.currentUser" label="使用人" min-width="140">
          <template #default="{ row }">
            <template v-if="!String(row.currentUserName ?? '').trim()">
              {{ formatText(row.currentUserName) }}
            </template>
            <el-tooltip v-else-if="isMultiHolder(row.currentUserName)" content="该使用人名下有多台处于领用/借用等状态的电脑" placement="top">
              <el-tag type="danger" effect="dark">{{ row.currentUserName }}</el-tag>
            </el-tooltip>
            <span v-else>{{ row.currentUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="colVisible.campus" label="园区" min-width="100">
          <template #default="{ row }">{{ formatText(row.department?.campus?.name) }}</template>
        </el-table-column>
        <el-table-column v-if="colVisible.department" label="部门" min-width="200">
          <template #default="{ row }">{{ formatText(row.department?.deptPathOnly ?? row.department?.name) }}</template>
        </el-table-column>
        <el-table-column v-if="colVisible.template" label="设备模板" min-width="140">
          <template #default="{ row }">
            <el-tag v-if="row.template?.name" type="primary" effect="plain">{{ row.template.name }}</el-tag>
            <el-tag v-else type="info" effect="plain">自定义</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" text @click="goDetail(row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 16px; display: flex; justify-content: flex-end">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="query.pageSize"
          :current-page="query.page"
          @current-change="onPageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQuery } from 'vue-router'
import { apiRequest } from '../services/api'
import { useAuthStore } from '../stores/auth'
import { DEVICE_TYPE_OPTIONS, deviceTypeLabel } from '../constants/deviceType'

const ASSETS_LIST_COLUMNS_KEY = 'ca_assets_list_columns_v2'

type AssetListColKey =
  | 'brand'
  | 'model'
  | 'template'
  | 'deviceType'
  | 'serial'
  | 'status'
  | 'currentUser'
  | 'campus'
  | 'department'

const columnDefs: { key: AssetListColKey; label: string }[] = [
  { key: 'deviceType', label: '设备类型' },
  { key: 'brand', label: '品牌' },
  { key: 'model', label: '型号' },
  { key: 'serial', label: '序列号' },
  { key: 'status', label: '状态' },
  { key: 'currentUser', label: '使用人' },
  { key: 'campus', label: '园区' },
  { key: 'department', label: '部门' },
  { key: 'template', label: '设备模板' },
]

function defaultColumnVisibility(): Record<AssetListColKey, boolean> {
  return {
    deviceType: true,
    brand: true,
    model: true,
    serial: true,
    status: true,
    currentUser: true,
    campus: true,
    department: true,
    template: false,
  }
}

function loadColumnPrefs(): Record<AssetListColKey, boolean> {
  const base = defaultColumnVisibility()
  try {
    const raw = localStorage.getItem(ASSETS_LIST_COLUMNS_KEY)
    if (!raw) return base
    const parsed = JSON.parse(raw) as Partial<Record<AssetListColKey, boolean>>
    for (const k of Object.keys(base) as AssetListColKey[]) {
      if (typeof parsed[k] === 'boolean') base[k] = parsed[k]
    }
    return base
  } catch {
    return defaultColumnVisibility()
  }
}

const colVisible = reactive(loadColumnPrefs())

function persistColumnPrefs() {
  try {
    localStorage.setItem(ASSETS_LIST_COLUMNS_KEY, JSON.stringify({ ...colVisible }))
  } catch {
    /* ignore */
  }
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const canStockIn = computed(() => authStore.can('assets.write'))

const loading = ref(false)
const assets = ref<any[]>([])
const total = ref(0)
const multiHolderUserNames = ref<Set<string>>(new Set())
const campuses = ref<Array<{ id: number; name: string }>>([])
const departments = ref<Array<{ id: number; name: string; displayPath?: string }>>([])

const deviceTypeFilterOptions = [...DEVICE_TYPE_OPTIONS]

const statusOptions = [
  { label: '在库', value: 'in_stock' },
  { label: '待领用', value: 'waiting_pickup' },
  { label: '使用中', value: 'in_use' },
  { label: '借用中', value: 'borrowed' },
  { label: '维修中', value: 'in_repair' },
  { label: '已报废', value: 'retired' },
]

function statusTagType(status: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    in_stock: '',
    waiting_pickup: 'warning',
    in_use: 'success',
    borrowed: 'warning',
    in_repair: 'danger',
    retired: 'info',
  }
  return map[status] ?? 'info'
}

const query = reactive({
  q: '',
  status: '',
  /** 未选择时为 null，避免 el-select 与空字符串 `''` 产生误显示 */
  deviceType: null as string | null,
  campusId: null as number | null,
  departmentId: null as number | null,
  page: 1,
  pageSize: 20,
})

function parseOptionalInt(v: LocationQuery[string] | undefined): number | null {
  if (v === undefined || v === null || v === '') return null
  const raw = Array.isArray(v) ? v[0] : v
  if (raw === undefined || raw === null || raw === '') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

function applyListQueryFromRoute(q: LocationQuery) {
  const str = (key: string) => {
    const v = q[key]
    return typeof v === 'string' ? v : ''
  }
  query.q = str('q')
  query.status = str('status')
  const dt = str('deviceType')
  query.deviceType = deviceTypeFilterOptions.some((o) => o.value === dt) ? dt : null
  query.campusId = parseOptionalInt(q.campusId)
  query.departmentId = parseOptionalInt(q.departmentId)
  const p = q.page
  query.page = p ? Math.max(1, parseInt(String(Array.isArray(p) ? p[0] : p), 10) || 1) : 1
  const ps = q.pageSize
  query.pageSize = ps
    ? Math.min(100, Math.max(1, parseInt(String(Array.isArray(ps) ? ps[0] : ps), 10) || 20))
    : 20
}

function buildListQueryForRoute(): Record<string, string> {
  const o: Record<string, string> = {}
  const qv = query.q.trim()
  if (qv) o.q = qv
  if (query.status) o.status = query.status
  if (query.deviceType != null && query.deviceType !== '') o.deviceType = query.deviceType
  if (query.campusId != null) o.campusId = String(query.campusId)
  if (query.departmentId != null) o.departmentId = String(query.departmentId)
  if (query.page > 1) o.page = String(query.page)
  if (query.pageSize !== 20) o.pageSize = String(query.pageSize)
  return o
}

function syncListUrl() {
  router.replace({ name: 'assets', query: buildListQueryForRoute() })
}

async function loadFilters() {
  const [dRes, cRes] = await Promise.all([
    apiRequest<{ items: any[] }>('/api/departments'),
    apiRequest<{ items: any[] }>('/api/campuses'),
  ])
  departments.value = dRes.items ?? []
  campuses.value = cRes.items ?? []
}

async function loadAssets() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (query.q) params.set('q', query.q)
    if (query.status) params.set('status', query.status)
    if (query.deviceType != null && query.deviceType !== '') params.set('deviceType', query.deviceType)
    if (query.campusId) params.set('campusId', String(query.campusId))
    if (query.departmentId) params.set('departmentId', String(query.departmentId))
    params.set('page', String(query.page))
    params.set('pageSize', String(query.pageSize))

    const data = await apiRequest<{
      items: any[]
      total: number
      page: number
      pageSize: number
      multiHolderUserNames?: string[]
    }>('/api/assets?' + params.toString())
    assets.value = data.items
    total.value = data.total
    multiHolderUserNames.value = new Set(data.multiHolderUserNames ?? [])
    syncListUrl()
  } finally {
    loading.value = false
  }
}

function search() {
  query.page = 1
  loadAssets()
}

function goDetail(id: number) {
  router.push({
    name: 'assetDetail',
    params: { id: String(id) },
    query: buildListQueryForRoute(),
  })
}

function onPageChange(p: number) {
  query.page = p
  loadAssets()
}

function formatText(v: unknown) {
  const s = String(v ?? '').trim()
  if (!s) return '暂无'
  return s
}

function isMultiHolder(name: string) {
  return multiHolderUserNames.value.has(String(name ?? ''))
}

function formatSerial(serialNumber: string) {
  const s = String(serialNumber ?? '').trim()
  if (!s) return '暂无'
  if (s === '暂无' || s.startsWith('暂无-')) return '暂无'
  return s
}

onMounted(async () => {
  applyListQueryFromRoute(route.query)
  await loadFilters()
  await loadAssets()
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 16px;
}

.assets-table :deep(.el-table__body td) {
  border-right-color: transparent;
  border-bottom-color: transparent;
}

.assets-table :deep(.el-table__body tr td:first-child) {
  border-left-color: transparent;
}

.assets-col-settings__row {
  margin-bottom: 8px;
}

.assets-col-settings__hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--ca-text-muted, #909399);
}
</style>
