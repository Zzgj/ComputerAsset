import { ref, onMounted, onUnmounted } from 'vue'

const IDLE_TIMEOUT = 10 * 60 * 1000
const WARNING_BEFORE = 60 * 1000

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
  const remaining = ref(0)
  let countdownInterval: ReturnType<typeof setInterval> | null = null
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
    resetTimer()
  }

  function continueSession() {
    resetTimer()
  }

  function start() {
    for (const evt of ACTIVITY_EVENTS) {
      document.addEventListener(evt, onActivity, { passive: true })
    }
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
