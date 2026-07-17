import { onScopeDispose, ref, watch, type Ref } from 'vue'

export function useCountUp(target: Ref<number>, duration = 800) {
  const display = ref(0)
  let raf = 0

  function animate(from: number, to: number) {
    cancelAnimationFrame(raf)
    if (to === 0) { display.value = 0; return }
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      display.value = Math.round(from + (to - from) * ease)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }

  watch(target, (val, old) => animate(old ?? 0, val), { immediate: true })

  onScopeDispose(() => cancelAnimationFrame(raf))

  return display
}
