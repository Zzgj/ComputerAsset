<template>
  <div class="ca-page ca-animate">
    <div class="stats-grid" v-if="stats">
      <div class="ca-stat-card stat-total">
        <div class="ca-stat-label">资产总数</div>
        <div class="ca-stat-value">{{ stats.totalCount }}</div>
      </div>
      <div class="ca-stat-card stat-stock">
        <div class="ca-stat-label">在库</div>
        <div class="ca-stat-value">{{ stats.inStockCount }}</div>
      </div>
      <div class="ca-stat-card stat-use">
        <div class="ca-stat-label">使用中</div>
        <div class="ca-stat-value">{{ stats.inUseCount }}</div>
      </div>
      <div class="ca-stat-card stat-borrow">
        <div class="ca-stat-label">借用中</div>
        <div class="ca-stat-value">{{ stats.borrowedCount }}</div>
      </div>
    </div>

    <div v-if="stats?.multiDeviceHolders?.length" class="multi-holder-section">
      <el-card shadow="never" class="multi-holder-card">
        <div class="multi-holder-head">
          <div class="multi-holder-title-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ca-danger)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span class="multi-holder-title">一人多名下资产</span>
          </div>
          <el-tag type="danger" effect="dark" round>{{ stats.multiDeviceHolders.length }} 人</el-tag>
          <el-button
            v-if="stats.multiDeviceHolders.length > 5"
            size="small"
            type="primary"
            text
            @click="multiExpanded = !multiExpanded"
          >
            {{ multiExpanded ? '收起' : '展开全部' }}
          </el-button>
        </div>
        <el-alert
          type="error"
          :closable="false"
          show-icon
          style="margin-bottom: 16px"
          title="以下人员在「使用中 / 待领用 / 借用中 / 维修中」状态下同时关联多台电脑，与「一人一机」规则冲突风险较高，请重点核对。"
        />
        <el-table :data="visibleMultiHolders" size="small" style="width: 100%">
          <el-table-column prop="userName" label="使用人" width="140">
            <template #default="{ row }">
              <el-tag type="danger" effect="dark">{{ row.userName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="台数" width="72" />
          <el-table-column label="关联电脑编号">
            <template #default="{ row }">
              <span v-for="(a, idx) in row.assets" :key="a.id">
                <el-link type="primary" @click="goAsset(a.id)">{{ a.assetCode }}</el-link>
                <span v-if="idx < row.assets.length - 1">、</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="280">
            <template #default="{ row }">
              <span v-for="(a, idx) in row.assets" :key="'s' + a.id">
                {{ heldStatusLabel(a.status) }}<span v-if="idx < row.assets.length - 1">；</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div class="charts-grid">
      <el-card shadow="never">
        <div class="chart-title">状态分布</div>
        <VChart class="chart" :option="pieOption" autoresize />
      </el-card>
      <el-card shadow="never">
        <div class="chart-title">部门领用/借用对比</div>
        <VChart class="chart" :option="barOption" autoresize />
      </el-card>
    </div>

    <div class="bottom-grid">
      <el-card shadow="never">
        <div class="chart-title">提醒通知</div>
        <div class="notification-list">
          <el-alert
            v-if="notifications?.overdue?.length"
            type="error"
            :closable="false"
            show-icon
            :title="`借用超期：${notifications.overdue.length}`"
          />
          <el-alert
            v-if="notifications?.dueSoon?.length"
            type="warning"
            :closable="false"
            show-icon
            :title="`借用即将到期：${notifications.dueSoon.length}`"
          />
          <el-alert
            v-if="notifications?.waitingPickupTimeout?.length"
            type="info"
            :closable="false"
            show-icon
            :title="`待领用超时：${notifications.waitingPickupTimeout.length}`"
          />

          <div v-if="notifications && !notifications.overdue.length && !notifications.dueSoon.length && !notifications.waitingPickupTimeout.length" class="empty-hint">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ca-success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            暂无提醒，一切正常
          </div>

          <div v-if="notifications?.overdue?.length">
            <div class="sub-title">借用超期明细</div>
            <el-table :data="notifications.overdue" size="small" style="width: 100%">
              <el-table-column prop="assetCode" label="电脑编号" />
              <el-table-column prop="currentUserName" label="使用人" />
              <el-table-column prop="departmentName" label="部门" />
              <el-table-column prop="daysOverdue" label="逾期天数" />
            </el-table>
          </div>
        </div>
      </el-card>

      <el-card shadow="never">
        <div class="chart-title">最近操作记录</div>
        <el-table :data="records" size="small" style="width: 100%" v-loading="recordsLoading">
          <el-table-column label="操作类型">
            <template #default="{ row }">{{ actionLabel(row.action) }}</template>
          </el-table-column>
          <el-table-column prop="asset.assetCode" label="电脑编号" />
          <el-table-column prop="userName" label="用户" />
          <el-table-column label="园区 / 部门" min-width="200">
            <template #default="{ row }">{{ row.department?.displayPath ?? row.department?.name ?? '—' }}</template>
          </el-table-column>
          <el-table-column label="时间">
            <template #default="{ row }">{{ new Date(row.actionDate).toLocaleString() }}</template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import 'echarts'

import { apiRequest } from '../services/api'
import { actionLabel } from '../actionLabel'

const router = useRouter()

type Stats = {
  totalCount: number
  inStockCount: number
  waitingPickupCount: number
  inUseCount: number
  borrowedCount: number
  inRepairCount: number
  statusPie: Array<{ name: string; value: number }>
  departments: Array<{ departmentName: string; inUse: number; borrowed: number }>
  deviceTypeDistribution: Array<{ deviceType: string; count: number }>
  multiDeviceHolders?: Array<{
    userName: string
    count: number
    assets: Array<{ id: number; assetCode: string; status: string; departmentName: string }>
  }>
}

function heldStatusLabel(status: string) {
  const m: Record<string, string> = {
    in_use: '使用中',
    waiting_pickup: '待领用',
    borrowed: '借用中',
    in_repair: '维修中',
  }
  return m[status] ?? status
}

function goAsset(id: number) {
  router.push('/assets/' + id)
}

const stats = ref<Stats | null>(null)
const notifications = ref<any>(null)
const records = ref<any[]>([])
const recordsLoading = ref(false)
const multiExpanded = ref(false)

const visibleMultiHolders = computed(() => {
  const all = stats.value?.multiDeviceHolders ?? []
  if (multiExpanded.value) return all
  return all.slice(0, 5)
})

onMounted(async () => {
  const [s, n, r] = await Promise.all([
    apiRequest<Stats>('/api/dashboard/stats'),
    apiRequest<any>('/api/dashboard/notifications'),
    apiRequest<any>('/api/dashboard/recent-records').then((x) => {
      recordsLoading.value = false
      return x
    }),
  ])
  stats.value = s
  notifications.value = n
  records.value = r.records ?? []
})

const pieColors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const pieOption = computed(() => {
  const pie = stats.value?.statusPie ?? []
  return {
    tooltip: { trigger: 'item', borderRadius: 8 },
    legend: {
      bottom: 0,
      textStyle: { color: '#64748b', fontSize: 12 },
    },
    series: [
      {
        name: '状态',
        type: 'pie',
        radius: ['42%', '65%'],
        center: ['50%', '45%'],
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          fontSize: 12,
          color: '#64748b',
          formatter: '{b}: {c}',
        },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: '700' },
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.1)' },
        },
        data: pie.map((x, i) => ({
          name: x.name,
          value: x.value,
          itemStyle: { color: pieColors[i % pieColors.length] },
        })),
      },
    ],
  }
})

