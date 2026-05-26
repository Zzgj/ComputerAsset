<template>
  <div class="ca-page ca-animate">
    <el-card shadow="never">
      <div class="ca-page-header">
        <div>
          <div class="ca-page-title">员工管理</div>
          <div class="ca-page-subtitle">按园区维护员工档案，关联资产与外部资源，办理离职流程</div>
        </div>
        <el-button v-if="canWrite" type="primary" @click="openAdd">新增员工</el-button>
      </div>
    </el-card>

    <el-card shadow="never">
      <div class="filter-row">
        <el-input
          v-model="filter.keyword"
          placeholder="搜索姓名或工号"
          clearable
          class="filter-input"
          @keyup.enter="reload"
          @clear="reload"
        />
        <el-select
          v-model="filter.campusId"
          placeholder="所有园区"
          clearable
          class="filter-select"
          @change="onCampusChange"
        >
          <el-option v-for="c in campuses" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
        <el-select
          v-model="filter.departmentId"
          placeholder="所有部门"
          clearable
          class="filter-select"
          @change="reload"
        >
          <el-option
            v-for="d in filteredDepartments"
            :key="d.id"
            :label="d.name"
            :value="d.id"
          />
        </el-select>
        <el-button type="primary" @click="reload">搜索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </div>

      <el-tabs v-model="filter.status" class="status-tabs" @tab-change="reload">
        <el-tab-pane label="在职" name="active" />
        <el-tab-pane label="已离职" name="resigned" />
      </el-tabs>

      <el-table v-loading="loading" :data="rows" size="small" style="width: 100%">
        <el-table-column prop="employeeNo" label="工号" min-width="120" />
        <el-table-column label="姓名" min-width="120">
          <template #default="{ row }">
            <router-link :to="`/employees/${row.id}`" class="row-link">{{ row.name }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="园区" min-width="100">
          <template #default="{ row }">{{ row.campus?.name ?? '-' }}</template>
        </el-table-column>
        <el-table-column label="部门" min-width="140">
          <template #default="{ row }">{{ row.department?.name ?? '未分配' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" effect="light">
              {{ row.status === 'active' ? '在职' : '已离职' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="入职日期" width="120">
          <template #default="{ row }">{{ formatDate(row.joinedAt) }}</template>
        </el-table-column>
        <el-table-column label="离职日期" width="120">
          <template #default="{ row }">{{ formatDate(row.resignedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="goDetail(row)">详情</el-button>
            <el-button v-if="canWrite" size="small" text type="primary" @click="openEdit(row)">
              编辑
            </el-button>
            <el-button
              v-if="canReactivate && row.status === 'resigned'"
              size="small"
              text
              type="success"
              @click="reactivate(row)"
            >
              重新激活
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-row">
        <el-pagination
          v-model:current-page="filter.page"
          v-model:page-size="filter.pageSize"
          :total="total"
          :page-sizes="[20, 50, 100]"
          background
          layout="total, sizes, prev, pager, next"
          @current-change="reload"
          @size-change="reload"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑员工' : '新增员工'" width="520px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="工号" required>
          <el-input v-model="form.employeeNo" maxlength="64" :disabled="!!form.id && !canTransfer" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="form.name" maxlength="64" />
        </el-form-item>
        <el-form-item label="园区" required>
          <el-select v-model="form.campusId" :disabled="!!form.id" class="form-full" @change="onFormCampusChange">
            <el-option v-for="c in campuses" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
          <div v-if="form.id && canTransfer" class="campus-tip">
            如需修改员工所属园区，请在员工详情页使用「修改园区」按钮。
          </div>
        </el-form-item>
        <el-form-item label="部门">
          <DepartmentCascader
            v-model="form.departmentId"
            :departments="formDepartments"
            :campuses="formCampuses"
            placeholder="按园区展开后选择部门（可选）"
          />
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker
            v-model="form.joinedAt"
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiRequest } from '../services/api'
import { useAuthStore } from '../stores/auth'
import DepartmentCascader from '../components/DepartmentCascader.vue'

const router = useRouter()
const auth = useAuthStore()

const canWrite = computed(() => auth.can('employees.write'))
const canReactivate = computed(() => auth.can('employees.transfer_campus') || auth.me?.bypassAll)
const canTransfer = computed(() => auth.can('employees.transfer_campus') || auth.me?.bypassAll)

const loading = ref(false)
const saving = ref(false)
const rows = ref<any[]>([])
const total = ref(0)
const campuses = ref<Array<{ id: number; name: string; sortOrder: number }>>([])
const departments = ref<Array<{ id: number; name: string; campusId: number; parentId: number | null; sortOrder: number }>>([])

const filter = reactive({
  keyword: '',
  campusId: null as number | null,
  departmentId: null as number | null,
  status: 'active' as 'active' | 'resigned',
  page: 1,
  pageSize: 20,
})

const filteredDepartments = computed(() => {
  if (!filter.campusId) return departments.value
  return departments.value.filter((d) => d.campusId === filter.campusId)
})

const dialogVisible = ref(false)
const form = reactive<any>({
  id: null,
  employeeNo: '',
  name: '',
  campusId: null,
  departmentId: null,
  joinedAt: '',
  remark: '',
})

const formCampuses = computed(() => {
  if (!form.campusId) return campuses.value
  return campuses.value.filter((c) => c.id === form.campusId)
})
const formDepartments = computed(() => {
  if (!form.campusId) return departments.value
  return departments.value.filter((d) => d.campusId === form.campusId)
})

function formatDate(v: string | null | undefined) {
  if (!v) return '—'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return '—'
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function onCampusChange() {
  filter.departmentId = null
  reload()
}

function onFormCampusChange() {
  form.departmentId = null
}

function resetFilter() {
  filter.keyword = ''
  filter.campusId = null
  filter.departmentId = null
  filter.page = 1
  reload()
}

async function loadMeta() {
  const [c, d] = await Promise.all([
    apiRequest<{ items: any[] }>('/api/campuses'),
    apiRequest<{ items: any[] }>('/api/departments'),
  ])
  campuses.value = c.items ?? []
  departments.value = d.items ?? []
}

async function reload() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filter.keyword.trim()) params.set('keyword', filter.keyword.trim())
    if (filter.campusId) params.set('campusId', String(filter.campusId))
    if (filter.departmentId) params.set('departmentId', String(filter.departmentId))
    params.set('status', filter.status)
    params.set('page', String(filter.page))
    params.set('pageSize', String(filter.pageSize))
    const data = await apiRequest<{ items: any[]; total: number }>(`/api/employees?${params.toString()}`)
    rows.value = data.items ?? []
    total.value = data.total ?? 0
  } catch (e: any) {
    ElMessage.error(e?.message ?? '加载员工失败')
  } finally {
    loading.value = false
  }
}

