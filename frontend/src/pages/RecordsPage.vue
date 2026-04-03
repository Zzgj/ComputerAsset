<template>
  <div class="ca-page ca-animate">
    <el-card shadow="never">
      <div class="ca-page-title">出入库记录</div>
      <div class="ca-page-subtitle">查看所有出入库流转记录，支持按编号、操作类型、使用人和日期范围筛选</div>
      <div class="filter-bar">
        <el-input v-model="query.assetCode" clearable style="width: 200px" placeholder="电脑编号（模糊）" />
        <el-select v-model="query.action" clearable style="width: 160px" placeholder="操作类型">
          <el-option label="入库" value="stock_in" />
          <el-option label="待领用" value="assign" />
          <el-option label="取消分配" value="cancel_assign" />
          <el-option label="领用" value="pick_up" />
          <el-option label="出库/领用" value="check_out" />
          <el-option label="借出" value="lend" />
          <el-option label="归还" value="return" />
          <el-option label="调拨" value="transfer" />
          <el-option label="送修" value="repair" />
          <el-option label="维修完成" value="repair_done" />
          <el-option label="报废" value="retire" />
        </el-select>
        <el-input v-model="query.userName" clearable style="width: 160px" placeholder="使用人（可选）" />
        <el-date-picker v-model="query.startDate" type="date" placeholder="开始日期" value-format="YYYY-MM-DD" />
        <el-date-picker v-model="query.endDate" type="date" placeholder="结束日期" value-format="YYYY-MM-DD" />
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </el-card>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="records" style="width: 100%" size="small">
        <el-table-column label="操作类型">
          <template #default="{ row }">{{ actionLabel(row.action) }}</template>
        </el-table-column>
        <el-table-column prop="asset.assetCode" label="电脑编号" />
        <el-table-column prop="userName" label="用户" />
        <el-table-column label="园区" min-width="88">
          <template #default="{ row }">{{ row.department?.campus?.name ?? '-' }}</template>
        </el-table-column>
        <el-table-column label="归属部门" min-width="220">
          <template #default="{ row }">{{ row.department?.displayPath ?? row.department?.name ?? '-' }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="时间">
          <template #default="{ row }">{{ new Date(row.actionDate).toLocaleString() }}</template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-size="query.pageSize"
          :current-page="query.page"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="onSizeChange"
          @current-change="onPageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { apiRequest } from '../services/api'
import { actionLabel } from '../actionLabel'
import { ElMessage } from 'element-plus'

const records = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const query = reactive({
  assetCode: '',
  action: '',
  userName: '',
  startDate: '',
  endDate: '',
  page: 1,
  pageSize: 20,
})

async function load() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (query.assetCode) params.set('assetCode', query.assetCode)
    if (query.action) params.set('action', query.action)
    if (query.userName) params.set('userName', query.userName)
    if (query.startDate) params.set('startDate', query.startDate)
    if (query.endDate) params.set('endDate', query.endDate)
    params.set('page', String(query.page))
    params.set('pageSize', String(query.pageSize))
    try {
      const data = await apiRequest<{ items: any[]; total: number }>('/api/records?' + params.toString())
      records.value = data.items ?? []
      total.value = data.total ?? 0
    } catch {
      const fallback = await apiRequest<{ records: any[] }>('/api/dashboard/recent-records')
      records.value = fallback.records ?? []
      total.value = records.value.length
      ElMessage.warning('记录分页接口未就绪，已回退显示最近记录。请重启后端后获得完整分页数据。')
    }
  } finally {
    loading.value = false
  }
}

function search() {
  query.page = 1
  load()
}

function reset() {
  query.assetCode = ''
  query.action = ''
  query.userName = ''
  query.startDate = ''
  query.endDate = ''
  query.page = 1
  query.pageSize = 20
  load()
}

function onPageChange(p: number) {
  query.page = p
  load()
}

function onSizeChange(s: number) {
  query.pageSize = s
  query.page = 1
  load()
}

onMounted(load)
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 16px;
}
</style>
