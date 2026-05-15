<template>
  <div class="login-page">
    <div class="login-left">
      <canvas ref="canvasRef" class="particle-canvas"></canvas>
      <div class="brand-content">
        <div class="brand-icon stagger-item" style="--i:0">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <h1 class="brand-title stagger-item" style="--i:1">ComputerAsset</h1>
        <p class="brand-subtitle stagger-item" style="--i:2">企业电脑资产管理系统</p>
        <div class="brand-features stagger-item" style="--i:3">
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
          <div class="field form-stagger" style="--i:0">
            <label class="field-label" :class="{ active: userFocus }">用户名</label>
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

          <div class="field form-stagger" style="--i:1">
            <label class="field-label" :class="{ active: passFocus }">密码</label>
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

          <div v-if="kickedMsg" class="kicked-msg form-stagger" style="--i:2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            {{ kickedMsg }}
          </div>

          <div v-if="error" class="error-msg form-stagger" style="--i:2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {{ error }}
          </div>

          <button type="submit" class="login-btn form-stagger" style="--i:2" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? '登录中...' : '登 录' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
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
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let resizeHandler: (() => void) | null = null

onMounted(() => {
  const msg = route.query.msg
  if (typeof msg === 'string' && msg) {
    kickedMsg.value = msg
  }
  initParticles()
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
})

function initParticles() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let w = 0, h = 0
  function resize() {
    const parent = canvas!.parentElement!
    w = canvas!.width = parent.clientWidth
    h = canvas!.height = parent.clientHeight
  }
  resize()
  resizeHandler = resize
  window.addEventListener('resize', resize)

  const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = []
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    })
  }

  function draw() {
    ctx!.clearRect(0, 0, w, h)
    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > w) p.vx *= -1
      if (p.y < 0 || p.y > h) p.vy *= -1

      ctx!.beginPath()
      ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx!.fillStyle = 'rgba(199, 210, 254, 0.3)'
      ctx!.fill()
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const pi = particles[i]!
        const pj = particles[j]!
        const dx = pi.x - pj.x
        const dy = pi.y - pj.y
        const distSq = dx * dx + dy * dy
        if (distSq < 14400) {
          const dist = Math.sqrt(distSq)
          ctx!.beginPath()
          ctx!.moveTo(pi.x, pi.y)
          ctx!.lineTo(pj.x, pj.y)
          ctx!.strokeStyle = `rgba(199, 210, 254, ${0.15 * (1 - dist / 120)})`
          ctx!.lineWidth = 0.5
          ctx!.stroke()
        }
      }
    }
    animId = requestAnimationFrame(draw)
  }
  draw()
}

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

.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
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
  animation: float-slow 8s ease-in-out infinite;
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
  animation: float-slow 6s ease-in-out infinite reverse;
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.brand-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.stagger-item {
  opacity: 0;
  animation: brand-enter 0.6s var(--ca-ease-out-expo) forwards;
  animation-delay: calc(var(--i) * 120ms + 200ms);
}

@keyframes brand-enter {
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
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
  animation: form-slide-in 0.5s var(--ca-ease-out-expo) 0.3s both;
}

@keyframes form-slide-in {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.form-stagger {
  opacity: 0;
  animation: field-enter 0.4s var(--ca-ease-out-expo) forwards;
  animation-delay: calc(var(--i) * 80ms + 600ms);
}

@keyframes field-enter {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
  transition: color var(--ca-transition);
}

.field-label.active {
  color: var(--ca-primary);
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
  animation: focus-glow 0.6s ease-out;
}

@keyframes focus-glow {
  0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.3); }
  100% { box-shadow: 0 0 0 3px var(--ca-primary-bg); }
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
  background: linear-gradient(90deg, var(--ca-primary) 0%, #6366f1 50%, var(--ca-primary) 100%);
  background-size: 200% 100%;
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
  position: relative;
  overflow: hidden;
}

.login-btn:hover:not(:disabled) {
  background-position: 100% 0;
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
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-right-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
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
