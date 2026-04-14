<template>
  <div class="page-wrap">
    <el-card shadow="never" class="intro-card">
      <div class="page-title">入库登记</div>
      <div class="page-subtitle">新设备首次入账：支持电脑/服务器等设备，按设备类型选择模板或手动填写参数并入库。</div>
    </el-card>

    <el-card shadow="never" class="main-card" v-loading="pageLoading">
      <template #header>
        <div class="card-head">
          <span class="section-title">入库信息</span>
          <el-tag type="info" effect="plain" size="small">在库</el-tag>
        </div>
      </template>

      <el-form :model="form" class="in-form" label-width="112px" label-position="right">
        <div class="form-section-label">资产标识</div>
        <el-form-item label="设备类型" required>
          <el-select v-model="form.deviceType" placeholder="请选择设备类型" class="field-lg" @change="onDeviceTypeChange">
            <el-option v-for="o in deviceTypeOptions" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号模板">
          <el-select
            v-model="form.templateId"
            placeholder="可选：选择已登记模板，或留空手动填写"
            class="field-lg"
            filterable
            clearable
            @change="onTemplateChange"
          >
            <el-option v-for="t in filteredTemplates" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="资产编号" required>
          <div class="inline-row">
            <el-input v-model="form.assetCode" class="field-md" placeholder="可点击右侧生成" clearable />
            <el-button @click="genCode" :loading="genLoading">生成编号</el-button>
          </div>
        </el-form-item>
        <el-form-item label="序列号" required>
          <el-input v-model="form.serialNumber" class="field-lg" placeholder="设备机身序列号，需唯一" clearable />
        </el-form-item>

        <el-divider class="section-divider" />

        <div class="form-section-label">设备参数</div>
        <el-form-item label="品牌" :required="!isOtherDeviceType">
          <el-input v-model="form.brand" class="field-lg" placeholder="如：Dell / H3C / Huawei" clearable />
        </el-form-item>
        <el-form-item label="型号" :required="!isOtherDeviceType">
          <el-input v-model="form.model" class="field-lg" placeholder="如：R750 / S6520X-26C-SI" clearable />
        </el-form-item>
        <el-form-item label="操作系统">
          <el-input v-model="form.os" class="field-lg" placeholder="服务器/网络设备可留空" clearable />
        </el-form-item>
        <el-form-item label="CPU">
          <el-input v-model="form.cpu" class="field-lg" placeholder="可选" clearable />
        </el-form-item>
        <el-form-item label="内存">
          <el-input v-model="form.memory" class="field-lg" placeholder="可选" clearable />
        </el-form-item>
        <el-form-item label="存储">
          <el-input v-model="form.storage" class="field-lg" placeholder="可选" clearable />
        </el-form-item>

        <el-divider class="section-divider" />

        <div class="form-section-label">归属与时间</div>
        <el-form-item label="所属部门" required>
          <div class="field-lg">
            <DepartmentCascader v-model="form.departmentId" :departments="departments" :campuses="campuses" />
          </div>
        </el-form-item>
        <el-form-item label="采购日期">
          <el-date-picker
            v-model="form.purchaseDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="不选则按服务端默认"
            class="field-date"
          />
        </el-form-item>

        <el-divider class="section-divider" />

        <div class="form-section-label">其他</div>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark" :rows="3" class="field-xl" placeholder="可选：用途、供应商等说明" />
        </el-form-item>

        <el-form-item class="submit-row">
          <el-button type="primary" size="large" @click="submit" :loading="submitting">确认入库</el-button>
          <el-button size="large" @click="router.push('/assets')">返回资产列表</el-button>
        </el-form-item>
      </el-form>

      <div class="hint-box">
        <div class="hint-title">填写说明</div>
        <ul class="hint-list">
          <li>可按设备类型筛选模板；也可以不选模板，直接手动填写品牌、型号等参数。</li>
          <li>资产编号在系统内唯一；序列号在系统内唯一，请与实物一致。</li>
          <li>部门请按园区展开后点选具体部门（支持选中间层级，如仅选「综合部门」）。</li>
          <li>提交成功后资产状态为「在库」，可在出库/借用页办理领用或借出。</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiRequest } from '../services/api'
import { ElMessage } from 'element-plus'
import DepartmentCascader from '../components/DepartmentCascader.vue'
import { DEVICE_TYPE_OPTIONS } from '../constants/deviceType'
import { readStoredCustomDeviceTypes } from '../lib/customDeviceTypesStorage'

const router = useRouter()

const templates = ref<any[]>([])
const campuses = ref<Array<{ id: number; name: string; sortOrder: number }>>([])
const departments = ref<any[]>([])
const genLoading = ref(false)
const submitting = ref(false)
const pageLoading = ref(true)
const deviceTypeOptions = computed(() => {
  const known = new Set(DEVICE_TYPE_OPTIONS.map((o) => o.value))
  const fromTemplates = [
    ...new Set(templates.value.map((t: any) => String(t.deviceType ?? '').trim()).filter(Boolean)),
  ]
  const fromSession = readStoredCustomDeviceTypes()
  const merged = [...DEVICE_TYPE_OPTIONS]
  for (const v of [...fromSession, ...fromTemplates]) {
    if (!known.has(v)) {
      known.add(v)
      merged.push({ label: v, value: v })
    }
  }
  return merged
})

