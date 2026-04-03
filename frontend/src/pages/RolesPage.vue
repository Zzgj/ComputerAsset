<template>
  <div class="ca-page ca-animate">
    <el-card shadow="never">
      <div class="ca-page-header">
        <div>
          <div class="ca-page-title">角色与权限</div>
          <div class="ca-page-subtitle">
            配置权限点与园区范围；用户通过「用户管理」绑定角色。关闭「全部园区」时需勾选允许访问的园区。
          </div>
        </div>
        <el-button type="primary" @click="openCreate">新建角色</el-button>
      </div>
    </el-card>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="items" size="small" style="width: 100%">
        <el-table-column prop="name" label="名称" min-width="120" />
        <el-table-column prop="slug" label="标识" width="140" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.bypassAll" type="danger" size="small" effect="light">超管</el-tag>
            <el-tag v-else-if="row.isSystem" type="info" size="small" effect="light">内置</el-tag>
            <el-tag v-else type="success" size="small" effect="light">自定义</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="园区范围" width="110">
          <template #default="{ row }">{{ row.campusesAll ? '全部' : `指定(${row.campusScopeCount})` }}</template>
        </el-table-column>
        <el-table-column prop="permissionCount" label="权限数" width="80" />
        <el-table-column prop="userCount" label="用户数" width="80" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="primary" :disabled="row.slug === 'super_admin'" @click="openEdit(row)">
              编辑
            </el-button>
            <el-button size="small" text type="danger" :disabled="row.isSystem" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑角色' : '新建角色'" width="640px" destroy-on-close>
      <el-form label-width="100px">
        <el-form-item label="名称" required>
          <el-input v-model="form.name" placeholder="如：南浔园区运维" />
        </el-form-item>
        <el-form-item v-if="!editingId" label="标识 slug">
          <el-input v-model="form.slug" placeholder="可选，留空则从名称生成英文标识" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="全部园区">
          <el-switch v-model="form.campusesAll" />
          <span class="form-hint" style="margin-left: 8px">关闭后需选择可访问的园区</span>
        </el-form-item>
        <el-form-item v-if="!form.campusesAll" label="园区">
          <el-select v-model="form.campusIds" multiple filterable style="width: 100%" placeholder="选择园区">
            <el-option v-for="c in campuses" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限">
          <div class="perm-box">
            <el-checkbox-group v-model="form.permissionKeys">
              <div v-for="p in permMeta" :key="p.key" style="margin-bottom: 6px">
                <el-checkbox :label="p.key">{{ p.label }}</el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
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
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiRequest } from '../services/api'

type Row = {
  id: number
  name: string
  slug: string
  isSystem: boolean
  bypassAll: boolean
  campusesAll: boolean
  userCount: number
  permissionCount: number
  campusScopeCount: number
}

const loading = ref(false)
const saving = ref(false)
const items = ref<Row[]>([])
const campuses = ref<Array<{ id: number; name: string }>>([])
const permMeta = ref<Array<{ key: string; label: string }>>([])

const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const form = ref({
  name: '',
  slug: '',
  description: '',
  campusesAll: true,
  campusIds: [] as number[],
  permissionKeys: [] as string[],
})

async function loadMeta() {
  const [pm, cp] = await Promise.all([
    apiRequest<{ permissions: Array<{ key: string; label: string }> }>('/api/roles/meta'),
    apiRequest<{ items: Array<{ id: number; name: string }> }>('/api/campuses'),
  ])
  permMeta.value = pm.permissions ?? []
  campuses.value = cp.items ?? []
}

async function load() {
  loading.value = true
  try {
    const data = await apiRequest<{ items: Row[] }>('/api/roles')
    items.value = data.items ?? []
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = {
    name: '',
    slug: '',
    description: '',
    campusesAll: true,
    campusIds: [],
    permissionKeys: permMeta.value.map((p) => p.key),
  }
  dialogVisible.value = true
}

async function openEdit(row: Row) {
  editingId.value = row.id
  const detail = await apiRequest<{
    role: {
      name: string
      slug: string
      description: string | null
      campusesAll: boolean
      bypassAll: boolean
      permissionKeys: string[]
      campusIds: number[]
    }
  }>(`/api/roles/${row.id}`)
  const r = detail.role
  if (r.bypassAll) {
    ElMessage.warning('超级管理员角色无需配置权限')
    return
  }
  form.value = {
    name: r.name,
    slug: r.slug,
    description: r.description ?? '',
    campusesAll: r.campusesAll,
    campusIds: [...r.campusIds],
    permissionKeys: [...r.permissionKeys],
  }
  dialogVisible.value = true
}

async function save() {
  if (!form.value.name.trim()) {
    ElMessage.error('请填写名称')
    return
  }
  if (!form.value.campusesAll && !form.value.campusIds.length) {
    ElMessage.error('请至少选择一个园区，或开启「全部园区」')
    return
  }
  saving.value = true
  try {
    const body = {
      name: form.value.name.trim(),
      slug: form.value.slug.trim() || undefined,
      description: form.value.description.trim() || undefined,
      campusesAll: form.value.campusesAll,
      campusIds: form.value.campusesAll ? [] : form.value.campusIds,
      permissionKeys: form.value.permissionKeys,
    }
    if (editingId.value) {
      await apiRequest(`/api/roles/${editingId.value}`, { method: 'PUT', body })
    } else {
      await apiRequest('/api/roles', { method: 'POST', body })
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

async function remove(row: Row) {
  try {
    await ElMessageBox.confirm(`确认删除角色「${row.name}」？`, '删除角色', { type: 'warning' })
    await apiRequest(`/api/roles/${row.id}`, { method: 'DELETE' })
    ElMessage.success('已删除')
    await load()
  } catch (e: any) {
    const msg = e?.message ?? e?.error?.message
    if (msg) ElMessage.error(msg)
  }
}

onMounted(async () => {
  await loadMeta()
  await load()
})
</script>

<style scoped>
.form-hint {
  color: var(--ca-text-muted);
  font-size: 12px;
}

.perm-box {
  max-height: 260px;
  overflow: auto;
  border: 1px solid var(--ca-border-light);
  border-radius: var(--ca-radius-sm);
  padding: 12px;
}
</style>
