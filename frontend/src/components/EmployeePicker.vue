<template>
  <div class="employee-picker">
    <el-select
      ref="selectRef"
      :model-value="selectedValue"
      :placeholder="placeholder"
      filterable
      remote
      reserve-keyword
      clearable
      :remote-method="onSearch"
      :loading="loading"
      :allow-create="allowCreate"
      :default-first-option="false"
      :no-data-text="emptyText"
      class="picker-select"
      @update:model-value="onSelect"
      @clear="onClear"
      @visible-change="onDropdownToggle"
    >
      <el-option
        v-for="emp in options"
        :key="emp.id"
        :label="emp.name + '（' + emp.employeeNo + '）'"
        :value="emp.id"
      >
        <span class="picker-option-name">{{ emp.name }}</span>
        <span class="picker-option-no">{{ emp.employeeNo }}</span>
        <span v-if="emp.department" class="picker-option-dept">· {{ emp.department.name }}</span>
      </el-option>

      <template #empty>
        <div class="empty-tip">
          <div class="empty-tip-text">未找到匹配的员工</div>
          <el-button v-if="!disabled" type="primary" size="small" link @click="openQuickCreate">
            + 快速新建员工
          </el-button>
        </div>
      </template>

      <template #footer>
        <el-button
          v-if="!disabled"
          type="primary"
          size="small"
          link
          class="quick-create-footer"
          @click="openQuickCreate"
        >
          + 找不到？快速新建员工
        </el-button>
      </template>
    </el-select>

    <el-dialog
      v-model="quickDialogVisible"
      title="快速新建员工"
      width="460px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="quickFormRef" :model="quickForm" label-width="80px" class="quick-form">
        <el-form-item label="姓名" required>
          <el-input v-model="quickForm.name" placeholder="员工姓名" maxlength="64" clearable />
        </el-form-item>
        <el-form-item label="工号" required>
          <el-input
            v-model="quickForm.employeeNo"
            placeholder="员工编号（唯一）"
            maxlength="64"
            clearable
          />
        </el-form-item>
        <el-form-item label="园区" required>
          <el-select
            v-model="quickForm.campusId"
            placeholder="选择园区"
            style="width: 100%"
            :disabled="props.campusId != null"
            @change="onQuickCampusChange"
          >
            <el-option v-for="c in quickCampusOptions" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
          <div v-if="props.campusId != null" class="quick-form-hint">
            已按当前表单的目标部门锁定园区。如需切换园区，请先关闭本窗口并更换目标部门。
          </div>
        </el-form-item>
        <el-form-item label="部门">
          <DepartmentCascader
            v-model="quickForm.departmentId"
            :departments="filteredDepartments"
            :campuses="filteredCampuses"
            placeholder="按园区展开后选择部门（可选）"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="quickForm.remark" type="textarea" :rows="2" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="quickDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="quickSubmitting" @click="submitQuickCreate">
          创建并选中
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import DepartmentCascader from './DepartmentCascader.vue'
import { apiRequest } from '../services/api'

type EmployeeOption = {
  id: number
  employeeNo: string
  name: string
  campusId: number
  department?: { id: number; name: string } | null
}

const props = withDefaults(
  defineProps<{
    employeeId: number | null
    userName: string
    campusId: number | null
    placeholder?: string
    disabled?: boolean
    allowCreate?: boolean
    departments?: Array<{
      id: number
      name: string
      campusId: number
      parentId: number | null
      sortOrder: number
    }>
    campuses?: Array<{ id: number; name: string; sortOrder: number }>
  }>(),
  {
    placeholder: '搜索员工姓名或工号',
    disabled: false,
    allowCreate: false,
    departments: () => [],
    campuses: () => [],
  },
)

const emit = defineEmits<{
  'update:employeeId': [v: number | null]
  'update:userName': [v: string]
  select: [emp: EmployeeOption | null]
}>()

const selectRef = ref<any>(null)
const loading = ref(false)
const options = ref<EmployeeOption[]>([])
const emptyText = computed(() => (loading.value ? '加载中…' : '输入关键词搜索'))

const selectedValue = computed<number | string | null>(() => {
  if (props.employeeId != null) return props.employeeId
  if (props.userName) return props.userName
  return null
})

let searchTimer: ReturnType<typeof setTimeout> | null = null