const form = reactive<any>({
  deviceType: 'laptop',
  templateId: null as number | null,
  assetCode: '',
  serialNumber: '',
  brand: '',
  model: '',
  os: '',
  cpu: '',
  memory: '',
  storage: '',
  departmentId: null as number | null,
  purchaseDate: null as string | null,
  remark: '',
})
const isOtherDeviceType = computed(() => form.deviceType === 'other')
const filteredTemplates = computed(() =>
  templates.value.filter((t) => !form.deviceType || String(t.deviceType) === String(form.deviceType)),
)

function onTemplateChange() {
  const id = Number(form.templateId || 0)
  const t = templates.value.find((x) => Number(x.id) === id)
  if (!t) return
  if (t.deviceType) form.deviceType = t.deviceType
  form.brand = t.brand ?? ''
  form.model = t.model ?? ''
  form.os = t.os ?? ''
  form.cpu = t.cpu ?? ''
  form.memory = t.memory ?? ''
  form.storage = t.storage ?? ''
}

async function onDeviceTypeChange() {
  form.templateId = null
  form.brand = ''
  form.model = ''
  form.os = ''
  form.cpu = ''
  form.memory = ''
  form.storage = ''
  await genCode()
}

async function load() {
  pageLoading.value = true
  try {
    const [t, d, c] = await Promise.all([
      apiRequest<{ items: any[] }>('/api/templates'),
      apiRequest<{ items: any[] }>('/api/departments'),
      apiRequest<{ items: any[] }>('/api/campuses'),
    ])
    templates.value = t.items ?? []
    departments.value = d.items ?? []
    campuses.value = c.items ?? []
  } finally {
    pageLoading.value = false
  }
}

async function genCode() {
  genLoading.value = true
  try {
    const qs = form.deviceType ? `?deviceType=${encodeURIComponent(form.deviceType)}` : ''
    const data = await apiRequest<{ assetCode: string }>(`/api/assets/generate-code${qs}`)
    form.assetCode = data.assetCode
  } finally {
    genLoading.value = false
  }
}

async function submit() {
  if (!form.deviceType) return ElMessage.error('请选择设备类型')
  if (!form.assetCode) return ElMessage.error('请生成资产编号')
  if (!form.serialNumber) return ElMessage.error('请填写序列号')
  if (!isOtherDeviceType.value && !String(form.brand ?? '').trim()) return ElMessage.error('请填写品牌')
  if (!isOtherDeviceType.value && !String(form.model ?? '').trim()) return ElMessage.error('请填写型号')
  if (!form.departmentId) return ElMessage.error('请选择所属部门')

  submitting.value = true
  try {
    const requestId = (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now())
    await apiRequest('/api/assets', {
      method: 'POST',
      body: {
        requestId,
        assetCode: form.assetCode,
        templateId: form.templateId ?? undefined,
        deviceType: form.deviceType,
        serialNumber: form.serialNumber,
        brand: String(form.brand ?? '').trim(),
        model: String(form.model ?? '').trim(),
        os: form.os || '',
        cpu: form.cpu || '',
        memory: form.memory || '',
        storage: form.storage || '',
        departmentId: form.departmentId,
        purchaseDate: form.purchaseDate ? new Date(form.purchaseDate).toISOString() : undefined,
        remark: form.remark || undefined,
      },
    })
    ElMessage.success('入库成功')
    router.push('/assets')
  } catch (e: any) {
    ElMessage.error(e?.message ?? '入库失败')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await load()
  await genCode()
})
</script>

<style scoped>
.page-wrap {
  padding: 24px;
  display: grid;
  gap: 20px;
  max-width: 920px;
  animation: ca-fade-in 0.4s ease-out;
}

.intro-card {
  border-radius: var(--ca-radius);
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
}

.main-card {
  border-radius: var(--ca-radius);
}

.card-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title {
  font-weight: 700;
  font-size: 15px;
}

.form-section-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--ca-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 12px 2px;
}

.section-divider {
  margin: 8px 0 20px;
}

.in-form {
  max-width: 640px;
}

.inline-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.field-md {
  width: 260px;
  max-width: 100%;
}

.field-lg {
  width: 100%;
  max-width: 420px;
}

.field-xl {
  width: 100%;
  max-width: 520px;
}

.field-date {
  width: 100%;
  max-width: 240px;
}

.submit-row {
  margin-top: 8px;
  margin-bottom: 0;
}

.submit-row :deep(.el-form-item__content) {
  gap: 12px;
  flex-wrap: wrap;
}

.hint-box {
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: var(--ca-radius-sm);
  font-size: 13px;
  color: var(--ca-text-secondary);
  background: #f8fafc;
  border: 1px solid var(--ca-border-light);
  line-height: 1.6;
}

.hint-title {
  font-weight: 600;
  color: var(--ca-text-primary);
  margin-bottom: 8px;
}

.hint-list {
  margin: 0;
  padding-left: 1.1em;
}

.hint-list li + li {
  margin-top: 4px;
}
</style>
