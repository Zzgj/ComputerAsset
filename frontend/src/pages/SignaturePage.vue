<template>
  <div class="sign-page" :class="{ 'sign-fullscreen': isFullscreen }">
    <div class="sign-card" v-if="loading">
      <div class="sign-header">
        <h2>正在校验签字记录</h2>
        <p>请稍候</p>
      </div>
    </div>

    <div class="sign-card" :class="{ 'fullscreen-card': isFullscreen }" v-else-if="!submitted && !errorMsg">
      <div class="sign-header" v-show="!isFullscreen">
        <h2>{{ signTitle }}</h2>
        <p>{{ signSubtitle }}</p>
      </div>

      <div class="info-section" v-show="!isFullscreen">
        <div class="info-row"><span class="info-label">资产编号</span><span class="info-value">{{ info.assetCode }}</span></div>
        <div class="info-row"><span class="info-label">领用人</span><span class="info-value">{{ info.userName }}</span></div>
        <div class="info-row"><span class="info-label">部门</span><span class="info-value">{{ info.department }}</span></div>
        <div class="info-row"><span class="info-label">领用时间</span><span class="info-value">{{ info.time }}</span></div>
        <div class="info-row" v-if="info.remark"><span class="info-label">备注</span><span class="info-value">{{ info.remark }}</span></div>
      </div>

      <div v-if="signKind === 'transfer' && !isFullscreen" class="transfer-warning">
        <div class="transfer-warning-text">请勿私下交接资产，必须由 IT 部门介入完成调拨流程</div>
      </div>

      <div class="sign-section" :class="{ 'sign-section-fullscreen': isFullscreen }">
        <div class="sign-label-row" v-show="!isFullscreen">
          <div class="sign-label">请在下方区域手写签名</div>
          <el-button text size="small" @click="toggleFullscreen" class="fullscreen-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
              <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
              <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
              <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
            </svg>
            全屏签名
          </el-button>
        </div>

        <div class="canvas-wrapper" :class="{ 'canvas-wrapper-fullscreen': isFullscreen }">
          <canvas
            ref="canvasRef"
            class="sign-canvas"
            :class="{ 'sign-canvas-fullscreen': isFullscreen }"
            @mousedown="startDraw"
            @mousemove="draw"
            @mouseup="endDraw"
            @mouseleave="endDraw"
            @touchstart.prevent="startDrawTouch"
            @touchmove.prevent="drawTouch"
            @touchend="endDraw"
          />
          <div v-if="isFullscreen" class="fullscreen-toolbar">
            <el-button @click="clearCanvas" size="small">清除重签</el-button>
            <el-button text size="small" @click="toggleFullscreen" class="fullscreen-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
              </svg>
              退出全屏
            </el-button>
            <el-button type="primary" :loading="submitting" @click="submitSignature" :disabled="!canSubmitSignature" size="small">确认签名</el-button>
          </div>
        </div>

        <div v-if="signKind === 'transfer'" class="acknowledge-check">
          <el-checkbox v-model="acknowledged">我已知晓：资产交接必须由 IT 部门介入，不得私下进行</el-checkbox>
        </div>
        <div class="sign-actions" v-show="!isFullscreen">
          <el-button @click="clearCanvas">清除重签</el-button>
          <el-button type="primary" :loading="submitting" @click="submitSignature" :disabled="!canSubmitSignature">确认签名并提交</el-button>
        </div>
      </div>
    </div>

    <div class="sign-card success-card" v-else-if="submitted">
      <div class="success-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
      <h2>签名提交成功</h2>
      <p>{{ submittedMessage }}</p>
    </div>

    <div class="sign-card" v-if="!loading && errorMsg">
      <div class="error-box">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { apiRequest } from '../services/api'

const route = useRoute()

