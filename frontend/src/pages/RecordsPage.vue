<template>
  <div style="padding: 20px">
    <el-card shadow="never">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap">
        <div>
          <div style="font-weight: 800">出入库记录</div>
          <div style="color: #666; font-size: 13px; margin-top: 4px">当前展示最近 10 条记录（可在 phase8/后续扩展为分页查询）。</div>
        </div>
        <el-button type="primary" @click="load">刷新</el-button>
      </div>
    </el-card>

    <el-card shadow="never" style="margin-top: 16px" v-loading="loading">
      <el-table :data="records" style="width: 100%" size="small">
        <el-table-column label="操作类型">
          <template #default="{ row }">{{ actionLabel(row.action) }}</template>
        </el-table-column>
        <el-table-column prop="asset.assetCode" label="电脑编号" />
        <el-table-column prop="userName" label="用户" />
        <el-table-column label="部门">
          <template #default="{ row }">{{ row.department?.name ?? '-' }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="时间">
          <template #default="{ row }">{{ new Date(row.actionDate).toLocaleString() }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { apiRequest } from '../services/api'
import { actionLabel } from '../actionLabel'

const records = ref<any[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const data = await apiRequest<{ records: any[] }>('/api/dashboard/recent-records')
    records.value = data.records ?? []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

