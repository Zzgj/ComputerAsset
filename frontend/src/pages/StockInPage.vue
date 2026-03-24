<template>
  <div style="padding: 20px">
    <el-card shadow="never">
      <div style="font-weight: 800; margin-bottom: 10px">入库登记</div>

      <el-form :model="form" label-width="120px" label-position="left">
        <el-form-item label="设备型号模板">
          <el-select v-model="form.templateId" placeholder="选择模板" style="width: 420px">
            <el-option v-for="t in templates" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="电脑编号">
          <el-input v-model="form.assetCode" style="width: 300px" />
          <el-button style="margin-left: 12px" @click="genCode" :loading="genLoading">生成编号</el-button>
        </el-form-item>

        <el-form-item label="序列号">
          <el-input v-model="form.serialNumber" style="width: 420px" />
        </el-form-item>

        <el-form-item label="所属部门">
          <el-select v-model="form.departmentId" placeholder="选择部门" style="width: 420px">
            <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="采购日期">
          <el-date-picker v-model="form.purchaseDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark" :rows="3" style="width: 560px" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit" :loading="submitting">确认入库</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiRequest } from '../services/api'
import { ElMessage } from 'element-plus'

const router = useRouter()

const templates = ref<any[]>([])
const departments = ref<any[]>([])
const genLoading = ref(false)
const submitting = ref(false)

const form = reactive<any>({
  templateId: null as number | null,
  assetCode: '',
  serialNumber: '',
  departmentId: null as number | null,
  purchaseDate: null as string | null,
  remark: '',
})

async function load() {
  const t = await apiRequest<{ items: any[] }>('/api/templates')
  templates.value = t.items ?? []
  const d = await apiRequest<{ items: any[] }>('/api/departments')
  departments.value = d.items ?? []
}

async function genCode() {
  genLoading.value = true
  try {
    const data = await apiRequest<{ assetCode: string }>('/api/assets/generate-code')
    form.assetCode = data.assetCode
  } finally {
    genLoading.value = false
  }
}

async function submit() {
  if (!form.templateId) return ElMessage.error('请选择模板')
  if (!form.assetCode) return ElMessage.error('请生成电脑编号')
  if (!form.serialNumber) return ElMessage.error('请填写序列号')
  if (!form.departmentId) return ElMessage.error('请选择所属部门')

  submitting.value = true
  try {
    const requestId = (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now())
    await apiRequest('/api/assets', {
      method: 'POST',
      body: {
        requestId,
        assetCode: form.assetCode,
        templateId: form.templateId,
        serialNumber: form.serialNumber,
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

