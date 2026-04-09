import { ref, onMounted, onUnmounted } from 'vue'

const IDLE_TIMEOUT = 10 * 60 * 1000
const WARNING_BEFORE = 60 * 1000
const THROTTLE_MS = 2000

const ACTIVITY_EVENTS: (keyof DocumentEventMap)[] = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click',
  'wheel',
]

export function useIdleTimer(onWarning: () => void, onTimeout: () => void) {
  let idleTimer: ReturnType<typeof setTimeout> | null = null
  let warningTimer: ReturnType<typeof setTimeout> | null = null
  let countdownInterval: ReturnType<typeof setInterval> | null = null
  let lastActivity = 0

  const remaining = ref(0)
  const isWarning = ref(false)

  function clearTimers() {
    if (idleTimer) { clearTimeout(idleTimer); idleTimer = null }
    if (warningTimer) { clearTimeout(warningTimer); warningTimer = null }
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null }
  }

  function resetTimer() {
    clearTimers()
    isWarning.value = false
    remaining.value = 0

    warningTimer = setTimeout(() => {
      isWarning.value = true
      remaining.value = Math.ceil(WARNING_BEFORE / 1000)
      onWarning()

      countdownInterval = setInterval(() => {
        remaining.value--
        if (remaining.value <= 0 && countdownInterval) {
          clearInterval(countdownInterval)
          countdownInterval = null
        }
      }, 1000)
    }, IDLE_TIMEOUT - WARNING_BEFORE)

    idleTimer = setTimeout(() => {
      clearTimers()
      isWarning.value = false
      onTimeout()
    }, IDLE_TIMEOUT)
  }

  function onActivity() {
    if (isWarning.value) return
    const now = Date.now()
    if (now - lastActivity < THROTTLE_MS) return
    lastActivity = now
    resetTimer()
  }

  function continueSession() {
    lastActivity = Date.now()
    resetTimer()
  }

  function start() {
    for (const evt of ACTIVITY_EVENTS) {
      document.addEventListener(evt, onActivity, { passive: true })
    }
    lastActivity = Date.now()
    resetTimer()
  }

  function stop() {
    clearTimers()
    isWarning.value = false
    for (const evt of ACTIVITY_EVENTS) {
      document.removeEventListener(evt, onActivity)
    }
  }

  onMounted(start)
  onUnmounted(stop)

  return { isWarning, remaining, continueSession, stop, start }
}
