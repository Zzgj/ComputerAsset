<template>
  <div style="padding: 20px">
    <el-card shadow="never" v-loading="loading">
      <div style="font-weight: 800; margin-bottom: 12px">系统配置</div>

      <el-form :model="form" label-width="180px">
        <el-form-item label="一人一机规则">
          <el-switch v-model="form.one_person_one_device" />
        </el-form-item>
        <el-form-item label="默认借用天数">
          <el-input-number v-model="form.default_borrow_days" :min="0" style="width: 220px" />
        </el-form-item>
        <el-form-item label="待领用超时天数">
          <el-input-number v-model="form.waiting_pickup_alert_days" :min="0" style="width: 220px" />
        </el-form-item>
        <el-form-item label="借用到期提前提醒天数">
          <el-input-number v-model="form.borrow_advance_alert_days" :min="0" style="width: 220px" />
        </el-form-item>
      </el-form>

      <div style="margin-top: 16px; display: flex; gap: 12px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="load">刷新</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { apiRequest } from '../services/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const form = reactive<any>({
  one_person_one_device: true,
  default_borrow_days: 7,
  waiting_pickup_alert_days: 3,
  borrow_advance_alert_days: 1,
})

async function load() {
  loading.value = true
  try {
    const data = await apiRequest<{ items: any[] }>('/api/config')
    const map = new Map((data.items ?? []).map((x) => [x.configKey, x.configValue]))
    form.one_person_one_device = String(map.get('one_person_one_device') ?? 'true') === 'true'
    form.default_borrow_days = Number(map.get('default_borrow_days') ?? 7)
    form.waiting_pickup_alert_days = Number(map.get('waiting_pickup_alert_days') ?? 3)
    form.borrow_advance_alert_days = Number(map.get('borrow_advance_alert_days') ?? 1)
  } finally {
    loading.value = false
  }
}

async function save() {
  await apiRequest('/api/config', {
    method: 'PUT',
    body: {
      one_person_one_device: form.one_person_one_device,
      default_borrow_days: form.default_borrow_days,
      waiting_pickup_alert_days: form.waiting_pickup_alert_days,
      borrow_advance_alert_days: form.borrow_advance_alert_days,
    },
  })
  ElMessage.success('保存成功')
  await load()
}

onMounted(load)
</script>

