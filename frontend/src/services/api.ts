export type ApiError = {
  status?: number
  code?: string
  message: string
  details?: unknown
}

/**
 * - 开发（Vite）：默认返回空 → 请求走「当前页同源」如 http://localhost:5173/api/...，
 *   由 vite.config 里 proxy 转发到后端，浏览器地址栏不会出现 :3000。
 * - 生产：默认空字符串，适合前后端同域部署；跨域请设 VITE_API_BASE_URL。
 */
export function getApiBaseURL(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (fromEnv != null && String(fromEnv).trim() !== '') return String(fromEnv).trim()
  if (import.meta.env.DEV) return ''
  return ''
}

function getAuthToken(): string | null {
  return localStorage.getItem('token')
}

type ApiRequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
  headers?: Record<string, string>
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const token = typeof options.token !== 'undefined' ? options.token : getAuthToken()

  const res = await fetch(`${getApiBaseURL()}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  const contentType = res.headers.get('content-type') ?? ''
  let payload: any
  try {
    payload = contentType.includes('application/json') ? await res.json() : await res.text()
  } catch {
    payload = null
  }

  if (!res.ok) {
    if (res.status === 401 && !path.includes('/auth/login')) {
      localStorage.removeItem('token')
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    const message =
      payload?.error?.message ?? payload?.message ?? `请求失败 (${res.status})`
    throw {
      status: res.status,
      code: payload?.error?.code,
      message,
      details: payload?.error?.details,
    } satisfies ApiError
  }

  return payload as T
}

