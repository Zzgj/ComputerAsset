<template>
  <div class="ca-page ca-animate">
    <el-card shadow="never" v-loading="loading">
      <div class="ca-page-title">系统配置</div>
      <div class="ca-page-subtitle" style="margin-bottom: 20px">管理全局业务规则与提醒策略</div>

      <el-form :model="form" label-width="180px" class="config-form">
        <el-form-item label="一人一机规则">
          <el-switch v-model="form.one_person_one_device" />
          <span class="form-hint">开启后出库/借出时将检查是否冲突</span>
        </el-form-item>
        <el-form-item label="默认借用天数">
          <el-input-number v-model="form.default_borrow_days" :min="0" style="width: 200px" />
        </el-form-item>
        <el-form-item label="待领用超时天数">
          <el-input-number v-model="form.waiting_pickup_alert_days" :min="0" style="width: 200px" />
        </el-form-item>
        <el-form-item label="借用到期提前提醒天数">
          <el-input-number v-model="form.borrow_advance_alert_days" :min="0" style="width: 200px" />
        </el-form-item>

        <el-divider content-position="left">签字链接外网地址</el-divider>

        <el-form-item label="外网访问地址">
          <el-input
            v-model="form.external_base_url"
            placeholder="例如 http://公网IP:3000 或 https://assets.example.com"
            style="width: 400px"
            clearable
          />
          <span class="form-hint">设置后，生成签字二维码时可切换「外网」模式</span>
        </el-form-item>
        <div class="external-preview" v-if="form.external_base_url">
          <span class="preview-label">外网签字链接示例：</span>
          <code class="preview-url">{{ form.external_base_url.replace(/\/+$/, '') }}/sign?recordId=...</code>
        </div>
        <div class="external-preview" v-else>
          <span class="preview-label empty">未设置外网地址时，签字链接默认使用当前访问地址（内网）</span>
        </div>
      </el-form>

      <div style="margin-top: 24px; display: flex; gap: 12px">
        <el-button type="primary" @click="save">保存配置</el-button>
        <el-button @click="load">刷新</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { apiRequest } from '../services/api'
import { ElMessage } from 'element-plus'
import { invalidateExternalBaseUrlCache } from '../lib/publicBaseUrl'

const loading = ref(false)
const form = reactive<any>({
  one_person_one_device: true,
  default_borrow_days: 7,
  waiting_pickup_alert_days: 3,
  borrow_advance_alert_days: 1,
  external_base_url: '',
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
    form.external_base_url = String(map.get('external_base_url') ?? '').trim()
  } finally {
    loading.value = false
  }
}

async function save() {
  // 去除尾部斜杠
  const trimmedExternal = String(form.external_base_url ?? '').trim().replace(/\/+$/, '')
  await apiRequest('/api/config', {
    method: 'PUT',
    body: {
      one_person_one_device: form.one_person_one_device,
      default_borrow_days: form.default_borrow_days,
      waiting_pickup_alert_days: form.waiting_pickup_alert_days,
      borrow_advance_alert_days: form.borrow_advance_alert_days,
      external_base_url: trimmedExternal,
    },
  })
  // 刷新前端缓存的外网地址
  invalidateExternalBaseUrlCache()
  ElMessage.success('保存成功')
  await load()
}

onMounted(load)
</script>

<style scoped>
.config-form {
  max-width: 640px;
}

.form-hint {
  color: var(--ca-text-muted);
  font-size: 12px;
  margin-left: 12px;
}

.external-preview {
  margin-left: 180px;
  margin-bottom: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid var(--ca-border-light);
}

.preview-label {
  font-size: 12px;
  color: var(--ca-text-muted);
}

.preview-label.empty {
  font-style: italic;
}

.preview-url {
  font-size: 13px;
  color: #6366f1;
  word-break: break-all;
}
</style>
