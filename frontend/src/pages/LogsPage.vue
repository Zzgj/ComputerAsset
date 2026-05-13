<template>
  <div class="ca-page ca-animate">
    <el-card shadow="never">
      <div class="ca-page-title">操作日志</div>
      <div class="ca-page-subtitle">查看系统所有操作记录，支持按类型和日期范围筛选</div>
      <div class="filter-bar">
        <el-select v-model="query.category" placeholder="日志类型" style="width: 200px" @change="onCategoryChange">
          <el-option v-for="c in categoryOptions" :key="c.key" :label="c.label" :value="c.key" />
        </el-select>
        <el-input
          v-model="query.action"
          placeholder="在当前类型内按关键字筛选"
          style="width: 240px"
          clearable
        />
        <el-date-picker v-model="query.startDate" type="date" placeholder="开始日期" value-format="YYYY-MM-DD" />
        <el-date-picker v-model="query.endDate" type="date" placeholder="结束日期" value-format="YYYY-MM-DD" />
        <el-button type="primary" @click="load">搜索</el-button>
      </div>
    </el-card>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="items" size="small" style="width: 100%">
        <el-table-column prop="createdAt" label="时间" width="180">
          <template #default="{ row }">{{ new Date(row.createdAt).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="操作类型" width="140">
          <template #default="{ row }">{{ actionLabel(row.action) }}</template>
        </el-table-column>
        <el-table-column label="操作人" width="120">
          <template #default="{ row }">{{ row.operator?.realName ?? row.operator?.username }}</template>
        </el-table-column>
        <el-table-column prop="targetType" label="对象类型" width="110" />
        <el-table-column prop="targetId" label="对象ID" width="80" />
        <el-table-column prop="ipAddress" label="IP" width="130" />
        <el-table-column label="详情" min-width="320">
          <template #default="{ row }">
            <div class="detail-cell">
              <span class="detail-summary">{{ detailSummary(row.detail) }}</span>
              <el-button
                v-if="row.detail && typeof row.detail === 'object'"
                type="primary"
                text
                size="small"
                @click="openDetail(row)"
              >
                查看详情
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 16px; display: flex; justify-content: flex-end">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="query.pageSize"
          :current-page="query.page"
          @current-change="(p: number) => (query.page = p, load())"
        />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="操作详情" width="720px">
      <div class="detail-readable" v-if="selectedDetailRows.length">
        <div v-for="row in selectedDetailRows" :key="row.label" class="detail-readable-row">
          <span class="detail-readable-label">{{ row.label }}</span>
          <span class="detail-readable-value">{{ row.value }}</span>
        </div>
      </div>
      <pre v-else class="detail-pre">{{ selectedDetailText }}</pre>
      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { apiRequest } from '../services/api'
import { actionLabel } from '../actionLabel'

const loading = ref(false)
const items = ref<any[]>([])
const total = ref(0)
const detailVisible = ref(false)
const selectedDetailText = ref('')
const selectedDetailRows = ref<Array<{ label: string; value: string }>>([])

const categoryOptions = ref<Array<{ key: string; label: string }>>([{ key: 'all', label: '全部' }])

const query = reactive<any>({
  category: 'all',
  action: '',
  startDate: null,
  endDate: null,
  page: 1,
  pageSize: 20,
})

function onCategoryChange() {
  query.page = 1
  load()
}

async function load() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (query.category && query.category !== 'all') params.set('category', query.category)
    if (query.action) params.set('action', query.action)
    if (query.startDate) params.set('startDate', query.startDate)
    if (query.endDate) params.set('endDate', query.endDate)
    params.set('page', String(query.page))
    params.set('pageSize', String(query.pageSize))

    const data = await apiRequest<{ items: any[]; total: number; page: number; pageSize: number }>('/api/logs?' + params.toString())
    items.value = data.items ?? []
    total.value = data.total ?? 0
  } finally {
    loading.value = false
  }
}

function detailSummary(detail: unknown): string {
  if (!detail) return '-'
  if (typeof detail === 'string') return detail
  if (typeof detail !== 'object') return String(detail)

  const obj = detail as Record<string, unknown>
  const keys = Object.keys(obj)
  if (!keys.length) return '-'

  const rows = readableDetailRows(obj)
  if (rows.length) {
    const first = rows.slice(0, 3).map((x) => `${x.label}：${x.value}`)
    const more = rows.length > 3 ? ` 等${rows.length}项` : ''
    return `${first.join('；')}${more}`
  }

  const first = keys.slice(0, 3).map((k) => `${detailKeyLabel(k)}：${briefValue(obj[k])}`)
  const more = keys.length > 3 ? ` 等${keys.length}项` : ''
  return `${first.join('；')}${more}`
}

function briefValue(v: unknown): string {
  if (v === null || v === undefined || v === '') return '-'
  if (typeof v === 'object') return '[对象]'
  if (typeof v === 'boolean') return v ? '是' : '否'
  return String(v)
}

