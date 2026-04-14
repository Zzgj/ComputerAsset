export const DEVICE_TYPE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: '笔记本', value: 'laptop' },
  { label: '台式机', value: 'desktop' },
  { label: '一体机', value: 'aio' },
  { label: '服务器', value: 'server' },
  { label: '其他', value: 'other' },
]

export function deviceTypeLabel(value: string | null | undefined): string {
  const v = String(value ?? '').trim()
  if (!v) return '暂无'
  const hit = DEVICE_TYPE_OPTIONS.find((o) => o.value === v)
  return hit?.label ?? v
}
