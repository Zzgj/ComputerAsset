<template>
  <div style="padding: 20px">
    <el-card shadow="never">
      <div style="font-weight: 800; margin-bottom: 4px">归还登记</div>
      <div style="color: #666; font-size: 13px">可对使用中/借用中的电脑执行归还。</div>
    </el-card>

    <el-card shadow="never" style="margin-top: 16px" v-loading="loading">
      <el-table :data="assets" size="small" style="width: 100%">
        <el-table-column prop="assetCode" label="电脑编号" />
        <el-table-column prop="currentUserName" label="使用人" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'borrowed' ? 'warning' : 'info'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="部门">
          <template #default="{ row }">{{ row.department?.name ?? '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="openReturn(row)">归还</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="确认归还" width="520px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="电脑编号">
          <div>{{ selected?.assetCode }}</div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit" :loading="submitting">提交归还</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { apiRequest } from '../services/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const assets = ref<any[]>([])

const dialogVisible = ref(false)
const selected = ref<any | null>(null)
const form = ref<any>({ remark: '' })
const submitting = ref(false)

async function load() {
  loading.value = true
  try {
    const [inUse, borrowed] = await Promise.all([
      apiRequest<{ items: any[] }>('/api/assets?status=in_use&page=1&pageSize=50'),
      apiRequest<{ items: any[] }>('/api/assets?status=borrowed&page=1&pageSize=50'),
    ])
    assets.value = [...(inUse.items ?? []), ...(borrowed.items ?? [])]
  } finally {
    loading.value = false
  }
}

function openReturn(row: any) {
  selected.value = row
  form.value.remark = ''
  dialogVisible.value = true
}

async function submit() {
  if (!selected.value) return
  submitting.value = true
  try {
    const requestId = (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now())
    await apiRequest('/api/operations/return', {
      method: 'POST',
      body: {
        requestId,
        assetId: selected.value.id,
        remark: form.value.remark || undefined,
      },
    })
    ElMessage.success('归还成功')
    dialogVisible.value = false
    await load()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '归还失败')
  } finally {
    submitting.value = false
  }
}

onMounted(load)
</script>

