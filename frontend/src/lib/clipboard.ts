import { ElMessage } from 'element-plus'

/**
 * 复制到剪贴板。非 HTTPS 或部分内网浏览器不支持 navigator.clipboard 时使用降级方案。
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  const value = String(text ?? '')
  if (!value) return false

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    // fall through
  }

  try {
    const ta = document.createElement('textarea')
    ta.value = value
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    ta.style.top = '0'
    document.body.appendChild(ta)
    ta.select()
    ta.setSelectionRange(0, value.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export async function copyTextToClipboardWithToast(text: string, successMsg = '已复制到剪贴板') {
  const ok = await copyTextToClipboard(text)
  if (ok) {
    ElMessage.success(successMsg)
  } else {
    ElMessage.warning('复制失败，请手动选中链接复制')
  }
}
