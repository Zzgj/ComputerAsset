<template>
  <div style="padding: 20px">
    <el-row :gutter="16" v-if="stats">
      <el-col :span="6">
        <el-card shadow="never">
          <div style="color: #666; font-size: 13px">资产总数</div>
          <div style="font-size: 26px; font-weight: 700">{{ stats.totalCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div style="color: #666; font-size: 13px">在库</div>
          <div style="font-size: 26px; font-weight: 700">{{ stats.inStockCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div style="color: #666; font-size: 13px">使用中</div>
          <div style="font-size: 26px; font-weight: 700">{{ stats.inUseCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div style="color: #666; font-size: 13px">借用中</div>
          <div style="font-size: 26px; font-weight: 700">{{ stats.borrowedCount }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row v-if="stats?.multiDeviceHolders?.length" :gutter="16" style="margin-top: 16px">
      <el-col :span="24">
        <el-card shadow="never" class="multi-holder-card">
          <div class="multi-holder-head">
            <span class="multi-holder-title">一人多名下资产</span>
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
            class="multi-holder-alert"
            title="以下人员在「使用中 / 待领用 / 借用中 / 维修中」状态下同时关联多台电脑，与「一人一机」规则冲突风险较高，请重点核对。"
          />
          <el-table :data="visibleMultiHolders" size="small" style="width: 100%; margin-top: 12px">
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
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <el-card shadow="never">
          <div style="font-weight: 700; margin-bottom: 10px">状态分布</div>
          <VChart class="chart" :option="pieOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <div style="font-weight: 700; margin-bottom: 10px">部门领用/借用对比</div>
          <VChart class="chart" :option="barOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <el-card shadow="never">
          <div style="font-weight: 700; margin-bottom: 10px">提醒通知</div>
          <div style="display: grid; gap: 12px">
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

            <div v-if="notifications && !notifications.overdue.length && !notifications.dueSoon.length && !notifications.waitingPickupTimeout.length" style="color: #666">
              暂无提醒
            </div>

            <div v-if="notifications?.overdue?.length">
              <div style="font-weight: 700; margin-top: 6px; margin-bottom: 6px">借用超期明细</div>
              <el-table :data="notifications.overdue" size="small" style="width: 100%">
                <el-table-column prop="assetCode" label="电脑编号" />
                <el-table-column prop="currentUserName" label="使用人" />
                <el-table-column prop="departmentName" label="部门" />
                <el-table-column prop="daysOverdue" label="逾期天数" />
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never">
          <div style="font-weight: 700; margin-bottom: 10px">最近操作记录</div>
          <el-table :data="records" size="small" style="width: 100%" v-loading="recordsLoading">
            <el-table-column label="操作类型">
              <template #default="{ row }">{{ actionLabel(row.action) }}</template>
            </el-table-column>
            <el-table-column prop="asset.assetCode" label="电脑编号" />
            <el-table-column prop="userName" label="用户" />
            <el-table-column prop="department.name" label="部门" />
            <el-table-column label="时间">
              <template #default="{ row }">{{ new Date(row.actionDate).toLocaleString() }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
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

const pieOption = computed(() => {
  const pie = stats.value?.statusPie ?? []
  return {
    title: { text: '状态分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        name: '状态',
        type: 'pie',
        radius: '55%',
        data: pie.map((x) => ({ name: x.name, value: x.value })),
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
    tooltip: { trigger: 'axis' },
    legend: { data: ['使用中', '借用中'] },
    xAxis: {
      type: 'category',
      data: depts.map((d) => d.departmentName),
      axisTick: { alignWithLabel: true },
      axisLabel: {
        interval: 0,
        rotate: tooMany ? 35 : 0,
        formatter: (value: string) => {
          const s = String(value ?? '')
          if (s.length <= 8) return s
          return `${s.slice(0, 8)}...`
        },
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: {
        formatter: (value: number) => String(Math.round(value)),
      },
    },
    series: [
      {
        name: '使用中',
        type: 'bar',
        data: depts.map((d) => d.inUse),
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 24,
      },
      {
        name: '借用中',
        type: 'bar',
        data: depts.map((d) => d.borrowed),
        itemStyle: { borderRadius: [4, 4, 0, 0] },
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
            backgroundColor: '#f2f3f5',
            fillerColor: '#d7dbe3',
            handleSize: 0,
          },
        ]
      : [],
  }
})
</script>

<style scoped>
.chart {
  height: 360px;
}
.multi-holder-card {
  border: 1px solid var(--el-color-danger-light-5);
}
.multi-holder-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.multi-holder-title {
  font-weight: 800;
  font-size: 16px;
}
.multi-holder-alert {
  margin-top: 0;
}
</style>

