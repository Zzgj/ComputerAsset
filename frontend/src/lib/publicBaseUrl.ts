/**
 * 签名链接、二维码等需给「手机或其他电脑」访问的绝对地址。
 * 默认使用当前浏览器访问系统的 origin，例如 http://10.2.254.29:3000。
 * 如确需固定为域名或反向代理地址，可设置非 localhost 的 VITE_PUBLIC_BASE_URL。
 * 管理员还可在系统配置中设置 external_base_url，用于生成外网签字链接。
 */

/** 缓存从 /api/config/external-base-url 获取的外网地址，避免每次生成二维码都请求 */
let cachedExternalBaseUrl = ''
let externalBaseUrlLoaded = false

/** 从后端 SystemConfig 加载 external_base_url（仅调用一次，之后用缓存） */
export async function loadExternalBaseUrl(): Promise<string> {
  if (externalBaseUrlLoaded) return cachedExternalBaseUrl
  try {
    const { apiRequest } = await import('../services/api')
    const data = await apiRequest<{ externalBaseUrl: string }>('/api/config/external-base-url')
    cachedExternalBaseUrl = data.externalBaseUrl?.trim() ?? ''
  } catch {
    // 静默失败：未登录或网络错误时回退到默认行为
  }
  externalBaseUrlLoaded = true
  return cachedExternalBaseUrl
}

/** 强制重新加载（配置变更后调用） */
export function invalidateExternalBaseUrlCache(): void {
  cachedExternalBaseUrl = ''
  externalBaseUrlLoaded = false
}

/** 获取已缓存的外网地址（不触发请求） */
export function getCachedExternalBaseUrl(): string {
  return cachedExternalBaseUrl
}

export function getConfiguredPublicBaseURL(): string {
  const raw = import.meta.env.VITE_PUBLIC_BASE_URL as string | undefined
  const s = raw != null ? String(raw).trim() : ''
  if (!s) return ''
  return s.replace(/\/+$/, '')
}

function isLoopbackOrigin(origin: string): boolean {
  try {
    const url = new URL(origin)
    return url.hostname === '127.0.0.1' || url.hostname === 'localhost' || url.hostname === '::1'
  } catch {
    return false
  }
}

/** 内网地址（当前浏览器 origin 或 VITE_PUBLIC_BASE_URL） */
export function getPublicBaseURL(): string {
  const current =
    typeof window !== 'undefined' && window.location?.origin
      ? String(window.location.origin).replace(/\/+$/, '')
      : ''
  const configured = getConfiguredPublicBaseURL()

  if (!configured) return current
  if (isLoopbackOrigin(configured) && current && !isLoopbackOrigin(current)) {
    return current
  }
  return configured
}

/** 外网地址（从 SystemConfig 加载）；未配置时返回空字符串 */
export function getExternalBaseURL(): string {
  return cachedExternalBaseUrl
}

/**
 * 根据网络模式返回对应的 base URL。
 * @param mode 'internal' | 'external'
 */
export function getBaseUrlForMode(mode: 'internal' | 'external'): string {
  if (mode === 'external' && cachedExternalBaseUrl) {
    return cachedExternalBaseUrl
  }
  return getPublicBaseURL()
}
