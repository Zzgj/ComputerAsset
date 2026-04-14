<template>
  <div class="login-page">
    <div class="login-left">
      <div class="brand-content">
        <div class="brand-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <h1 class="brand-title">ComputerAsset</h1>
        <p class="brand-subtitle">企业电脑资产管理系统</p>
        <div class="brand-features">
          <div class="feature-item">
            <div class="feature-dot"></div>
            <span>全生命周期管理</span>
          </div>
          <div class="feature-item">
            <div class="feature-dot"></div>
            <span>可视化仪表盘</span>
          </div>
          <div class="feature-item">
            <div class="feature-dot"></div>
            <span>完整审计追踪</span>
          </div>
        </div>
      </div>
      <div class="brand-footer">
        <span>Powered by Vue 3 + Express + Prisma</span>
        <span v-if="appVersion" class="login-version">v{{ appVersion }}</span>
      </div>
    </div>

    <div class="login-right">
      <div class="login-form-wrap">
        <div class="form-header">
          <h2 class="form-title">欢迎回来</h2>
          <p class="form-desc">请输入您的账号信息登录系统</p>
        </div>

        <form class="login-form" @submit.prevent="onLogin">
          <div class="field">
            <label class="field-label">用户名</label>
            <div class="input-wrap" :class="{ focused: userFocus }">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                v-model="username"
                autocomplete="username"
                placeholder="请输入用户名"
                @focus="userFocus = true"
                @blur="userFocus = false"
              />
            </div>
          </div>

          <div class="field">
            <label class="field-label">密码</label>
            <div class="input-wrap" :class="{ focused: passFocus }">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                v-model="password"
                type="password"
                autocomplete="current-password"
                placeholder="请输入密码"
                @focus="passFocus = true"
                @blur="passFocus = false"
              />
            </div>
          </div>

          <div v-if="kickedMsg" class="kicked-msg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            {{ kickedMsg }}
          </div>

          <div v-if="error" class="error-msg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {{ error }}
          </div>

          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? '登录中...' : '登 录' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import appPkg from '../../package.json'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const kickedMsg = ref<string | null>(null)
const userFocus = ref(false)
const passFocus = ref(false)

const appVersion = (appPkg as { version?: string }).version ?? ''

onMounted(() => {
  const msg = route.query.msg
  if (typeof msg === 'string' && msg) {
    kickedMsg.value = msg
  }
})

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

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
}

.login-left {
  flex: 0 0 480px;
  background: var(--ca-bg-sidebar);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  top: -120px;
  right: -80px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
}

.login-left::after {
  content: '';
  position: absolute;
  bottom: -60px;
  left: -60px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
}

.brand-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.brand-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28px;
  color: #c7d2fe;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-title {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.brand-subtitle {
  font-size: 16px;
  color: #a5b4fc;
  margin: 0 0 48px;
  font-weight: 500;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #c7d2fe;
  font-size: 14px;
  font-weight: 500;
}

.feature-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #818cf8;
  flex-shrink: 0;
}

.brand-footer {
  position: absolute;
  bottom: 32px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: rgba(165, 180, 252, 0.5);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.login-version {
  font-size: 11px;
  font-weight: 600;
  color: rgba(199, 210, 254, 0.85);
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: var(--ca-bg);
}

.login-form-wrap {
  width: 100%;
  max-width: 400px;
  animation: ca-fade-in 0.5s ease-out;
}

.form-header {
  margin-bottom: 36px;
}

.form-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--ca-text-primary);
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.form-desc {
  font-size: 14px;
  color: var(--ca-text-secondary);
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ca-text-primary);
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  height: 48px;
  border-radius: var(--ca-radius);
  border: 1.5px solid var(--ca-border);
  background: #fff;
  transition: all var(--ca-transition);
}

.input-wrap.focused {
  border-color: var(--ca-primary);
  box-shadow: 0 0 0 3px var(--ca-primary-bg);
}

.input-icon {
  color: var(--ca-text-muted);
  flex-shrink: 0;
  transition: color var(--ca-transition);
}

.input-wrap.focused .input-icon {
  color: var(--ca-primary);
}

.input-wrap input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: var(--ca-text-primary);
  font-family: var(--ca-font);
  line-height: 1;
}

.input-wrap input::placeholder {
  color: var(--ca-text-muted);
}

.kicked-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #92400e;
  font-size: 13px;
  padding: 10px 14px;
  background: var(--ca-warning-bg);
  border-radius: var(--ca-radius-sm);
  border: 1px solid var(--ca-warning-light);
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ca-danger);
  font-size: 13px;
  padding: 10px 14px;
  background: var(--ca-danger-bg);
  border-radius: var(--ca-radius-sm);
  border: 1px solid var(--ca-danger-light);
}

.login-btn {
  height: 48px;
  border-radius: var(--ca-radius);
  border: none;
  background: var(--ca-primary);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--ca-font);
  cursor: pointer;
  transition: all var(--ca-transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

.login-btn:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .login-left {
    display: none;
  }
}
</style>
