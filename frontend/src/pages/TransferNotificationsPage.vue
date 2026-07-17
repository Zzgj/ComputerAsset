<template>
  <div class="ca-page ca-animate">
    <el-card shadow="never">
      <div class="ca-page-header">
        <div>
          <div class="ca-page-title">调拨消息</div>
          <div class="ca-page-subtitle">跨园区资产调拨通知与已读回执，发送方和接收方均可追踪处理状态</div>
        </div>
        <el-button type="primary" @click="load">刷新</el-button>
      </div>
    </el-card>

    <el-card shadow="never" v-loading="loading">
      <el-tabs v-model="box" @tab-change="onTabChange">
        <el-tab-pane name="inbox">
          <template #label>
            <span>我收到的</span>
            <el-tag v-if="unreadCount" type="danger" size="small" effect="dark" round style="margin-left: 6px">
              {{ unreadCount }}
            </el-tag>
          </template>
        </el-tab-pane>
        <el-tab-pane name="sent" label="我发出的" />
      </el-tabs>

      <el-table :data="items" stripe border style="min-height: 240px">
        <el-table-column label="状态" width="92">
          <template #default="{ row }">
            <el-tag :type="row.isRead ? 'success' : 'danger'" effect="light">
              {{ row.isRead ? '已读' : '未读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="资产" min-width="150">
          <template #default="{ row }">
            <el-link type="primary" @click="goAsset(row.asset?.id)">{{ row.asset?.assetCode ?? '-' }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="园区流向" min-width="160">
          <template #default="{ row }">
            {{ row.fromCampus?.name ?? '-' }} → {{ row.toCampus?.name ?? '-' }}
          </template>
        </el-table-column>
        <el-table-column label="发送人" min-width="120">
          <template #default="{ row }">{{ userName(row.sender) }}</template>
        </el-table-column>
        <el-table-column label="接收人" min-width="120">
          <template #default="{ row }">{{ userName(row.recipient) }}</template>
        </el-table-column>
        <el-table-column label="消息" min-width="260" show-overflow-tooltip>
          <template #default="{ row }">{{ row.message }}</template>
        </el-table-column>
        <el-table-column label="发送时间" min-width="170">
          <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="读取时间" min-width="170">
          <template #default="{ row }">{{ row.readAt ? formatTime(row.readAt) : '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-if="box === 'inbox' && !row.isRead" type="primary" text @click="markRead(row)">
              标记已读
            </el-button>
            <el-button type="primary" text @click="goAsset(row.asset?.id)">查看资产</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty v-if="!loading" description="暂无调拨消息" :image-size="100" />
          <span v-else>&nbsp;</span>
        </template>
      </el-table>

      <div style="margin-top: 16px; display: flex; justify-content: flex-end">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="page"
          @current-change="onPageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { apiRequest } from '../services/api'

const router = useRouter()
const loading = ref(false)
const box = ref<'inbox' | 'sent'>('inbox')
const items = ref<any[]>([])
const total = ref(0)
const unreadCount = ref(0)
const page = ref(1)
const pageSize = ref(20)

function formatTime(v: unknown) {
  if (!v) return '-'
  return new Date(String(v)).toLocaleString()
}

function userName(user: any) {
  return user?.realName?.trim?.() || user?.username || '-'
}

async function load() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('box', box.value)
    params.set('page', String(page.value))
    params.set('pageSize', String(pageSize.value))
    const data = await apiRequest<{
      items: any[]
      total: number
      unreadCount: number
    }>('/api/transfer-notifications?' + params.toString())
    items.value = data.items ?? []
    total.value = data.total ?? 0
    unreadCount.value = data.unreadCount ?? 0
  } finally {
    loading.value = false
  }
}

async function markRead(row: any) {
  await apiRequest(`/api/transfer-notifications/${row.id}/read`, { method: 'POST' })
  ElMessage.success('已标记为已读')
  window.dispatchEvent(new Event('transfer-notifications-changed'))
  await load()
}

function onTabChange() {
  page.value = 1
  load()
}

function onPageChange(p: number) {
  page.value = p
  load()
}

function goAsset(id: unknown) {
  if (typeof id === 'number' && Number.isFinite(id)) router.push(`/assets/${id}`)
}

onMounted(load)
</script>
