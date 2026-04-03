<template>
  <div class="ca-page ca-animate">
    <el-card shadow="never">
      <div class="ca-page-header">
        <div>
          <div class="ca-page-title">数据备份</div>
          <div class="ca-page-subtitle">将当前 SQLite 数据库文件复制到本地备份目录，可随时下载</div>
        </div>
        <el-button type="primary" @click="createBackup">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          立即备份
        </el-button>
      </div>
    </el-card>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="backups" size="small" style="width: 100%">
        <el-table-column prop="name" label="文件名" min-width="240" />
        <el-table-column prop="size" label="大小" width="120">
          <template #default="{ row }">{{ Math.round((row.size ?? 0) / 1024) }} KB</template>
        </el-table-column>
        <el-table-column label="备份时间" width="200">
          <template #default="{ row }">{{ new Date(row.mtimeMs).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
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
