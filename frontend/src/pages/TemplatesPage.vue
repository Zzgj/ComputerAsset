<template>
  <div class="ca-page ca-animate">
    <el-card shadow="never">
      <div class="ca-page-header">
        <div>
          <div class="ca-page-title">设备型号管理</div>
          <div class="ca-page-subtitle">管理设备模板，支持新增、编辑、停用和删除操作</div>
        </div>
        <el-button type="primary" @click="openAdd">新增模板</el-button>
      </div>
      <div class="filter-bar">
        <el-input
          v-model="searchQ"
          placeholder="搜索：模板名称、品牌、型号、系统、CPU、内存、存储、备注或设备类型"
          style="width: min(100%, 420px)"
          clearable
          @keyup.enter="load"
        />
        <el-button type="primary" @click="load">搜索</el-button>
      </div>
    </el-card>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="templates" style="width: 100%" size="small">
        <el-table-column prop="name" label="模板名称" min-width="140" />
        <el-table-column label="设备类型" width="100">
          <template #default="{ row }">{{ deviceTypeLabel(row.deviceType) }}</template>
        </el-table-column>
        <el-table-column prop="brand" label="品牌" min-width="100" />
        <el-table-column prop="model" label="型号" min-width="120" />
        <el-table-column prop="cpu" label="CPU" min-width="100" />
        <el-table-column prop="memory" label="内存" width="90" />
        <el-table-column prop="storage" label="存储" width="90" />
        <el-table-column prop="assetCount" label="关联资产数" width="110" />
        <el-table-column prop="isActive" label="启用" width="80">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'" effect="light">{{ row.isActive ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
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
          <div style="display: flex; gap: 8px; width: 100%">
            <el-select v-model="form.deviceType" style="flex: 1" filterable>
              <el-option v-for="o in allDeviceTypeOptions" :key="o.value" :label="o.label" :value="o.value" />
            </el-select>
            <el-button @click="showAddDeviceType = true">新增类型</el-button>
          </div>
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
          <div class="form-hint">支持多个可选值（如：8GB / 16GB / 32GB），可用「/、,，」分隔</div>
        </el-form-item>
        <el-form-item label="存储">
          <el-input v-model="form.storage" />
          <div class="form-hint">支持多个可选值（如：256GB / 512GB / 1TB），可用「/、,，」分隔</div>
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
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showAddDeviceType" title="新增设备类型" width="400px">
      <el-form>
        <el-form-item label="类型名称">
          <el-input v-model="newDeviceTypeName" placeholder="例如：平板电脑" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDeviceType = false">取消</el-button>
        <el-button type="primary" @click="confirmAddDeviceType">确认新增</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { apiRequest } from '../services/api'
import { DEVICE_TYPE_OPTIONS, deviceTypeLabel } from '../constants/deviceType'

const templates = ref<any[]>([])
const loading = ref(false)
const saving = ref(false)
const searchQ = ref('')

const customDeviceTypes = ref<string[]>([])
const showAddDeviceType = ref(false)
const newDeviceTypeName = ref('')

const allDeviceTypeOptions = computed(() => {
  const base = [...DEVICE_TYPE_OPTIONS]
  for (const t of customDeviceTypes.value) {
    if (!base.some((o) => o.value === t)) {
      base.push({ label: t, value: t })
    }
  }
  return base
})

function confirmAddDeviceType() {
  const name = newDeviceTypeName.value.trim()
  if (!name) return ElMessage.warning('请输入类型名称')
  if (allDeviceTypeOptions.value.some((o) => o.value === name || o.label === name)) {
    return ElMessage.warning('该类型已存在')
  }
  customDeviceTypes.value.push(name)
  form.deviceType = name
  showAddDeviceType.value = false
  newDeviceTypeName.value = ''
  ElMessage.success(`已新增设备类型「${name}」`)
}

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
})

async function load() {
  loading.value = true
  try {
    const q = searchQ.value.trim()
    const qs = q ? `?q=${encodeURIComponent(q)}` : ''
    const data = await apiRequest<{ items: any[] }>(`/api/templates/all${qs}`)
    templates.value = data.items ?? []
    const knownValues = new Set(DEVICE_TYPE_OPTIONS.map((o) => o.value))
    const extras = [...new Set((data.items ?? []).map((t: any) => t.deviceType).filter((v: string) => v && !knownValues.has(v)))]
    customDeviceTypes.value = extras
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
  })
  dialogVisible.value = true
}

function openEdit(row: any) {
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

async function save() {
  const payload = {
    name: String(form.name ?? '').trim(),
    deviceType: form.deviceType,
    brand: form.brand,
    model: form.model,
    os: form.os,
    cpu: form.cpu,
    memory: form.memory,
    storage: form.storage,
    remark: form.remark || undefined,
    isActive: form.isActive,
    sortOrder: form.sortOrder ?? 0,
  }

  if (!payload.name) {
    ElMessage.error('请填写模板名称')
    return
  }

  saving.value = true
  try {
    if (form.id) {
      await apiRequest(`/api/templates/${form.id}`, { method: 'PUT', body: payload })
    } else {
      await apiRequest('/api/templates', { method: 'POST', body: payload })
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

async function remove(row: any) {
  try {
    await ElMessageBox.confirm(`确认删除模板：${row.name}？`, '提示', { type: 'warning' })
    await apiRequest(`/api/templates/${row.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    await load()
  } catch (e: any) {
    const msg = e?.message ?? e?.error?.message
    if (!msg) return
    ElMessage.error(msg)
  }
}

onMounted(load)
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 16px;
}

.form-hint {
  color: var(--ca-text-muted);
  font-size: 12px;
  margin-top: 4px;
}
</style>
