<template>
  <div class="ca-page ca-animate">
    <div class="top-bar">
      <el-button type="primary" @click="router.push('/employees')">返回员工列表</el-button>
      <div class="id-hint" v-if="employee">员工ID：{{ employee.id }}</div>
    </div>

    <el-card v-if="employee" shadow="never" class="header-card">
      <div class="header-row">
        <div class="info-col">
          <div class="employee-name">{{ employee.name }}</div>
          <div class="employee-no">工号：{{ employee.employeeNo }}</div>
          <div class="tag-row">
            <el-tag :type="employee.status === 'active' ? 'success' : 'info'" effect="light">
              {{ employee.status === 'active' ? '在职' : '已离职' }}
            </el-tag>
            <el-tag v-if="employee.campus?.name" type="primary" effect="plain">{{
              employee.campus.name
            }}</el-tag>
            <el-tag v-if="employee.department?.name" effect="plain">{{
              employee.department.name
            }}</el-tag>
          </div>
          <div v-if="employee.joinedAt || employee.resignedAt" class="date-row">
            <span v-if="employee.joinedAt">入职：{{ formatDate(employee.joinedAt) }}</span>
            <span v-if="employee.resignedAt" class="resigned-date"
              >离职：{{ formatDate(employee.resignedAt) }}</span
            >
          </div>
          <div v-if="employee.remark" class="remark-box">{{ employee.remark }}</div>
        </div>
        <div class="action-col">
          <el-button v-if="canWrite" plain @click="openEditBasic">编辑基本信息</el-button>
          <el-button v-if="canTransfer" plain type="primary" @click="openTransferCampus"
            >修改园区</el-button
          >
          <el-button
            v-if="employee.status === 'active' && canResign"
            type="warning"
            @click="openResignDialog"
          >
            办理离职
          </el-button>
          <el-button
            v-if="employee.status === 'resigned' && canReactivate"
            type="success"
            plain
            @click="reactivate"
          >
            重新激活
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card v-if="employee" shadow="never" class="section-card">
      <div class="section-title">历史持有 IT 资产</div>
      <el-table :data="historicalAssets" size="small" empty-text="暂无历史持有记录">
        <el-table-column prop="assetCode" label="资产编号" min-width="140">
          <template #default="{ row }">
            <router-link :to="`/assets/${row.id}`" class="row-link">{{
              row.assetCode
            }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="品牌/型号" min-width="160">
          <template #default="{ row }">{{
            [row.brand, row.model].filter(Boolean).join(' / ') || '—'
          }}</template>
        </el-table-column>
        <el-table-column label="当前状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" effect="light">{{
              statusLabel(row.status)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当时部门" min-width="140">
          <template #default="{ row }">{{ row.lastDepartment?.name ?? '—' }}</template>
        </el-table-column>
        <el-table-column label="最近关联日期" width="140">
          <template #default="{ row }">{{ formatDate(row.lastOwnedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="goAssetDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-if="employee" shadow="never" class="section-card">
      <div class="section-title">持有 IT 资产</div>
      <el-table
        :data="assets"
        size="small"
        v-loading="loadingAssets"
        empty-text="该员工名下暂无 IT 资产"
      >
        <el-table-column prop="assetCode" label="资产编号" min-width="140">
          <template #default="{ row }">
            <router-link :to="`/assets/${row.id}`" class="row-link">{{
              row.assetCode
            }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="品牌/型号" min-width="160">
          <template #default="{ row }">{{
            [row.brand, row.model].filter(Boolean).join(' / ') || '—'
          }}</template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" effect="light">{{
              statusLabel(row.status)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="部门" min-width="120">
          <template #default="{ row }">{{ row.department?.name ?? '—' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="goAssetDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-if="employee" shadow="never" class="section-card">
      <div class="section-header">
        <div class="section-title">外部资源</div>
        <el-button
          v-if="canWrite && employee.status === 'active'"
          type="primary"
          size="small"
          @click="openResourceAdd"
        >
          + 新增资源
        </el-button>
      </div>
      <el-table :data="resources" size="small" empty-text="暂无外部资源">
        <el-table-column label="类型" width="140">
          <template #default="{ row }">{{ resourceTypeLabel(row.type) }}</template>
        </el-table-column>
        <el-table-column prop="identifier" label="标识/号码" min-width="180" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" effect="light">
              {{ row.status === 'active' ? '在用' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分配时间" width="140">
          <template #default="{ row }">{{ formatDate(row.assignedAt) }}</template>
        </el-table-column>
        <el-table-column label="关闭时间" width="140">
          <template #default="{ row }">{{ formatDate(row.closedAt) }}</template>
        </el-table-column>
        <el-table-column label="备注" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">{{ row.remark || '—' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="canWrite"
              size="small"
              text
              type="primary"
              @click="openResourceEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="canWrite && row.status === 'active'"
              size="small"
              text
              type="warning"
              @click="closeResource(row)"
            >
              标记关闭
            </el-button>
            <el-button v-if="canWrite" size="small" text type="danger" @click="deleteResource(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑基本信息 -->
    <el-dialog v-model="editDialogVisible" title="编辑员工基本信息" width="520px">
      <el-form :model="editForm" label-width="90px">
        <el-form-item label="工号" required>
          <el-input v-model="editForm.employeeNo" maxlength="64" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="editForm.name" maxlength="64" />
        </el-form-item>
        <el-form-item label="部门">
          <DepartmentCascader
            v-model="editForm.departmentId"
            :departments="filteredDepartments"
            :campuses="filteredCampuses"
            placeholder="按园区展开后选择部门（可选）"
          />
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker
            v-model="editForm.joinedAt"
            type="date"
            value-format="YYYY-MM-DD"
            class="form-full"
            placeholder="可选"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.remark" type="textarea" :rows="3" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveBasic">保存</el-button>
      </template>
    </el-dialog>

    <!-- 修改园区 -->
    <el-dialog v-model="transferDialogVisible" title="修改员工所属园区" width="460px">
      <el-form :model="transferForm" label-width="90px">
        <el-form-item label="目标园区" required>
          <el-select v-model="transferForm.campusId" class="form-full">
            <el-option v-for="c in campuses" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-alert type="warning" :closable="false" show-icon>
          修改员工园区后，该员工的部门将被清空（需重新分配）。该员工名下资产的园区不会随之变更。
        </el-alert>
      </el-form>
      <template #footer>
        <el-button @click="transferDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveTransferCampus">确认修改</el-button>
      </template>
    </el-dialog>

    <!-- 新增/编辑资源 -->
    <el-dialog
      v-model="resourceDialogVisible"
      :title="resourceForm.id ? '编辑外部资源' : '新增外部资源'"
      width="480px"
    >
      <el-form :model="resourceForm" label-width="90px">
        <el-form-item label="资源类型" required>
          <el-select v-model="resourceForm.type" class="form-full">
            <el-option
              v-for="opt in resourceTypeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标识/号码" required>
          <el-input
            v-model="resourceForm.identifier"
            maxlength="255"
            placeholder="如手机号、邮箱地址、域控账号等"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="resourceForm.status" class="form-full">
            <el-option label="在用" value="active" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="resourceForm.remark" type="textarea" :rows="2" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resourceDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveResource">保存</el-button>
      </template>
    </el-dialog>

    <!-- 办理离职 -->
    <el-dialog v-model="resignDialogVisible" title="办理员工离职" width="640px">
      <div class="resign-body">
        <div v-if="resignAssets.length" class="resign-section">
          <div class="section-header">
            <div class="resign-section-title">未归还 IT 资产（{{ resignAssets.length }}）</div>
            <el-button
              v-if="canReturnAssets"
              type="primary"
              size="small"
              :loading="returningAssets"
              :disabled="!returnableResignAssets.length"
              @click="returnAllResignAssets"
            >
              一键归还
            </el-button>
          </div>
          <div class="resign-hint">
            使用中、借用中、待领用和待签字资产可在此直接批量归还；维修中资产需先完成维修流程。
          </div>
          <el-table :data="resignAssets" size="small">
            <el-table-column prop="assetCode" label="资产编号" min-width="140">
              <template #default="{ row }">
                <router-link :to="`/assets/${row.id}`" class="row-link" target="_blank">{{
                  row.assetCode
                }}</router-link>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.status)" effect="light">{{
                  statusLabel(row.status)
                }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-checkbox v-model="resignForm.forceMarkResign" class="force-checkbox">
            强制完成离职（保留未处理资产，仅修改员工状态）
          </el-checkbox>
        </div>

        <div class="resign-section">
          <div class="resign-section-title">在用外部资源（默认全部勾选关闭）</div>
          <el-empty v-if="!activeResources.length" description="该员工暂无在用外部资源" />
          <el-checkbox-group v-else v-model="resignForm.resourceIds">
            <div v-for="r in activeResources" :key="r.id" class="resource-row">
              <el-checkbox :value="r.id">
                <span class="resource-tag">{{ resourceTypeLabel(r.type) }}</span>
                <span class="resource-id">{{ r.identifier }}</span>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

        <div class="resign-section">
          <div class="resign-section-title">离职日期</div>
          <el-date-picker
            v-model="resignForm.resignedAt"
            type="date"
            value-format="YYYY-MM-DD"
            class="form-full"
            placeholder="默认为今天"
          />
        </div>

        <div class="resign-section">
          <div class="resign-section-title">备注</div>
          <el-input
            v-model="resignForm.remark"
            type="textarea"
            :rows="2"
            placeholder="可选，离职说明"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="resignDialogVisible = false">取消</el-button>
        <el-button type="warning" :loading="saving" @click="submitResign">确认离职</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiRequest } from '../services/api'
