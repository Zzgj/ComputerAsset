/**
 * 极简 LRU + TTL：足够支撑 session token 校验缓存这种 N≤几千、TTL 短的场景。
 * 不引入 lru-cache 依赖。Map 的插入顺序就是访问顺序，访问时 delete + set 把 key 提到末尾。
 */
type Entry<V> = { value: V; expiresAt: number }

export class TtlLruCache<K, V> {
  private store = new Map<K, Entry<V>>()
  constructor(
    private readonly maxSize: number,
    private readonly ttlMs: number,
  ) {}

  get(key: K): V | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (entry.expiresAt < Date.now()) {
      this.store.delete(key)
      return undefined
    }
    // 提到 LRU 末尾
    this.store.delete(key)
    this.store.set(key, entry)
    return entry.value
  }

  set(key: K, value: V): void {
    if (this.store.has(key)) this.store.delete(key)
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs })
    if (this.store.size > this.maxSize) {
      const oldest = this.store.keys().next().value
      if (oldest !== undefined) this.store.delete(oldest)
    }
  }

  delete(key: K): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }
}
