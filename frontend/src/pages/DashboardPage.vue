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
import VChart from 'vue-echarts'
import 'echarts'

import { apiRequest } from '../services/api'
import { actionLabel } from '../actionLabel'

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
}

const stats = ref<Stats | null>(null)
const notifications = ref<any>(null)
const records = ref<any[]>([])
const recordsLoading = ref(false)

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
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['使用中', '借用中'] },
    xAxis: { type: 'category', data: depts.map((d) => d.departmentName) },
    yAxis: { type: 'value' },
    series: [
      { name: '使用中', type: 'bar', data: depts.map((d) => d.inUse) },
      { name: '借用中', type: 'bar', data: depts.map((d) => d.borrowed) },
    ],
  }
})
</script>

<style scoped>
.chart {
  height: 360px;
}
</style>