import { useAuthStore } from '../stores/auth'
import DepartmentCascader from '../components/DepartmentCascader.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const canWrite = computed(() => auth.can('employees.write'))
const canResign = computed(() => auth.can('employees.resign'))
const canReturnAssets = computed(() => canResign.value && auth.can('operations.execute'))
const canTransfer = computed(() => auth.can('employees.transfer_campus') || auth.me?.bypassAll)
const canReactivate = computed(() => auth.can('employees.transfer_campus') || auth.me?.bypassAll)

const employeeId = computed(() => Number(route.params.id))

const employee = ref<any>(null)
const resources = ref<any[]>([])
const assets = ref<any[]>([])
const historicalAssets = ref<any[]>([])
const loadingAssets = ref(false)
const saving = ref(false)
const returningAssets = ref(false)
const campuses = ref<Array<{ id: number; name: string; sortOrder: number }>>([])
const departments = ref<
  Array<{ id: number; name: string; campusId: number; parentId: number | null; sortOrder: number }>
>([])

const filteredCampuses = computed(() => {
  if (!employee.value?.campusId) return campuses.value
  return campuses.value.filter((c) => c.id === employee.value.campusId)
})
const filteredDepartments = computed(() => {
  if (!employee.value?.campusId) return departments.value
  return departments.value.filter((d) => d.campusId === employee.value.campusId)
})

