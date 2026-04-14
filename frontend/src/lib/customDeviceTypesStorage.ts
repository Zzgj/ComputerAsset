const KEY = 'ca_custom_device_types_v1'

export function readStoredCustomDeviceTypes(): string[] {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return [...new Set(arr.map((x) => String(x ?? '').trim()).filter(Boolean))]
  } catch {
    return []
  }
}

export function rememberCustomDeviceType(name: string) {
  const n = String(name ?? '').trim()
  if (!n) return
  const cur = readStoredCustomDeviceTypes()
  if (cur.includes(n)) return
  cur.push(n)
  try {
    sessionStorage.setItem(KEY, JSON.stringify(cur))
  } catch {
    // ignore quota / private mode
  }
}
