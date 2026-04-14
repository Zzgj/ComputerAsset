/**
 * 签名链接、二维码等需给「手机或其他电脑」访问的绝对地址。
 * 部署包构建时可设置 VITE_PUBLIC_BASE_URL（如 http://10.2.254.29:3000），
 * 避免局域网用户用内网 IP 打开页面时仍生成 localhost 链接。
 */
export function getConfiguredPublicBaseURL(): string {
  const raw = import.meta.env.VITE_PUBLIC_BASE_URL as string | undefined
  const s = raw != null ? String(raw).trim() : ''
  if (!s) return ''
  return s.replace(/\/+$/, '')
}

export function getPublicBaseURL(): string {
  const configured = getConfiguredPublicBaseURL()
  if (configured) return configured
  if (typeof window !== 'undefined' && window.location?.origin) {
    return String(window.location.origin).replace(/\/+$/, '')
  }
  return ''
}