const resourceTypeOptions = [
  { value: 'phone_sim', label: '手机号/SIM 卡' },
  { value: 'email', label: '邮箱账号' },
  { value: 'domain_account', label: '域控账号' },
  { value: 'badge', label: '工牌' },
  { value: 'access_card', label: '门禁卡' },
  { value: 'seat', label: '工位' },
  { value: 'other', label: '其他' },
]

function resourceTypeLabel(t: string) {
  return resourceTypeOptions.find((o) => o.value === t)?.label ?? t
}

function formatDate(v: string | null | undefined) {
  if (!v) return '—'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return '—'
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function statusLabel(s: string) {
  return (
    (
      {
        in_stock: '在库',
        waiting_pickup: '待领用',
        pending_confirmation: '待签字',
        in_use: '使用中',
        borrowed: '借用中',
        in_repair: '维修中',
        retired: '已报废',
      } as Record<string, string>
    )[s] ?? s
  )
}

function statusTagType(s: string): 'success' | 'warning' | 'info' | 'danger' | 'primary' {
  switch (s) {
    case 'in_stock':
      return 'success'
    case 'in_use':
      return 'primary'
    case 'borrowed':
      return 'warning'
    case 'waiting_pickup':
    case 'pending_confirmation':
      return 'warning'
    case 'in_repair':
      return 'info'
    case 'retired':
      return 'danger'
    default:
      return 'info'
  }
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
  loadingAssets.value = true
  try {
    const data = await apiRequest<{ employee: any; assets: any[]; historicalAssets: any[] }>(
      `/api/employees/${employeeId.value}`,
    )
    employee.value = data.employee
    resources.value = data.employee?.resources ?? []
    assets.value = data.assets ?? []
    historicalAssets.value = data.historicalAssets ?? []
  } catch (e: any) {
    ElMessage.error(e?.message ?? '加载员工详情失败')
  } finally {
    loadingAssets.value = false
  }
}

const editDialogVisible = ref(false)
const editForm = reactive<any>({
  employeeNo: '',
  name: '',
  departmentId: null,
  joinedAt: '',
  remark: '',
})

function openEditBasic() {
  if (!employee.value) return
  Object.assign(editForm, {
    employeeNo: employee.value.employeeNo,
    name: employee.value.name,
    departmentId: employee.value.departmentId,
    joinedAt: employee.value.joinedAt ? employee.value.joinedAt.slice(0, 10) : '',
    remark: employee.value.remark ?? '',
  })
  editDialogVisible.value = true
}

async function saveBasic() {
  saving.value = true
  try {
    await apiRequest(`/api/employees/${employeeId.value}`, {
      method: 'PATCH',
      body: {
        employeeNo: editForm.employeeNo.trim(),
        name: editForm.name.trim(),
        departmentId: editForm.departmentId ?? null,
        joinedAt: editForm.joinedAt || null,
        remark: editForm.remark || null,
      },
    })
    ElMessage.success('保存成功')
    editDialogVisible.value = false
    await reload()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '保存失败')
  } finally {
    saving.value = false
  }
}