const info = ref({
  recordId: '',
  assetCode: '',
  userName: '',
  department: '',
  time: '',
  remark: '',
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const drawing = ref(false)
const hasDrawn = ref(false)
const acknowledged = ref(false)
const loading = ref(false)
const submitting = ref(false)
const submitted = ref(false)
const submittedMessage = ref('领用确认已完成，可关闭此页面')
const errorMsg = ref('')
const isFullscreen = ref(false)

const signKind = ref('')
const signTitle = computed(() =>
  signKind.value === 'transfer' ? '电脑资产调拨确认' : '电脑资产领用/借用确认',
)
const signSubtitle = computed(() =>
  signKind.value === 'transfer' ? '请核对调拨信息并手写签名确认' : '请核对以下信息并手写签名确认',
)
const canSubmitSignature = computed(() => {
  if (!hasDrawn.value) return false
  if (signKind.value === 'transfer' && !acknowledged.value) return false
  return true
})

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  // 使用 devicePixelRatio 提高清晰度
  const dpr = window.devicePixelRatio || 1
  const w = canvas.offsetWidth
  // 全屏模式下 canvas 高度由 flex 撑开，读 offsetHeight；非全屏固定 200px
  let h = 200
  if (isFullscreen.value) {
    h = canvas.offsetHeight
    // flex 布局可能尚未完成，用视口高度兜底
    if (!h || h < 50) h = window.innerHeight - 120
  }
  canvas.width = w * dpr
  canvas.height = h * dpr
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  // 等待 DOM 更新 + 浏览器布局完成后重新初始化画布尺寸
  nextTick(() => {
    requestAnimationFrame(() => {
      initCanvas()
      hasDrawn.value = false
    })
  })
}

onMounted(async () => {
  const q = route.query
  signKind.value = String(q.kind ?? '').trim()
  info.value = {
    recordId: String(q.recordId ?? ''),
    assetCode: String(q.assetCode ?? ''),
    userName: String(q.userName ?? ''),
    department: String(q.department ?? ''),
    time: String(q.time ?? ''),
    remark: String(q.remark ?? ''),
  }

  if (!info.value.recordId) {
    errorMsg.value = '缺少领用记录信息，请通过出库页面生成的二维码访问'
    return
  }

  await loadRecordState()
  if (submitted.value || errorMsg.value) return

  initCanvas()

  // 自动检测移动端，提示可全屏
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) && !isFullscreen.value) {
    // 不自动进入全屏，但提示用户
    setTimeout(() => {
      ElMessage.info({
        message: '点击「全屏签名」可获得更大书写区域',
        duration: 4000,
      })
    }, 500)
  }
})

onUnmounted(() => {
  isFullscreen.value = false
})

async function loadRecordState() {
  loading.value = true
  try {
    const data = await apiRequest<{ record: any }>(
      `/api/operations/signature-record/${Number(info.value.recordId)}`,
      { token: null },
    )
    const record = data.record
    if (record?.signed) {
      submitted.value = true
      submittedMessage.value = '该签字已完成，链接已失效'
      return
    }
    if (record?.asset?.assetCode) info.value.assetCode = record.asset.assetCode
    if (record?.userName) info.value.userName = record.userName
    if (record?.department) {
      const dept = record.department
      const campus = dept.campus?.name ? `${dept.campus.name} / ` : ''
      info.value.department = `${campus}${dept.name ?? ''}`
    }
    if (record?.actionDate) info.value.time = new Date(record.actionDate).toLocaleString()
    info.value.remark = record?.remark ?? info.value.remark
    signKind.value = record?.action === 'transfer' ? 'transfer' : signKind.value
  } catch (e: any) {
    errorMsg.value = e?.message ?? '签字记录无效或已过期'
  } finally {
    loading.value = false
  }
}

function getCtx() {
  return canvasRef.value?.getContext('2d') ?? null
}

function getCanvasPoint(clientX: number, clientY: number) {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }
  const rect = canvas.getBoundingClientRect()
  // canvas 内部尺寸 = offsetWidth * dpr，但 ctx.scale(dpr,dpr) 后绘图坐标 = CSS 像素
  // getBoundingClientRect 返回 CSS 像素，所以直接用即可
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  }
}

function startDraw(e: MouseEvent) {
  drawing.value = true
  const ctx = getCtx()
  if (!ctx) return
  const pt = getCanvasPoint(e.clientX, e.clientY)
  ctx.beginPath()
  ctx.moveTo(pt.x, pt.y)
}

function draw(e: MouseEvent) {
  if (!drawing.value) return
  const ctx = getCtx()
  if (!ctx) return
  const pt = getCanvasPoint(e.clientX, e.clientY)
  ctx.lineTo(pt.x, pt.y)
  ctx.stroke()
  hasDrawn.value = true
}

function startDrawTouch(e: TouchEvent) {
  drawing.value = true
  const ctx = getCtx()
  if (!ctx || !e.touches[0]) return
  const pt = getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY)
  ctx.beginPath()
  ctx.moveTo(pt.x, pt.y)
}