async function fetchEmployees(keyword: string) {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (keyword.trim()) params.set('keyword', keyword.trim())
    if (props.campusId) params.set('campusId', String(props.campusId))
    params.set('status', 'active')
    params.set('page', '1')
    params.set('pageSize', '20')
    const data = await apiRequest<{ items: EmployeeOption[] }>(
      `/api/employees?${params.toString()}`,
    )
    options.value = data.items ?? []
  } catch (e: any) {
    options.value = []
    ElMessage.error(e?.message ?? '搜索员工失败')
  } finally {
    loading.value = false
  }
}

function onSearch(keyword: string) {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchEmployees(keyword)
  }, 200)
}

function onDropdownToggle(visible: boolean) {
  if (visible && options.value.length === 0) {
    fetchEmployees('')
  }
}

function onSelect(v: number | string | null) {
  if (v == null || v === '') {
    onClear()
    return
  }
  if (typeof v === 'string') {
    emit('update:employeeId', null)
    emit('update:userName', v.trim())
    emit('select', null)
    return
  }
  const found = options.value.find((e) => e.id === v) ?? null
  emit('update:employeeId', v)
  emit('update:userName', found?.name ?? '')
  emit('select', found)
}

function onClear() {
  emit('update:employeeId', null)
  emit('update:userName', '')
  emit('select', null)
}

const quickDialogVisible = ref(false)
const quickSubmitting = ref(false)
const quickFormRef = ref<any>(null)
const quickForm = ref({
  name: '',
  employeeNo: '',
  campusId: null as number | null,
  departmentId: null as number | null,
  remark: '',
})

const quickCampusOptions = computed(() => {
  if (props.campusId != null) {
    return props.campuses.filter((c) => c.id === props.campusId)
  }
  return props.campuses
})

const filteredCampuses = computed(() => quickCampusOptions.value)

const filteredDepartments = computed(() => {
  const cid = quickForm.value.campusId ?? props.campusId
  if (!cid) return props.departments
  return props.departments.filter((d) => d.campusId === cid)
})

function openQuickCreate() {
  quickForm.value = {
    name: '',
    employeeNo: '',
    campusId: props.campusId ?? null,
    departmentId: null,
    remark: '',
  }
  quickDialogVisible.value = true
  ;(selectRef.value as any)?.blur?.()
}

function onQuickCampusChange() {
  quickForm.value.departmentId = null
}

async function submitQuickCreate() {
  const name = quickForm.value.name.trim()
  const employeeNo = quickForm.value.employeeNo.trim()
  const campusId = quickForm.value.campusId
  if (!name) {
    ElMessage.warning('请填写姓名')
    return
  }
  if (!employeeNo) {
    ElMessage.warning('请填写工号')
    return
  }
  if (!campusId) {
    ElMessage.warning('请选择园区')
    return
  }

  quickSubmitting.value = true
  try {
    const res = await apiRequest<{ employee: EmployeeOption }>('/api/employees/quick-create', {
      method: 'POST',
      body: {
        name,
        employeeNo,
        campusId,
        departmentId: quickForm.value.departmentId ?? undefined,
        remark: quickForm.value.remark || undefined,
      },
    })
    const created = res.employee
    options.value = [created, ...options.value.filter((o) => o.id !== created.id)]
    emit('update:employeeId', created.id)
    emit('update:userName', created.name)
    emit('select', created)
    quickDialogVisible.value = false
    ElMessage.success(`员工「${created.name}」已创建`)
  } catch (e: any) {
    ElMessage.error(e?.message ?? '创建员工失败')
  } finally {
    quickSubmitting.value = false
  }
}

watch(
  () => props.employeeId,
  async (id) => {
    if (id == null) return
    if (options.value.some((o) => o.id === id)) return
    try {
      const res = await apiRequest<{ employee: EmployeeOption }>(`/api/employees/${id}`)
      if (res.employee) {
        options.value = [res.employee, ...options.value]
      }
    } catch {
      // ignore — selection may be stale
    }
  },
  { immediate: true },
)

watch(
  () => props.campusId,
  () => {
    options.value = []
  },
)
</script>

<style scoped>
.employee-picker {
  width: 100%;
}
.picker-select {
  width: 100%;
}
.picker-option-name {
  font-weight: 600;
  margin-right: 8px;
}
.picker-option-no {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
.picker-option-dept {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-left: 6px;
}
.empty-tip {
  padding: 12px;
  text-align: center;
}
.empty-tip-text {
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}
.quick-create-footer {
  width: 100%;
  text-align: center;
  padding: 6px 0;
}
.quick-form :deep(.el-form-item) {
  margin-bottom: 14px;
}
</style>