const transferDialogVisible = ref(false)
const transferForm = reactive<{ campusId: number | null }>({ campusId: null })

function openTransferCampus() {
  if (!employee.value) return
  transferForm.campusId = employee.value.campusId
  transferDialogVisible.value = true
}

async function saveTransferCampus() {
  if (!transferForm.campusId) return ElMessage.warning('请选择目标园区')
  saving.value = true
  try {
    await apiRequest(`/api/employees/${employeeId.value}/campus`, {
      method: 'PATCH',
      body: { campusId: transferForm.campusId },
    })
    ElMessage.success('园区已更新')
    transferDialogVisible.value = false
    await reload()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '修改园区失败')
  } finally {
    saving.value = false
  }
}

const resourceDialogVisible = ref(false)
const resourceForm = reactive<any>({
  id: null,
  type: 'phone_sim',
  identifier: '',
  status: 'active',
  remark: '',
})

function openResourceAdd() {
  Object.assign(resourceForm, {
    id: null,
    type: 'phone_sim',
    identifier: '',
    status: 'active',
    remark: '',
  })
  resourceDialogVisible.value = true
}

function openResourceEdit(row: any) {
  Object.assign(resourceForm, {
    id: row.id,
    type: row.type,
    identifier: row.identifier,
    status: row.status,
    remark: row.remark ?? '',
  })
  resourceDialogVisible.value = true
}

async function saveResource() {
  const identifier = String(resourceForm.identifier ?? '').trim()
  if (!identifier) return ElMessage.warning('请填写标识/号码')
  saving.value = true
  try {
    if (resourceForm.id) {
      await apiRequest(`/api/employees/${employeeId.value}/resources/${resourceForm.id}`, {
        method: 'PATCH',
        body: {
          type: resourceForm.type,
          identifier,
          status: resourceForm.status,
          remark: resourceForm.remark || null,
        },
      })
    } else {
      await apiRequest(`/api/employees/${employeeId.value}/resources`, {
        method: 'POST',
        body: {
          type: resourceForm.type,
          identifier,
          status: resourceForm.status,
          remark: resourceForm.remark || undefined,
        },
      })
    }
    ElMessage.success('保存成功')
    resourceDialogVisible.value = false
    await reload()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '保存失败')
  } finally {
    saving.value = false
  }
}

async function closeResource(row: any) {
  try {
    await ElMessageBox.confirm(`确认将「${row.identifier}」标记为已关闭？`, '标记关闭', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
    await apiRequest(`/api/employees/${employeeId.value}/resources/${row.id}`, {
      method: 'PATCH',
      body: { status: 'closed' },
    })
    ElMessage.success('已标记关闭')
    await reload()
  } catch (e: any) {
    if (e?.message) ElMessage.error(e.message)
  }
}

async function deleteResource(row: any) {
  try {
    await ElMessageBox.confirm(`确认删除资源「${row.identifier}」？此操作不可撤销`, '删除资源', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
    })
    await apiRequest(`/api/employees/${employeeId.value}/resources/${row.id}`, {
      method: 'DELETE',
    })
    ElMessage.success('已删除')
    await reload()
  } catch (e: any) {
    if (e?.message) ElMessage.error(e.message)
  }
}

