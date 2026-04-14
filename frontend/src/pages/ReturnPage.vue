<template>
  <div class="page-wrap">
    <el-card shadow="never" class="intro-card">
      <div class="intro-row">
        <div>
          <div class="page-title">归还登记</div>
          <div class="page-subtitle">将「使用中」或「借用中」的电脑收回至在库。归还后使用人将清空，部门将回到未分配或按业务规则处理。</div>
        </div>
        <div class="stat-chips" v-if="!loading || assets.length">
          <div class="chip chip-use">
            <span class="chip-label">使用中</span>
            <span class="chip-num">{{ inUseCount }}</span>
          </div>
          <div class="chip chip-borrow">
            <span class="chip-label">借用中</span>
            <span class="chip-num">{{ borrowedCount }}</span>
          </div>
          <div class="chip chip-total">
            <span class="chip-label">待归还合计</span>
            <span class="chip-num">{{ assets.length }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="table-card" v-loading="loading">
      <template #header>
        <div class="table-head">
          <span class="section-title">可归还列表</span>
          <span class="table-hint">支持按编号、使用人筛选；点击「办理归还」填写备注并确认</span>
        </div>
      </template>

      <div class="search-bar">
        <el-input v-model="searchAssetCode" clearable class="search-field" placeholder="电脑编号（模糊）" @keyup.enter="load" />
        <el-input v-model="searchUserName" clearable class="search-field" placeholder="使用人姓名（模糊）" @keyup.enter="load" />
        <el-button type="primary" @click="page = 1; load()">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <el-empty
        v-if="!loading && assets.length === 0"
        :description="hasActiveSearch ? '没有符合筛选条件的设备' : '当前没有使用中或借用中的设备'"
        :image-size="100"
      />

      <el-table v-else :data="assets" stripe border class="return-table" :empty-text="'暂无数据'">
        <el-table-column prop="assetCode" label="电脑编号" min-width="120" />
        <el-table-column prop="currentUserName" label="使用人" min-width="100" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === 'borrowed' ? 'warning' : 'success'" effect="light">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="园区" min-width="96">
          <template #default="{ row }">{{ row.department?.campus?.name ?? '—' }}</template>
        </el-table-column>
        <el-table-column label="部门" min-width="160">
          <template #default="{ row }">{{
            row.department?.deptPathOnly ?? row.department?.name ?? '—'
          }}</template>
        </el-table-column>
        <el-table-column label="品牌/型号" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">{{ [row.brand, row.model].filter(Boolean).join(' / ') || '—' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" @click="openReturn(row)">办理归还</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 16px; display: flex; justify-content: flex-end">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="page"
          :page-sizes="[20, 50, 100]"
          @size-change="onSizeChange"
          @current-change="onPageChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="确认归还"
      width="520px"
      class="return-dialog"
      align-center
      destroy-on-close
    >
      <el-descriptions v-if="selected" :column="1" border size="small" class="return-desc">
        <el-descriptions-item label="电脑编号">
          <span class="emph">{{ selected.assetCode }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="使用人">{{ selected.currentUserName || '—' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="selected.status === 'borrowed' ? 'warning' : 'success'" size="small">
            {{ statusLabel(selected.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="园区">{{ selected.department?.campus?.name ?? '—' }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{
          selected.department?.deptPathOnly ?? selected.department?.name ?? '—'
        }}</el-descriptions-item>
        <el-descriptions-item v-if="selected.department?.displayPath" label="全路径" :span="1">
          {{ selected.department.displayPath }}
        </el-descriptions-item>
      </el-descriptions>

      <el-form :model="form" label-width="72px" class="dialog-form">
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark" :rows="4" placeholder="可选：归还说明、设备状况等" />
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
import { computed, onMounted, ref } from 'vue'
import { apiRequest } from '../services/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const assets = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const searchAssetCode = ref('')
const searchUserName = ref('')

const hasActiveSearch = computed(
  () => searchAssetCode.value.trim().length > 0 || searchUserName.value.trim().length > 0,
)

const inUseCount = computed(() => assets.value.filter((a) => a.status === 'in_use').length)
const borrowedCount = computed(() => assets.value.filter((a) => a.status === 'borrowed').length)

const dialogVisible = ref(false)
const selected = ref<any | null>(null)
const form = ref<any>({ remark: '' })
const submitting = ref(false)

function statusLabel(status: unknown): string {
  const key = String(status ?? '')
  const map: Record<string, string> = {
    in_stock: '在库',
    waiting_pickup: '待领用',
    pending_confirmation: '待签字确认',
    in_use: '使用中',
    borrowed: '借用中',
    in_repair: '维修中',
    retired: '已报废',
  }
  return map[key] ?? key
}

async function load() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('statusIn', 'in_use,borrowed')
    params.set('page', String(page.value))
    params.set('pageSize', String(pageSize.value))
    const ac = searchAssetCode.value.trim()
    const un = searchUserName.value.trim()
    if (ac) params.set('assetCode', ac)
    if (un) params.set('userName', un)
    const data = await apiRequest<{ items: any[]; total: number }>('/api/assets?' + params.toString())
    assets.value = data.items ?? []
    total.value = data.total ?? 0
  } finally {
    loading.value = false
  }
}

function onPageChange(p: number) {
  page.value = p
  load()
}

function onSizeChange(s: number) {
  pageSize.value = s
  page.value = 1
  load()
}

function resetSearch() {
  searchAssetCode.value = ''
  searchUserName.value = ''
  page.value = 1
  load()
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

<style scoped>
.page-wrap {
  padding: 24px;
  display: grid;
  gap: 20px;
  animation: ca-fade-in 0.4s ease-out;
}

.intro-card {
  border-radius: var(--ca-radius);
}

.intro-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 6px;
  letter-spacing: -0.01em;
  color: var(--ca-text-primary);
}

.page-subtitle {
  color: var(--ca-text-secondary);
  font-size: 13px;
  line-height: 1.6;
  max-width: 640px;
}

.stat-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-blank);
}

.chip-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.chip-num {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  color: var(--el-text-color-primary);
}

.chip-use {
  border-color: var(--el-color-success-light-5);
  background: var(--el-color-success-light-9);
}

.chip-borrow {
  border-color: var(--el-color-warning-light-5);
  background: var(--el-color-warning-light-9);
}

.chip-total {
  border-color: var(--el-color-primary-light-5);
  background: var(--el-color-primary-light-9);
}

.table-card {
  border-radius: var(--ca-radius);
}

.table-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12px;
}

.section-title {
  font-weight: 700;
  font-size: 15px;
}

.table-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.return-table {
  border-radius: 8px;
}

.emph {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.return-desc {
  margin-bottom: 16px;
}

.dialog-form {
  margin-top: 4px;
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.search-field {
  width: 200px;
  max-width: 100%;
}
</style>
