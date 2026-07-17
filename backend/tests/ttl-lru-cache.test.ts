import { describe, expect, it } from 'vitest'

import { TtlLruCache } from '../src/utils/ttlLruCache'

describe('TtlLruCache', () => {
  it('returns set values within TTL', () => {
    const c = new TtlLruCache<string, number>(10, 1000)
    c.set('a', 1)
    expect(c.get('a')).toBe(1)
  })
  it('expires entries after TTL', async () => {
    const c = new TtlLruCache<string, number>(10, 30)
    c.set('a', 1)
    await new Promise((r) => setTimeout(r, 50))
    expect(c.get('a')).toBeUndefined()
  })
  it('evicts oldest when size exceeds max', () => {
    const c = new TtlLruCache<string, number>(2, 1000)
    c.set('a', 1)
    c.set('b', 2)
    c.set('c', 3)
    expect(c.get('a')).toBeUndefined()
    expect(c.get('b')).toBe(2)
    expect(c.get('c')).toBe(3)
  })
  it('access promotes to end (LRU)', () => {
    const c = new TtlLruCache<string, number>(2, 1000)
    c.set('a', 1)
    c.set('b', 2)
    c.get('a') // a is now most recent
    c.set('c', 3) // should evict b
    expect(c.get('b')).toBeUndefined()
    expect(c.get('a')).toBe(1)
  })
  it('delete removes a key', () => {
    const c = new TtlLruCache<string, number>(10, 1000)
    c.set('a', 1)
    c.delete('a')
    expect(c.get('a')).toBeUndefined()
  })
  it('clear empties the cache', () => {
    const c = new TtlLruCache<string, number>(10, 1000)
    c.set('a', 1)
    c.set('b', 2)
    c.clear()
    expect(c.get('a')).toBeUndefined()
    expect(c.get('b')).toBeUndefined()
  })
})
