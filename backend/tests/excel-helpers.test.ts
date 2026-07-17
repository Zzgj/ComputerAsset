import { describe, expect, it } from 'vitest'

import {
  compactNorm,
  looseModelKey,
  mapStatus,
  normalizeHeader,
  parseExcelDate,
  splitDeptPathSegments,
} from '../src/routes/excel'

describe('splitDeptPathSegments', () => {
  it('splits by slash', () => {
    expect(splitDeptPathSegments('一级/二级/三级')).toEqual(['一级', '二级', '三级'])
  })
  it('accepts full-width slash and backslash', () => {
    expect(splitDeptPathSegments('一级／二级')).toEqual(['一级', '二级'])
    expect(splitDeptPathSegments('一级\\二级')).toEqual(['一级', '二级'])
  })
  it('falls back to dash separator when no slashes', () => {
    expect(splitDeptPathSegments('一级 - 二级')).toEqual(['一级', '二级'])
  })
  it('returns [] for empty / whitespace', () => {
    expect(splitDeptPathSegments('')).toEqual([])
    expect(splitDeptPathSegments('   ')).toEqual([])
  })
  it('drops empty segments from leading/trailing/double separators', () => {
    expect(splitDeptPathSegments('/a//b/')).toEqual(['a', 'b'])
  })
})

describe('parseExcelDate', () => {
  it('returns null for empty values', () => {
    expect(parseExcelDate(undefined)).toBeNull()
    expect(parseExcelDate(null)).toBeNull()
    expect(parseExcelDate('')).toBeNull()
  })
  it('preserves valid Date instance', () => {
    const d = new Date('2026-05-15')
    expect(parseExcelDate(d)).toBe(d)
  })
  it('parses Excel serial number', () => {
    // 44927 in Excel = 2023-01-01
    const d = parseExcelDate(44927)
    expect(d).not.toBeNull()
    expect(d!.getUTCFullYear()).toBe(2023)
  })
  it('parses ISO string', () => {
    const d = parseExcelDate('2026-05-15')
    expect(d).not.toBeNull()
    expect(d!.getUTCFullYear()).toBe(2026)
  })
  it('returns null for invalid string', () => {
    expect(parseExcelDate('not a date')).toBeNull()
  })
})

describe('compactNorm / looseModelKey', () => {
  it('compactNorm trims and removes inner whitespace', () => {
    expect(compactNorm('  hello  world ')).toBe('helloworld')
  })
  it('looseModelKey lowercases and strips noise', () => {
    expect(looseModelKey('ThinkPad X1 Carbon (Gen9) - 16GB DDR4')).toBe('thinkpadx1carbongen9')
  })
  it('looseModelKey strips storage suffix', () => {
    expect(looseModelKey('Model A 512GB SSD')).toContain('modela')
    expect(looseModelKey('Model A 512GB SSD')).not.toContain('512')
  })
  it('looseModelKey unifies full-width parens', () => {
    expect(looseModelKey('型号A（专业版）')).toBe(looseModelKey('型号A(专业版)'))
  })
})

describe('mapStatus', () => {
  it('maps Chinese labels', () => {
    expect(mapStatus('在库')).toBe('in_stock')
    expect(mapStatus('使用中')).toBe('in_use')
    expect(mapStatus('借用中')).toBe('borrowed')
    expect(mapStatus('已报废')).toBe('retired')
  })
  it('maps English enum values', () => {
    expect(mapStatus('in_stock')).toBe('in_stock')
    expect(mapStatus('waiting_pickup')).toBe('waiting_pickup')
  })
  it('returns null on unknown / non-string', () => {
    expect(mapStatus('unknown')).toBeNull()
    expect(mapStatus(123)).toBeNull()
    expect(mapStatus('')).toBeNull()
  })
  it('strips internal whitespace as fallback', () => {
    expect(mapStatus(' 在 库 ')).toBe('in_stock')
  })
})

describe('normalizeHeader', () => {
  it('strips spaces and unifies parens', () => {
    expect(normalizeHeader(' 资产 编号 ')).toBe('资产编号')
    expect(normalizeHeader('备注（中文）')).toBe('备注(中文)')
  })
})
