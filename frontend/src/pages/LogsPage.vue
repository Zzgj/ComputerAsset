<template>
  <div style="padding: 20px">
    <el-card shadow="never">
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
        <el-select v-model="query.category" placeholder="日志类型" style="width: 220px" @change="onCategoryChange">
          <el-option v-for="c in categoryOptions" :key="c.key" :label="c.label" :value="c.key" />
        </el-select>
        <el-input
          v-model="query.action"
          placeholder="在当前类型内按关键字筛选"
          style="width: 260px"
          clearable
        />
        <el-date-picker v-model="query.startDate" type="date" placeholder="开始日期" value-format="YYYY-MM-DD" />
        <el-date-picker v-model="query.endDate" type="date" placeholder="结束日期" value-format="YYYY-MM-DD" />
        <el-button type="primary" @click="load">搜索</el-button>
      </div>
    </el-card>

    <el-card shadow="never" style="margin-top: 16px" v-loading="loading">
      <el-table :data="items" size="small" style="width: 100%">
        <el-table-column prop="createdAt" label="时间">
          <template #default="{ row }">{{ new Date(row.createdAt).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="操作类型">
          <template #default="{ row }">{{ actionLabel(row.action) }}</template>
        </el-table-column>
        <el-table-column label="操作人">
          <template #default="{ row }">{{ row.operator?.realName ?? row.operator?.username }}</template>
        </el-table-column>
        <el-table-column prop="targetType" label="对象类型" width="120" />
        <el-table-column prop="targetId" label="对象ID" width="80" />
        <el-table-column prop="ipAddress" label="IP" width="140" />
        <el-table-column label="详情" min-width="320">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 8px; width: 100%; min-width: 0; flex-wrap: nowrap">
              <span
                style="
                  color: #606266;
                  flex: 1;
                  min-width: 0;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
              >{{ detailSummary(row.detail) }}</span>
              <el-button
                v-if="row.detail && typeof row.detail === 'object'"
                type="primary"
                text
                size="small"
                style="flex: none"
                @click="openDetail(row)"
              >
                查看详情
              </el-button>
            </div>
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
          @current-change="(p: number) => (query.page = p, load())"
        />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="操作详情" width="720px">
      <pre
        style="
          margin: 0;
          padding: 12px;
          max-height: 420px;
          overflow: auto;
          background: #f7f8fa;
          border: 1px solid #ebeef5;
          border-radius: 8px;
          line-height: 1.5;
          font-size: 12px;
          color: #2c3e50;
        "
      >{{ selectedDetailText }}</pre>
      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { apiRequest } from '../services/api'
import { actionLabel } from '../actionLabel'

const loading = ref(false)
const items = ref<any[]>([])
const total = ref(0)
const detailVisible = ref(false)
const selectedDetailText = ref('')

const categoryOptions = ref<Array<{ key: string; label: string }>>([{ key: 'all', label: '全部' }])

const query = reactive<any>({
  category: 'all',
  action: '',
  startDate: null,
  endDate: null,
  page: 1,
  pageSize: 20,
})

function onCategoryChange() {
  query.page = 1
  load()
}

async function load() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (query.category && query.category !== 'all') params.set('category', query.category)
    if (query.action) params.set('action', query.action)
    if (query.startDate) params.set('startDate', query.startDate)
    if (query.endDate) params.set('endDate', query.endDate)
    params.set('page', String(query.page))
    params.set('pageSize', String(query.pageSize))

    const data = await apiRequest<{ items: any[]; total: number; page: number; pageSize: number }>('/api/logs?' + params.toString())
    items.value = data.items ?? []
    total.value = data.total ?? 0
  } finally {
    loading.value = false
  }
}

function detailSummary(detail: unknown): string {
  if (!detail) return '-'
  if (typeof detail === 'string') return detail
  if (typeof detail !== 'object') return String(detail)

  const obj = detail as Record<string, unknown>
  const keys = Object.keys(obj)
  if (!keys.length) return '-'

  const first = keys.slice(0, 3).map((k) => `${k}: ${briefValue(obj[k])}`)
  const more = keys.length > 3 ? ` 等${keys.length}项` : ''
  return `${first.join(' | ')}${more}`
}

function briefValue(v: unknown): string {
  if (v === null || v === undefined || v === '') return '-'
  if (typeof v === 'object') return '[对象]'
  return String(v)
}

function openDetail(row: any) {
  const detail = row?.detail
  try {
    selectedDetailText.value = JSON.stringify(detail ?? {}, null, 2)
  } catch {
    selectedDetailText.value = String(detail ?? '')
  }
  detailVisible.value = true
}

async function loadMeta() {
  try {
    const data = await apiRequest<{ categories: Array<{ key: string; label: string }> }>('/api/logs/meta')
    if (data.categories?.length) categoryOptions.value = data.categories
  } catch {
    // 保持默认「全部」
  }
}

onMounted(async () => {
  await loadMeta()
  await load()
})
</script>

