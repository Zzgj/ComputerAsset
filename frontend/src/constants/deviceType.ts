/** 与后端 Prisma DeviceType 枚举一致 */
export const DEVICE_TYPE_OPTIONS = [
  { label: '笔记本', value: 'laptop' },
  { label: '台式机', value: 'desktop' },
  { label: '一体机', value: 'aio' },
  { label: '服务器', value: 'server' },
  { label: '其他', value: 'other' },
] as const

export type DeviceTypeValue = (typeof DEVICE_TYPE_OPTIONS)[number]['value']

export function deviceTypeLabel(value: string | null | undefined): string {
  const v = String(value ?? '').trim()
  if (!v) return '暂无'
  const hit = DEVICE_TYPE_OPTIONS.find((o) => o.value === v)
  return hit?.label ?? v
}
