import { ref, type Ref } from 'vue'
import { ElMessage } from 'element-plus'

import type { ApiError } from '../services/api'

/**
 * 把"调用 API → 处理 loading → 出错弹 ElMessage"的样板收敛到一处。
 *
 * 用法：
 *   const { run, loading, error } = useApi()
 *   await run(() => apiRequest('/api/...'))            // 出错自动弹提示
 *   await run(() => apiRequest('/api/...'), { silent: true })  // 自己 try/catch
 *
 * 业务侧可读取 loading 给 v-loading / 按钮 disabled。
 */
type RunOptions = {
  /** true 时不弹 ElMessage，由调用方自行处理；默认 false */
  silent?: boolean
  /** 自定义错误提示前缀，例如 "保存失败" */
  errorPrefix?: string
}

export type UseApi = {
  loading: Ref<boolean>
  error: Ref<ApiError | null>
  run: <T>(fn: () => Promise<T>, opts?: RunOptions) => Promise<T | undefined>
}

export function useApi(): UseApi {
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  async function run<T>(fn: () => Promise<T>, opts: RunOptions = {}): Promise<T | undefined> {
    loading.value = true
    error.value = null
    try {
      return await fn()
    } catch (e) {
      const err = e as ApiError
      error.value = err
      if (!opts.silent) {
        const msg = opts.errorPrefix ? `${opts.errorPrefix}：${err.message}` : err.message
        ElMessage.error(msg || '请求失败')
      }
      return undefined
    } finally {
      loading.value = false
    }
  }

  return { loading, error, run }
}