const barOption = computed(() => {
  const depts = stats.value?.departments ?? []
  const tooMany = depts.length > 12
  const shownPercent = Math.max(30, Math.round((12 / Math.max(1, depts.length)) * 100))
  return {
    grid: {
      left: 24,
      right: 20,
      top: 36,
      bottom: tooMany ? 92 : 44,
      containLabel: true,
    },
    tooltip: { trigger: 'axis', borderRadius: 8 },
    legend: {
      data: ['使用中', '借用中'],
      textStyle: { color: '#64748b', fontSize: 12 },
    },
    xAxis: {
      type: 'category',
      data: depts.map((d) => d.departmentName),
      axisTick: { alignWithLabel: true },
      axisLabel: {
        interval: 0,
        rotate: tooMany ? 35 : 0,
        color: '#94a3b8',
        formatter: (value: string) => {
          const s = String(value ?? '')
          if (s.length <= 8) return s
          return `${s.slice(0, 8)}...`
        },
      },
      axisLine: { lineStyle: { color: '#e2e8f0' } },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: {
        color: '#94a3b8',
        formatter: (value: number) => String(Math.round(value)),
      },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
    },
    series: [
      {
        name: '使用中',
        type: 'bar',
        data: depts.map((d) => d.inUse),
        itemStyle: { borderRadius: [4, 4, 0, 0], color: '#4f46e5' },
        barMaxWidth: 24,
      },
      {
        name: '借用中',
        type: 'bar',
        data: depts.map((d) => d.borrowed),
        itemStyle: { borderRadius: [4, 4, 0, 0], color: '#818cf8' },
        barMaxWidth: 24,
      },
    ],
    dataZoom: tooMany
      ? [
          {
            type: 'inside',
            xAxisIndex: 0,
            start: 0,
            end: shownPercent,
          },
          {
            type: 'slider',
            xAxisIndex: 0,
            start: 0,
            end: shownPercent,
            height: 10,
            bottom: 4,
            showDetail: false,
            showDataShadow: false,
            brushSelect: false,
            borderColor: 'transparent',
            backgroundColor: '#f1f5f9',
            fillerColor: '#c7d2fe',
            handleSize: 0,
          },
        ]
      : [],
  }
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-total::before { background: linear-gradient(90deg, #4f46e5, #818cf8); }
.stat-stock::before { background: linear-gradient(90deg, #10b981, #6ee7b7); }
.stat-use::before { background: linear-gradient(90deg, #f59e0b, #fcd34d); }
.stat-borrow::before { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }

.stat-total .ca-stat-value { color: #4f46e5; }
.stat-stock .ca-stat-value { color: #10b981; }
.stat-use .ca-stat-value { color: #f59e0b; }
.stat-borrow .ca-stat-value { color: #8b5cf6; }

.multi-holder-card {
  border-color: var(--ca-danger-light) !important;
}

.multi-holder-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.multi-holder-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.multi-holder-title {
  font-weight: 800;
  font-size: 16px;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-title {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 12px;
  color: var(--ca-text-primary);
}

.chart {
  height: 360px;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.notification-list {
  display: grid;
  gap: 12px;
}

.empty-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ca-text-secondary);
  padding: 8px 0;
}

.sub-title {
  font-weight: 700;
  margin-top: 8px;
  margin-bottom: 8px;
  font-size: 13px;
}

@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .bottom-grid { grid-template-columns: 1fr; }
}
</style>
