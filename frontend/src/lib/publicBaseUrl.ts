/**
 * 签名链接、二维码等需给「手机或其他电脑」访问的绝对地址。
 * 默认使用当前浏览器访问系统的 origin，例如 http://10.2.254.29:3000。
 * 如确需固定为域名或反向代理地址，可设置非 localhost 的 VITE_PUBLIC_BASE_URL。
 */
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
