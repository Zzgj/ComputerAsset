<template>
  <div style="padding: 20px">
    <el-card shadow="never">
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
        <el-input
          v-model="query.q"
          placeholder="搜索：编号/品牌/型号/序列号/使用人"
          style="width: 320px"
          @keyup.enter="search"
        />
        <el-select v-model="query.status" placeholder="状态" style="width: 160px" clearable>
          <el-option v-for="s in statusOptions" :key="s.value" :label="s.label" :value="s.value" />
        </el-select>
        <el-select v-model="query.campusId" placeholder="园区" style="width: 130px" clearable>
          <el-option v-for="c in campuses" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
        <el-select v-model="query.departmentId" placeholder="部门" style="width: 240px" filterable clearable>
          <el-option v-for="d in departments" :key="d.id" :label="d.displayPath ?? d.name" :value="d.id" />
        </el-select>
        <el-button type="primary" @click="loadAssets">搜索</el-button>
        <el-button v-if="canStockIn" @click="router.push('/stock-in')">新增入库</el-button>
      </div>
    </el-card>

    <el-card shadow="never" style="margin-top: 16px">
      <el-table :data="assets" v-loading="loading" style="width: 100%" border class="assets-table">
        <el-table-column prop="assetCode" label="电脑编号" min-width="140" />
        <el-table-column label="品牌" min-width="120">
          <template #default="{ row }">
            {{ formatText(row.brand) }}
          </template>
        </el-table-column>
        <el-table-column label="型号" min-width="150">
          <template #default="{ row }">
            {{ formatText(row.model) }}
          </template>
        </el-table-column>
        <el-table-column label="设备模板" min-width="140">
          <template #default="{ row }">
            <el-tag v-if="row.template?.name" type="primary" effect="plain">{{ row.template.name }}</el-tag>
            <el-tag v-else type="info" effect="plain">自定义</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="序列号" min-width="160">
          <template #default="{ row }">
            {{ formatSerial(row.serialNumber) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <span>{{ statusOptions.find((s) => s.value === row.status)?.label ?? row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用人" min-width="140">
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
        <el-table-column label="园区" min-width="100">
          <template #default="{ row }">{{ formatText(row.department?.campus?.name) }}</template>
        </el-table-column>
        <el-table-column label="部门" min-width="200">
          <template #default="{ row }">
            {{ formatText(row.department?.deptPathOnly ?? row.department?.name) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
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
          @current-change="(p: number) => (query.page = p, loadAssets())"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiRequest } from '../services/api'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const canStockIn = computed(() => authStore.can('assets.write'))

const loading = ref(false)
const assets = ref<any[]>([])
const total = ref(0)
/** 名下 ≥2 台「持机状态」资产的使用人（与后端 groupBy 一致，按库内原文字符串匹配） */
const multiHolderUserNames = ref<Set<string>>(new Set())
const campuses = ref<Array<{ id: number; name: string }>>([])
const departments = ref<Array<{ id: number; name: string; displayPath?: string }>>([])

const statusOptions = [
  { label: '在库', value: 'in_stock' },
  { label: '待领用', value: 'waiting_pickup' },
  { label: '使用中', value: 'in_use' },
  { label: '借用中', value: 'borrowed' },
  { label: '维修中', value: 'in_repair' },
  { label: '已报废', value: 'retired' },
]

const query = reactive({
  q: '',
  status: '',
  campusId: null as number | null,
  departmentId: null as number | null,
  page: 1,
  pageSize: 20,
})

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
  } finally {
    loading.value = false
  }
}

function search() {
  query.page = 1
  loadAssets()
}

function goDetail(id: number) {
  router.push('/assets/' + id)
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
  await loadFilters()
  await loadAssets()
})
</script>

<style scoped>
/* 保留列宽拖拽能力（需要 border），但去掉数据区网格线视觉 */
.assets-table :deep(.el-table__body td) {
  border-right-color: transparent;
  border-bottom-color: transparent;
}

.assets-table :deep(.el-table__body tr td:first-child) {
  border-left-color: transparent;
}
</style>