const resignDialogVisible = ref(false)
const resignAssets = ref<any[]>([])
const returnableResignAssets = computed(() =>
  resignAssets.value.filter((asset) =>
    ['in_use', 'borrowed', 'waiting_pickup', 'pending_confirmation'].includes(asset.status),
  ),
)
const activeResources = computed(() => resources.value.filter((r) => r.status === 'active'))
const resignForm = reactive<{
  resourceIds: number[]
  forceMarkResign: boolean
  resignedAt: string
  remark: string
}>({
  resourceIds: [],
  forceMarkResign: false,
  resignedAt: '',
  remark: '',
})

function openResignDialog() {
  resignAssets.value = assets.value.filter((a) => a.status !== 'retired')
  resignForm.resourceIds = activeResources.value.map((r) => r.id)
  resignForm.forceMarkResign = false
  resignForm.resignedAt = ''
  resignForm.remark = ''
  resignDialogVisible.value = true
}

async function returnAllResignAssets() {
  const targets = returnableResignAssets.value
  if (!targets.length) return
  try {
    await ElMessageBox.confirm(
      `确认将 ${targets.length} 台资产一键归还到各自园区的「未分配」部门？`,
      '离职资产一键归还',
      { type: 'warning', confirmButtonText: '确认归还', cancelButtonText: '取消' },
    )
    returningAssets.value = true
    await apiRequest(`/api/employees/${employeeId.value}/return-assets`, {
      method: 'POST',
      body: {
        requestId: `resign-return-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        assetIds: targets.map((asset) => asset.id),
        remark: resignForm.remark || undefined,
      },
    })
    ElMessage.success(`已归还 ${targets.length} 台资产`)
    await reload()
    resignAssets.value = assets.value.filter((asset) => asset.status !== 'retired')
  } catch (e: any) {
    if (e?.message) ElMessage.error(e.message)
  } finally {
    returningAssets.value = false
  }
}

async function submitResign() {
  saving.value = true
  try {
    await apiRequest(`/api/employees/${employeeId.value}/resign`, {
      method: 'POST',
      body: {
        resourceIds: resignForm.resourceIds,
        forceMarkResign: resignForm.forceMarkResign,
        resignedAt: resignForm.resignedAt || undefined,
        remark: resignForm.remark || undefined,
      },
    })
    ElMessage.success('员工已办理离职')
    resignDialogVisible.value = false
    await reload()
  } catch (e: any) {
    if (e?.status === 409 && e?.code === 'EMPLOYEE_HAS_PENDING_ASSETS') {
      ElMessage.warning('员工名下仍有未归还资产，请先处理或勾选「强制完成」')
      return
    }
    ElMessage.error(e?.message ?? '办理离职失败')
  } finally {
    saving.value = false
  }
}

async function reactivate() {
  try {
    await ElMessageBox.confirm(`确认将 ${employee.value?.name ?? ''} 重新激活？`, '重新激活', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
    await apiRequest(`/api/employees/${employeeId.value}/reactivate`, { method: 'POST' })
    ElMessage.success('已重新激活')
    await reload()
  } catch (e: any) {
    if (e?.message) ElMessage.error(e.message)
  }
}

function goAssetDetail(row: any) {
  router.push(`/assets/${row.id}`)
}

onMounted(async () => {
  await loadMeta()
  await reload()
})
</script>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.id-hint {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
.header-card {
  margin-bottom: 12px;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}
.employee-name {
  font-size: 22px;
  font-weight: 700;
}
.employee-no {
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}
.tag-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.date-row {
  margin-top: 10px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  display: flex;
  gap: 16px;
}
.resigned-date {
  color: var(--el-color-warning);
}
.remark-box {
  margin-top: 10px;
  padding: 8px 10px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  font-size: 13px;
  white-space: pre-wrap;
}
.action-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;
}
.section-card {
  margin-bottom: 12px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
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
.resign-body {
  max-height: 60vh;
  overflow-y: auto;
}
.resign-section {
  margin-bottom: 16px;
}
.resign-section-title {
  font-weight: 600;
  margin-bottom: 6px;
}
.resign-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}
.force-checkbox {
  margin-top: 10px;
}
.resource-row {
  display: block;
  margin-bottom: 6px;
}
.resource-tag {
  font-weight: 600;
  margin-right: 6px;
}
.resource-id {
  color: var(--el-text-color-secondary);
}
</style>