function openDetail(row: any) {
  const detail = row?.detail
  selectedDetailRows.value =
    detail && typeof detail === 'object' && !Array.isArray(detail)
      ? readableDetailRows(detail as Record<string, unknown>)
      : []
  try {
    selectedDetailText.value = JSON.stringify(detail ?? {}, null, 2)
  } catch {
    selectedDetailText.value = String(detail ?? '')
  }
  detailVisible.value = true
}

function statusLabel(v: unknown) {
  const map: Record<string, string> = {
    in_stock: '在库',
    waiting_pickup: '待领用',
    pending_confirmation: '待签字确认',
    in_use: '使用中',
    borrowed: '借用中',
    in_repair: '维修中',
    retired: '已报废',
    fixed: '已修复',
    unfixable: '无法修复',
  }
  const s = String(v ?? '')
  return map[s] ?? briefValue(v)
}

function detailKeyLabel(key: string) {
  const map: Record<string, string> = {
    from: '原状态',
    to: '新状态',
    fromStatus: '原状态',
    toStatus: '新状态',
    fromUser: '原使用人',
    toUser: '新使用人',
    fromDept: '原部门ID',
    toDept: '目标部门ID',
    pendingSignature: '是否待签字',
    expectedReturnDate: '预计归还时间',
    repairResult: '维修结果',
    repairCost: '维修费用',
    faultDescription: '故障描述',
    assetCode: '电脑编号',
    serialNumber: '序列号',
    username: '账号',
    accessRoleId: '角色ID',
    accessRoleSlug: '角色标识',
    reason: '原因',
    detachedTemplate: '是否脱离模板',
    versionFrom: '原版本',
    versionTo: '新版本',
    name: '名称',
    sortOrder: '排序',
    isActive: '是否启用',
    campusId: '园区ID',
    parentId: '上级部门ID',
    displayPath: '部门路径',
    permissionCount: '权限数量',
    campusesAll: '全部园区',
    remark: '备注',
  }
  return map[key] ?? key
}

function readableDetailRows(detail: Record<string, unknown>) {
  const rows: Array<{ label: string; value: string }> = []
  const push = (key: string, value: unknown, formatter = briefValue) => {
    if (typeof value === 'undefined') return
    rows.push({ label: detailKeyLabel(key), value: formatter(value) })
  }

  if (detail.before && detail.after && typeof detail.before === 'object' && typeof detail.after === 'object') {
    const before = detail.before as Record<string, unknown>
    const after = detail.after as Record<string, unknown>
    const labels: Record<string, string> = {
      templateId: '设备模板ID',
      assetCode: '电脑编号',
      serialNumber: '序列号',
      brand: '品牌',
      model: '型号',
      os: '操作系统',
      cpu: 'CPU',
      memory: '内存',
      storage: '存储',
      remark: '资产备注',
    }
    for (const key of Object.keys(labels) as Array<keyof typeof labels>) {
      if (String(before[key] ?? '') !== String(after[key] ?? '')) {
        const label = labels[key] ?? String(key)
        rows.push({
          label,
          value: `${briefValue(before[key])} -> ${briefValue(after[key])}`,
        })
      }
    }
  }

  push('from', detail.from, statusLabel)
  push('to', detail.to, statusLabel)
  push('fromStatus', detail.fromStatus, statusLabel)
  push('toStatus', detail.toStatus, statusLabel)
  push('fromUser', detail.fromUser)
  push('toUser', detail.toUser)
  push('fromDept', detail.fromDept)
  push('toDept', detail.toDept)
  push('pendingSignature', detail.pendingSignature)
  push('expectedReturnDate', detail.expectedReturnDate, (v) => v ? new Date(String(v)).toLocaleString() : '-')
  push('repairResult', detail.repairResult, statusLabel)
  push('repairCost', detail.repairCost)
  push('faultDescription', detail.faultDescription)
  push('assetCode', detail.assetCode)
  push('serialNumber', detail.serialNumber)
  push('remark', detail.remark)

  if (!rows.length) {
    for (const [key, value] of Object.entries(detail)) {
      if (key === 'before' || key === 'after') continue
      push(key, value)
    }
  }
  return rows
}

async function loadMeta() {
  try {
    const data = await apiRequest<{ categories: Array<{ key: string; label: string }> }>('/api/logs/meta')
    if (data.categories?.length) categoryOptions.value = data.categories
  } catch {
    // keep default
  }
}

onMounted(async () => {
  await loadMeta()
  await load()
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 16px;
}

.detail-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.detail-summary {
  color: var(--ca-text-secondary);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-pre {
  margin: 0;
  padding: 16px;
  max-height: 420px;
  overflow: auto;
  background: #f8fafc;
  border: 1px solid var(--ca-border-light);
  border-radius: var(--ca-radius-sm);
  line-height: 1.6;
  font-size: 12px;
  color: var(--ca-text-primary);
}

.detail-readable {
  display: grid;
  gap: 10px;
  max-height: 460px;
  overflow: auto;
}

.detail-readable-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid var(--ca-border-light);
  border-radius: var(--ca-radius-sm);
}

.detail-readable-label {
  color: var(--ca-text-secondary);
  font-size: 13px;
}

.detail-readable-value {
  color: var(--ca-text-primary);
  font-weight: 600;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
