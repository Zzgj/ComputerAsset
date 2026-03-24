<template>
  <div style="padding: 20px">
    <el-card shadow="never">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap">
        <div>
          <div style="font-weight: 800">设备型号管理</div>
          <div style="color: #666; font-size: 13px; margin-top: 4px">支持新增/编辑/停用/删除。</div>
        </div>
        <el-button type="primary" @click="openAdd">新增模板</el-button>
      </div>
    </el-card>

    <el-card shadow="never" style="margin-top: 16px" v-loading="loading">
      <el-table :data="templates" style="width: 100%" size="small">
        <el-table-column prop="name" label="模板名称" />
        <el-table-column prop="deviceType" label="设备类型" />
        <el-table-column prop="brand" label="品牌" />
        <el-table-column prop="model" label="型号" />
        <el-table-column prop="cpu" label="CPU" />
        <el-table-column prop="memory" label="内存" />
        <el-table-column prop="storage" label="存储" />
        <el-table-column prop="assetCount" label="关联资产数" width="110" />
        <el-table-column prop="isActive" label="启用" width="90">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button size="small" text type="danger" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑模板' : '新增模板'" width="720px">
      <el-form :model="form" label-width="90px" :label-position="'left'">
        <el-form-item label="模板名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="form.deviceType" style="width: 100%">
            <el-option v-for="o in deviceTypeOptions" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="form.brand" />
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="form.model" />
        </el-form-item>
        <el-form-item label="操作系统">
          <el-input v-model="form.os" />
        </el-form-item>
        <el-form-item label="CPU">
          <el-input v-model="form.cpu" />
        </el-form-item>
        <el-form-item label="内存">
          <el-input v-model="form.memory" />
        </el-form-item>
        <el-form-item label="存储">
          <el-input v-model="form.storage" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="form.sortOrder" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.isActive" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark" :rows="3" />
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
import { onMounted, reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { apiRequest } from '../services/api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const templates = ref<any[]>([])
const loading = ref(false)

const deviceTypeOptions = [
  { label: '笔记本', value: 'laptop' },
  { label: '台式机', value: 'desktop' },
  { label: '一体机', value: 'aio' },
  { label: '服务器', value: 'server' },
]

const dialogVisible = ref(false)
const form = reactive<any>({
  id: null,
  name: '',
  deviceType: 'laptop',
  brand: '',
  model: '',
  os: '',
  cpu: '',
  memory: '',
  storage: '',
  remark: '',
  isActive: true,
  sortOrder: 0,
})

async function load() {
  loading.value = true
  try {
    const data = await apiRequest<{ items: any[] }>('/api/templates/all')
    templates.value = data.items ?? []
  } finally {
    loading.value = false
  }
}

function openAdd() {
  Object.assign(form, {
    id: null,
    name: '',
    deviceType: 'laptop',
    brand: '',
    model: '',
    os: '',
    cpu: '',
    memory: '',
    storage: '',
    remark: '',
    isActive: true,
    sortOrder: 0,
  })
  dialogVisible.value = true
}

function openEdit(row: any) {
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

async function save() {
  const payload = {
    name: form.name,
    deviceType: form.deviceType,
    brand: form.brand,
    model: form.model,
    os: form.os,
    cpu: form.cpu,
    memory: form.memory,
    storage: form.storage,
    remark: form.remark || undefined,
    isActive: form.isActive,
    sortOrder: form.sortOrder,
  }

  if (form.id) {
    await apiRequest(`/api/templates/${form.id}`, { method: 'PUT', body: payload })
  } else {
    await apiRequest('/api/templates', { method: 'POST', body: payload })
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  await load()
}

async function remove(row: any) {
  try {
    await ElMessageBox.confirm(`确认删除模板：${row.name}？`, '提示', { type: 'warning' })
    await apiRequest(`/api/templates/${row.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    await load()
  } catch (e: any) {
    // 取消/关闭不提示；真正的失败（比如模板被资产使用）要把后端 message 显示给用户
    const msg = e?.message ?? e?.error?.message
    if (!msg) return
    ElMessage.error(msg)
  }
}

onMounted(load)
</script>

