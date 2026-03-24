<template>
  <div style="padding: 20px">
    <el-card shadow="never">
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
        <el-input v-model="query.action" placeholder="按操作类型关键字搜索" style="width: 260px" clearable />
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
        <el-table-column label="详情">
          <template #default="{ row }">{{ row.detail ? JSON.stringify(row.detail) : '-' }}</template>
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { apiRequest } from '../services/api'
import { actionLabel } from '../actionLabel'

const loading = ref(false)
const items = ref<any[]>([])
const total = ref(0)

const query = reactive<any>({
  action: '',
  startDate: null,
  endDate: null,
  page: 1,
  pageSize: 20,
})

async function load() {
  loading.value = true
  try {
    const params = new URLSearchParams()
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

onMounted(load)
</script>