function drawTouch(e: TouchEvent) {
  if (!drawing.value) return
  const ctx = getCtx()
  if (!ctx || !e.touches[0]) return
  const pt = getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY)
  ctx.lineTo(pt.x, pt.y)
  ctx.stroke()
  hasDrawn.value = true
}

function endDraw() {
  drawing.value = false
}

function clearCanvas() {
  const canvas = canvasRef.value
  const ctx = getCtx()
  if (!canvas || !ctx) return
  const dpr = window.devicePixelRatio || 1
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr)
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  hasDrawn.value = false
}

async function submitSignature() {
  if (!canSubmitSignature.value) {
    if (signKind.value === 'transfer' && !acknowledged.value) {
      return ElMessage.warning('请先勾选"我已知晓"确认框')
    }
    return ElMessage.warning('请先手写签名')
  }
  const canvas = canvasRef.value
  if (!canvas) return

  const dataUrl = canvas.toDataURL('image/png')
  submitting.value = true
  try {
    await apiRequest('/api/operations/confirm-signature', {
      method: 'POST',
      token: null,
      body: {
        recordId: Number(info.value.recordId),
        signatureImage: dataUrl,
      },
    })
    submitted.value = true
    submittedMessage.value = '领用确认已完成，可关闭此页面'
    isFullscreen.value = false
  } catch (e: any) {
    if (e?.code === 'SIGNATURE_ALREADY_COMPLETED' || e?.status === 409) {
      submitted.value = true
      submittedMessage.value = '该签字已完成，链接已失效'
    } else {
      ElMessage.error(e?.message ?? '提交签名失败')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.sign-page {
  min-height: 100vh;
  background: var(--ca-bg);
  display: flex;
  justify-content: center;
  padding: 24px 16px;
}

.sign-page.sign-fullscreen {
  padding: 0;
  background: #fff;
}

.sign-card {
  width: 100%;
  max-width: 540px;
  background: #fff;
  border-radius: var(--ca-radius-lg);
  box-shadow: var(--ca-shadow-md);
  padding: 32px 24px;
  align-self: flex-start;
}

.sign-card.fullscreen-card {
  max-width: none;
  width: 100%;
  height: 100vh;
  border-radius: 0;
  box-shadow: none;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.sign-header {
  text-align: center;
  margin-bottom: 24px;
}

.sign-header h2 {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 8px;
  color: var(--ca-text-primary);
}

.sign-header p {
  font-size: 14px;
  color: var(--ca-text-secondary);
  margin: 0;
}

.info-section {
  background: #f8fafc;
  border-radius: var(--ca-radius-sm);
  padding: 16px;
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid var(--ca-border-light);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  width: 80px;
  flex-shrink: 0;
  color: var(--ca-text-secondary);
  font-size: 13px;
}

.info-value {
  flex: 1;
  font-weight: 600;
  color: var(--ca-text-primary);
  font-size: 14px;
}

.sign-section {
  margin-top: 16px;
}

.sign-section-fullscreen {
  margin-top: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sign-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.sign-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ca-text-primary);
}

.fullscreen-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #6366f1;
  font-size: 13px;
}

.canvas-wrapper {
  position: relative;
}

.canvas-wrapper-fullscreen {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sign-canvas {
  width: 100%;
  height: 200px;
  border: 2px dashed var(--ca-border);
  border-radius: var(--ca-radius-sm);
  cursor: crosshair;
  touch-action: none;
}

.sign-canvas-fullscreen {
  flex: 1;
  height: auto;
  border: 2px solid var(--ca-border);
  border-radius: 8px;
}

.fullscreen-toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 10px 0 4px;
}

.transfer-warning {
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: var(--ca-radius-sm);
  padding: 12px 16px;
  margin-bottom: 20px;
  text-align: center;
}

.transfer-warning-text {
  color: #f56c6c;
  font-weight: 700;
  font-size: 14px;
}

.acknowledge-check {
  margin: 14px 0 0;
  padding: 10px 12px;
  background: #fff7e6;
  border: 1px solid #f5dab1;
  border-radius: var(--ca-radius-sm);
}

.sign-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.success-card {
  text-align: center;
}

.success-icon {
  margin-bottom: 16px;
}

.success-card h2 {
  font-size: 20px;
  font-weight: 700;
  color: #10b981;
  margin: 0 0 8px;
}

.success-card p {
  color: var(--ca-text-secondary);
  margin: 0;
}

.error-box {
  color: var(--ca-danger);
  text-align: center;
  padding: 16px;
}
</style>
