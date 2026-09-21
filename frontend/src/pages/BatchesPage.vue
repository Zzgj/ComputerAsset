<template>
  <div class="ca-page ca-animate">
    <el-card shadow="never">
      <div class="ca-page-header">
        <div>
          <div class="ca-page-title">批次管理</div>
          <div class="ca-page-subtitle">维护采购批次档案，查看批次关联资产明细</div>
        </div>
        <el-button v-if="canManage" type="primary" @click="openAdd">新建批次</el-button>
      </div>
    </el-card>

    <el-card shadow="never">
      <div class="filter-row">
        <el-input
          v-model="filter.keyword"
          placeholder="搜索批次号或名称"
          clearable
          class="filter-input"
          @keyup.enter="reload"
          @clear="reload"
        />
        <el-button type="primary" @click="reload">搜索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="filteredRows" size="small" style="width: 100%">
        <el-table-column label="批次号" min-width="150">
          <template #default="{ row }">
            <a class="row-link" @click="openDetail(row)">{{ row.batchNo || '—' }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="150">
          <template #default="{ row }">{{ row.name || '—' }}</template>
        </el-table-column>
        <el-table-column label="采购日期" width="130">
          <template #default="{ row }">{{ formatDate(row.purchaseDate) }}</template>
        </el-table-column>
        <el-table-column label="关联资产数" width="120" align="center">
          <template #default="{ row }">
            <el-tag type="info" effect="light">{{ row.assetCount ?? 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">{{ row.remark || '—' }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="op-row">
              <el-button size="small" text type="primary" @click="openDetail(row)">详情</el-button>
              <el-button v-if="canManage" size="small" text type="primary" @click="openEdit(row)">编辑</el-button>
              <el-button v-if="canManage" size="small" text type="danger" @click="remove(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新建 / 编辑 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑批次' : '新建批次'" width="520px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="批次号">
          <div class="batch-no-row">
            <el-input v-model="form.batchNo" maxlength="64" placeholder="可留空自动生成" />
            <el-button :loading="generating" @click="generateNo">自动生成</el-button>
          </div>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" maxlength="128" placeholder="可选" />
        </el-form-item>
        <el-form-item label="采购日期">
          <el-date-picker
            v-model="form.purchaseDate"
            type="date"
            value-format="YYYY-MM-DD"
            class="form-full"
            placeholder="可选"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>

    <!-- 批次资产明细弹窗 -->
    <el-dialog v-model="detailVisible" :title="`批次资产明细 — ${currentBatch?.batchNo ?? ''}`" width="860px">
      <div v-if="currentBatch" class="detail-meta">
        <span><b>名称：</b>{{ currentBatch.name || '—' }}</span>
        <span><b>采购日期：</b>{{ formatDate(currentBatch.purchaseDate) }}</span>
        <span><b>备注：</b>{{ currentBatch.remark || '—' }}</span>
      </div>
      <el-table v-loading="detailLoading" :data="currentAssets" size="small" style="width: 100%" max-height="480">
        <el-table-column label="资产编号" min-width="150">
          <template #default="{ row }">{{ row.assetCode || '—' }}</template>
        </el-table-column>
        <el-table-column label="品牌/型号" min-width="180">
          <template #default="{ row }">{{ [row.brand, row.model].filter(Boolean).join(' / ') || '—' }}</template>
        </el-table-column>
        <el-table-column label="序列号" min-width="150">
          <template #default="{ row }">{{ row.serialNumber || '—' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" effect="light">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="部门" min-width="160">
          <template #default="{ row }">
            {{ row.department?.name ?? '—' }}
            <span v-if="row.department?.campus?.name" class="campus-suffix">（{{ row.department.campus.name }}）</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!detailLoading && currentAssets.length === 0" class="empty-tip">该批次暂无关联资产</div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiRequest } from '../services/api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const canManage = computed(() => auth.can('batches.manage'))

const loading = ref(false)
const saving = ref(false)
const generating = ref(false)
const rows = ref<any[]>([])

const filter = reactive({ keyword: '' })

const filteredRows = computed(() => {
  const kw = filter.keyword.trim().toLowerCase()
  if (!kw) return rows.value
  return rows.value.filter(
    (r) =>
      String(r.batchNo ?? '').toLowerCase().includes(kw) ||
      String(r.name ?? '').toLowerCase().includes(kw),
  )
})

const dialogVisible = ref(false)
const form = reactive<any>({
  id: null,
  batchNo: '',
  name: '',
  purchaseDate: '',
  remark: '',
})

const detailVisible = ref(false)
const detailLoading = ref(false)
const currentBatch = ref<any>(null)
const currentAssets = ref<any[]>([])

const STATUS_LABELS: Record<string, string> = {
  in_stock: '在库',
  waiting_pickup: '待领用',
  pending_confirmation: '待签字确认',
  in_use: '使用中',
  borrowed: '借用中',
  in_repair: '维修中',
  retired: '已报废',
}

function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status ?? '—'
}

function statusTagType(status: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  switch (status) {
    case 'in_stock':
      return 'success'
    case 'in_use':
      return ''
    case 'borrowed':
      return 'warning'
    case 'in_repair':
      return 'warning'
    case 'retired':
      return 'danger'
    case 'waiting_pickup':
      return 'info'
    case 'pending_confirmation':
      return 'info'
    default:
      return 'info'
  }
}

function formatDate(v: string | null | undefined): string {
  if (!v) return '—'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return '—'
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDateTime(v: string | null | undefined): string {
  if (!v) return '—'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return '—'
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}`
}

function resetFilter() {
  filter.keyword = ''
  reload()
}

async function reload() {
  loading.value = true
  try {
    const data = await apiRequest<{ items: any[] }>('/api/batches')
    rows.value = data.items ?? []
  } catch (e: any) {
    ElMessage.error(e?.message ?? '加载批次失败')
  } finally {
    loading.value = false
  }
}

async function generateNo() {
  generating.value = true
  try {
    const data = await apiRequest<{ batchNo: string }>('/api/batches/generate-no')
    form.batchNo = data.batchNo
  } catch (e: any) {
    ElMessage.error(e?.message ?? '生成批次号失败')
  } finally {
    generating.value = false
  }
}

function openAdd() {
  Object.assign(form, {
    id: null,
    batchNo: '',
    name: '',
    purchaseDate: '',
    remark: '',
  })
  dialogVisible.value = true
}

function openEdit(row: any) {
  Object.assign(form, {
    id: row.id,
    batchNo: row.batchNo ?? '',
    name: row.name ?? '',
    purchaseDate: row.purchaseDate ? String(row.purchaseDate).slice(0, 10) : '',
    remark: row.remark ?? '',
  })
  dialogVisible.value = true
}

async function save() {
  const payload: any = {
    batchNo: form.batchNo?.trim() || undefined,
    name: form.name?.trim() || undefined,
    purchaseDate: form.purchaseDate || undefined,
    remark: form.remark?.trim() || undefined,
  }

  saving.value = true
  try {
    if (form.id) {
      await apiRequest(`/api/batches/${form.id}`, { method: 'PATCH', body: payload })
    } else {
      await apiRequest('/api/batches', { method: 'POST', body: payload })
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    await reload()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '保存失败')
  } finally {
    saving.value = false
  }
}

async function remove(row: any) {
  try {
    await ElMessageBox.confirm(`确认删除批次「${row.batchNo ?? row.name ?? row.id}」？`, '删除批次', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  try {
    await apiRequest(`/api/batches/${row.id}`, { method: 'DELETE' })
    ElMessage.success('已删除')
    await reload()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '删除失败')
  }
}

async function openDetail(row: any) {
  detailVisible.value = true
  detailLoading.value = true
  currentBatch.value = null
  currentAssets.value = []
  try {
    const data = await apiRequest<{ batch: any }>(`/api/batches/${row.id}`)
    currentBatch.value = data.batch
    currentAssets.value = data.batch?.assets ?? []
  } catch (e: any) {
    ElMessage.error(e?.message ?? '加载批次详情失败')
  } finally {
    detailLoading.value = false
  }
}

onMounted(() => {
  reload()
})
</script>

<style scoped>
.ca-page {
  padding: 24px;
  display: grid;
  gap: 20px;
}

.ca-page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.ca-page-title {
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 6px;
  color: var(--ca-text-primary);
}

.ca-page-subtitle {
  color: var(--ca-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.filter-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.filter-input {
  width: 240px;
}
.op-row {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
.row-link {
  color: var(--el-color-primary);
  cursor: pointer;
  text-decoration: none;
}
.row-link:hover {
  text-decoration: underline;
}
.form-full {
  width: 100%;
}
.batch-no-row {
  display: flex;
  gap: 8px;
  width: 100%;
}
.batch-no-row .el-input {
  flex: 1;
}
.detail-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--ca-text-secondary, var(--el-text-color-secondary));
}
.campus-suffix {
  color: var(--ca-text-muted, var(--el-text-color-placeholder));
  font-size: 12px;
}
.empty-tip {
  text-align: center;
  color: var(--ca-text-muted, var(--el-text-color-placeholder));
  padding: 24px 0;
  font-size: 13px;
}
</style>
