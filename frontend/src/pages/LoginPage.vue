<template>
  <div style="max-width: 420px; margin: 64px auto; padding: 24px; border: 1px solid #eee; border-radius: 12px">
    <h2 style="margin: 0 0 16px">登录</h2>

    <div style="display: grid; gap: 12px">
      <label>
        <div style="font-size: 14px; margin-bottom: 6px">用户名</div>
        <input v-model="username" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px" />
      </label>

      <label>
        <div style="font-size: 14px; margin-bottom: 6px">密码</div>
        <input
          v-model="password"
          type="password"
          style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px"
        />
      </label>

      <button
        style="padding: 10px 14px; border-radius: 8px; border: 1px solid #ddd; background: #fff; cursor: pointer"
        @click="onLogin"
        :disabled="loading"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <div v-if="error" style="color: #b00; font-size: 13px">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('admin')
const password = ref('admin123')
const loading = ref(false)
const error = ref<string | null>(null)

async function onLogin() {
  loading.value = true
  error.value = null
  try {
    await authStore.login(username.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e?.message ?? '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

