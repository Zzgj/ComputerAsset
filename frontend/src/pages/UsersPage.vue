<template>
  <div style="padding: 20px">
    <el-card shadow="never">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap">
        <div>
          <div style="font-weight: 800">用户管理</div>
          <div style="color: #666; font-size: 13px; margin-top: 4px">绑定访问角色以继承权限与园区范围。</div>
        </div>
        <el-button type="primary" @click="openAdd">新增用户</el-button>
      </div>
    </el-card>

    <el-card shadow="never" style="margin-top: 16px" v-loading="loading">
      <el-table :data="users" size="small" style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="realName" label="姓名" />
        <el-table-column label="角色" min-width="140">
          <template #default="{ row }">{{ row.accessRole?.name ?? '-' }}</template>
        </el-table-column>
        <el-table-column label="启用/需改密" width="160">
          <template #default="{ row }">
            <div style="display: grid; gap: 4px">
              <el-tag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '停用' }}</el-tag>
              <el-tag :type="row.mustChangePass ? 'warning' : 'success'">{{ row.mustChangePass ? '需改密' : '正常' }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button size="small" text type="warning" @click="resetPassword(row)">重置密码</el-button>
            <el-button
              size="small"
              text
              type="danger"
              @click="deleteUser(row)"
              :disabled="row.accessRole?.bypassAll"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑用户' : '新增用户'" width="520px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="用户名" v-if="!form.id">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="初始密码" v-if="!form.id">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.realName" />
        </el-form-item>
        <el-form-item label="访问角色">
          <el-select v-model="form.accessRoleId" style="width: 100%" filterable placeholder="选择角色">
            <el-option v-for="r in roleList" :key="r.id" :label="r.name" :value="r.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.isActive" />
        </el-form-item>
        <el-form-item label="需改密" v-if="!form.id">
          <el-switch v-model="form.mustChangePass" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { apiRequest } from '../services/api'

const loading = ref(false)
const saving = ref(false)
const users = ref<any[]>([])
const roleList = ref<Array<{ id: number; name: string; slug: string }>>([])

const dialogVisible = ref(false)
const form = reactive<any>({
  id: null,
  username: '',
  password: '',
  realName: '',
  accessRoleId: null as number | null,
  isActive: true,
  mustChangePass: true,
})

async function loadRoles() {
  const data = await apiRequest<{ items: Array<{ id: number; name: string; slug: string }> }>('/api/roles')
  roleList.value = data.items ?? []
}

async function load() {
  loading.value = true
  try {
    const data = await apiRequest<{ items: any[] }>('/api/users')
    users.value = data.items ?? []
  } finally {
    loading.value = false
  }
}

function openAdd() {
  const first = roleList.value.find((r) => r.slug === 'viewer') ?? roleList.value[0]
  Object.assign(form, {
    id: null,
    username: '',
    password: '',
    realName: '',
    accessRoleId: first?.id ?? null,
    isActive: true,
    mustChangePass: true,
  })
  dialogVisible.value = true
}

function openEdit(row: any) {
  Object.assign(form, {
    id: row.id,
    username: row.username,
    password: '',
    realName: row.realName,
    accessRoleId: row.accessRoleId,
    isActive: row.isActive,
    mustChangePass: row.mustChangePass,
  })
  dialogVisible.value = true
}

async function save() {
  if (!form.accessRoleId) {
    ElMessage.error('请选择访问角色')
    return
  }
  saving.value = true
  try {
    const payload: any = {
      realName: form.realName,
      accessRoleId: form.accessRoleId,
      isActive: form.isActive,
    }

    if (!form.id) {
      payload.username = form.username
      payload.password = form.password
      payload.mustChangePass = form.mustChangePass
      await apiRequest('/api/users', { method: 'POST', body: payload })
    } else {
      await apiRequest(`/api/users/${form.id}`, { method: 'PUT', body: payload })
    }

    ElMessage.success('保存成功')
    dialogVisible.value = false
    await load()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '保存失败')
  } finally {
    saving.value = false
  }
}

async function resetPassword(row: any) {
  try {
    await ElMessageBox.confirm(`确认将 ${row.username} 重置为 123456？`, '提示', { type: 'warning' })
    await apiRequest(`/api/users/${row.id}/reset-password`, { method: 'POST' })
    ElMessage.success('重置成功')
    await load()
  } catch {
    // ignore
  }
}

async function deleteUser(row: any) {
  try {
    await ElMessageBox.confirm(`确认删除用户：${row.username}？`, '删除用户', {
      type: 'warning',
      distinguishCancelAndClose: true,
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
    })
    await apiRequest(`/api/users/${row.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    await load()
  } catch (e: any) {
    const msg = e?.message ?? e?.error?.message
    if (msg) ElMessage.error(msg)
  }
}

onMounted(async () => {
  await loadRoles()
  await load()
})
</script>
