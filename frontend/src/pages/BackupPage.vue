<template>
  <div style="padding: 20px">
    <el-card shadow="never">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap">
        <div>
          <div style="font-weight: 800; margin-bottom: 4px">数据备份</div>
          <div style="color:#666; font-size: 13px">将当前 SQLite 数据库文件复制到本地备份目录。</div>
        </div>
        <el-button type="primary" @click="createBackup">立即备份</el-button>
      </div>
    </el-card>

    <el-card shadow="never" style="margin-top: 16px" v-loading="loading">
      <el-table :data="backups" size="small" style="width: 100%">
        <el-table-column prop="name" label="文件名" />
        <el-table-column prop="size" label="大小(KB)" width="120">
          <template #default="{ row }">{{ Math.round((row.size ?? 0) / 1024) }}</template>
        </el-table-column>
        <el-table-column label="时间" width="200">
          <template #default="{ row }">{{ new Date(row.mtimeMs).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="download(row.name)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { apiRequest, getApiBaseURL } from '../services/api'
import { ElMessage } from 'element-plus'

const backups = ref<any[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const data = await apiRequest<{ items: any[] }>('/api/backup/list')
    backups.value = data.items ?? []
  } finally {
    loading.value = false
  }
}

async function createBackup() {
  try {
    await apiRequest('/api/backup', { method: 'POST' })
    ElMessage.success('备份已创建')
    await load()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '备份失败')
  }
}

async function download(name: string) {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${getApiBaseURL()}/api/backup/download/${encodeURIComponent(name)}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'download failed')
    }
    const blob = await res.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = name
    link.click()
    URL.revokeObjectURL(link.href)
  } catch (e: any) {
    ElMessage.error(e?.message ?? '下载失败')
  }
}

onMounted(load)
</script>

