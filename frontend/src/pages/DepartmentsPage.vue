<template>
  <div style="padding: 20px">
    <el-card shadow="never">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap">
        <div>
          <div style="font-weight: 800">部门管理</div>
          <div style="color: #666; font-size: 13px; margin-top: 4px">支持新增/编辑/启用停用/删除。</div>
        </div>
        <el-button type="primary" @click="openAdd">新增部门</el-button>
      </div>
    </el-card>

    <el-card shadow="never" style="margin-top: 16px" v-loading="loading">
      <el-table :data="items" size="small" style="width: 100%">
        <el-table-column prop="name" label="部门名称" />
        <el-table-column prop="sortOrder" label="排序号" width="90" />
        <el-table-column prop="isActive" label="启用" width="90">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button size="small" text type="danger" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑部门' : '新增部门'" width="520px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="form.sortOrder" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.isActive" />
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

const loading = ref(false)
const items = ref<any[]>([])

const dialogVisible = ref(false)
const form = reactive<any>({
  id: null,
  name: '',
  sortOrder: 0,
  isActive: true,
})

async function load() {
  loading.value = true
  try {
    const data = await apiRequest<{ items: any[] }>('/api/departments')
    items.value = data.items ?? []
  } finally {
    loading.value = false
  }
}

function openAdd() {
  Object.assign(form, { id: null, name: '', sortOrder: items.value.length ? Math.max(...items.value.map((x) => x.sortOrder)) + 1 : 0, isActive: true })
  dialogVisible.value = true
}

function openEdit(row: any) {
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

async function save() {
  const payload = {
    name: form.name,
    sortOrder: form.sortOrder,
    isActive: form.isActive,
  }

  if (form.id) {
    await apiRequest(`/api/departments/${form.id}`, { method: 'PUT', body: payload })
  } else {
    await apiRequest('/api/departments', { method: 'POST', body: payload })
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  await load()
}

async function remove(row: any) {
  try {
    await ElMessageBox.confirm(`确认删除部门：${row.name}？`, '提示', { type: 'warning' })
    await apiRequest(`/api/departments/${row.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    await load()
  } catch {
    // ignore cancel
  }
}

onMounted(load)
</script>