function openAdd() {
  Object.assign(form, {
    id: null,
    employeeNo: '',
    name: '',
    campusId: filter.campusId ?? campuses.value[0]?.id ?? null,
    departmentId: null,
    joinedAt: '',
    remark: '',
  })
  dialogVisible.value = true
}

function openEdit(row: any) {
  Object.assign(form, {
    id: row.id,
    employeeNo: row.employeeNo,
    name: row.name,
    campusId: row.campusId,
    departmentId: row.departmentId,
    joinedAt: row.joinedAt ? row.joinedAt.slice(0, 10) : '',
    remark: row.remark ?? '',
  })
  dialogVisible.value = true
}

async function save() {
  const name = String(form.name ?? '').trim()
  const employeeNo = String(form.employeeNo ?? '').trim()
  if (!name) return ElMessage.warning('请填写姓名')
  if (!employeeNo) return ElMessage.warning('请填写工号')
  if (!form.campusId) return ElMessage.warning('请选择园区')

  saving.value = true
  try {
    if (form.id) {
      const payload: any = {
        name,
        employeeNo,
        departmentId: form.departmentId ?? null,
        joinedAt: form.joinedAt || null,
        remark: form.remark || null,
      }
      await apiRequest(`/api/employees/${form.id}`, { method: 'PATCH', body: payload })
    } else {
      const payload: any = {
        name,
        employeeNo,
        campusId: form.campusId,
        departmentId: form.departmentId ?? undefined,
        joinedAt: form.joinedAt || undefined,
        remark: form.remark || undefined,
      }
      await apiRequest('/api/employees', { method: 'POST', body: payload })
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

async function reactivate(row: any) {
  try {
    await ElMessageBox.confirm(`确认将 ${row.name} 重新激活为在职状态？`, '重新激活', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
    await apiRequest(`/api/employees/${row.id}/reactivate`, { method: 'POST' })
    ElMessage.success('已重新激活')
    await reload()
  } catch (e: any) {
    if (e?.message) ElMessage.error(e.message)
  }
}

function goDetail(row: any) {
  router.push(`/employees/${row.id}`)
}

onMounted(async () => {
  await loadMeta()
  await reload()
})
</script>

<style scoped>
.filter-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.filter-input {
  width: 220px;
}
.filter-select {
  width: 180px;
}
.status-tabs {
  margin-bottom: 8px;
}
.pagination-row {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
}
.row-link {
  color: var(--el-color-primary);
  text-decoration: none;
}
.row-link:hover {
  text-decoration: underline;
}
.form-full {
  width: 100%;
}
.campus-tip {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-top: 4px;
}
</style>
