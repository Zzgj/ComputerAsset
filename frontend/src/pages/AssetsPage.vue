<template>
  <div style="padding: 20px">
    <el-card shadow="never">
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
        <el-input v-model="query.q" placeholder="搜索：编号/品牌/型号/序列号/使用人" style="width: 320px" />
        <el-select v-model="query.status" placeholder="状态" style="width: 160px" clearable>
          <el-option v-for="s in statusOptions" :key="s.value" :label="s.label" :value="s.value" />
        </el-select>
        <el-select v-model="query.departmentId" placeholder="部门" style="width: 180px" clearable>
          <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
        </el-select>
        <el-button type="primary" @click="loadAssets">搜索</el-button>
        <el-button v-if="canAdmin" @click="router.push('/stock-in')">新增入库</el-button>
      </div>
    </el-card>

    <el-card shadow="never" style="margin-top: 16px">
      <el-table :data="assets" v-loading="loading" style="width: 100%">
        <el-table-column prop="assetCode" label="电脑编号" />
        <el-table-column label="品牌">
          <template #default="{ row }">
            {{ formatText(row.brand) }}
          </template>
        </el-table-column>
        <el-table-column label="型号">
          <template #default="{ row }">
            {{ formatText(row.model) }}
          </template>
        </el-table-column>
        <el-table-column label="序列号">
          <template #default="{ row }">
            {{ formatSerial(row.serialNumber) }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <span>{{ statusOptions.find((s) => s.value === row.status)?.label ?? row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用人">
          <template #default="{ row }">
            {{ formatText(row.currentUserName) }}
          </template>
        </el-table-column>
        <el-table-column label="部门">
          <template #default="{ row }">{{ formatText(row.department?.name) }}</template>
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
import type { UserRole } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const canAdmin = computed(() => authStore.me?.role === 'admin' || authStore.me?.role === 'super_admin')

const loading = ref(false)
const assets = ref<any[]>([])
const total = ref(0)
const departments = ref<Array<{ id: number; name: string }>>([])

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
  departmentId: null as number | null,
  page: 1,
  pageSize: 20,
})

async function loadDepartments() {
  const data = await apiRequest<{ items: any[] }>('/api/departments')
  departments.value = data.items
}

async function loadAssets() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (query.q) params.set('q', query.q)
    if (query.status) params.set('status', query.status)
    if (query.departmentId) params.set('departmentId', String(query.departmentId))
    params.set('page', String(query.page))
    params.set('pageSize', String(query.pageSize))

    const data = await apiRequest<{ items: any[]; total: number; page: number; pageSize: number }>('/api/assets?' + params.toString())
    assets.value = data.items
    total.value = data.total
  } finally {
    loading.value = false
  }
}

function goDetail(id: number) {
  router.push('/assets/' + id)
}

function formatText(v: unknown) {
  const s = String(v ?? '').trim()
  if (!s) return '暂无'
  return s
}

function formatSerial(serialNumber: string) {
  const s = String(serialNumber ?? '').trim()
  if (!s) return '暂无'
  if (s === '暂无' || s.startsWith('暂无-')) return '暂无'
  return s
}

onMounted(async () => {
  await loadDepartments()
  await loadAssets()
})
</script>

