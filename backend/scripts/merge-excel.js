/* eslint-disable no-console */
// 整理并合并 Excel：
// - 基础数据来自 `泰鼎新能源南浔区IT资产.xlsx`（保证 227 条都存在）
// - 模板字段（品牌/型号/操作系统/CPU/内存/存储等）参考 `终端概况.xlsx`
// - 终端概况中存在但 IT 资产中不存在：新增行，并将整行标黄
//
// 输出：生成一个与 `资产导入模板.xlsx` 表头一致的结果文件
//
// 运行：node scripts/merge-excel.js

const path = require('path')
const fs = require('fs')

const XLSX = require('xlsx-js-style')

const TEST_DIR = path.join(__dirname, '..', '..', 'Test')

const IT_ASSETS_FILE = path.join(TEST_DIR, '泰鼎新能源南浔区IT资产.xlsx')
const TERMINAL_OVERVIEW_FILE = path.join(TEST_DIR, '终端概况.xlsx')
const IMPORT_TEMPLATE_FILE = path.join(TEST_DIR, '资产导入模板.xlsx')

function normKey(s) {
  return String(s ?? '')
    .trim()
    .replace(/\u3000/g, '') // 全角空格
    .replace(/\s+/g, ' ')
}

function inferDeviceTypeFromModel(model) {
  const m = normKey(model)
  if (!m) return '台式机'
  const laptopHints = ['Latitude', 'ThinkPad', 'Notebook', 'E490', 'E14', 'T480', 'HUAWEI', '联想']
  const desktopHints = ['Tower', 'OptiPlex', 'Desktop', 'Workstation', 'MT', 'SFF']
  for (const h of laptopHints) {
    if (m.includes(h)) return '笔记本'
  }
  for (const h of desktopHints) {
    if (m.includes(h)) return '台式机'
  }
  // 兜底：大多数终端概况是 Windows 桌面场景
  return '台式机'
}

function formatStorage(storageRaw) {
  // 直接保留原始字符串即可；系统侧不强校验该字段格式
  return normKey(storageRaw)
}

function toYmdFromExcelDateValue(v) {
  if (v === undefined || v === null || v === '') return ''
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return ''
    return v.toISOString().slice(0, 10)
  }
  // Excel 日期序列号（常见在 30000~65000）
  if (typeof v === 'number' && Number.isFinite(v)) {
    if (v > 30000 && v < 65000) {
      const ms = (v - 25569) * 86400 * 1000
      const d = new Date(ms)
      if (Number.isNaN(d.getTime())) return ''
      return d.toISOString().slice(0, 10)
    }
    // 其它数字按原样不做处理
    return String(v)
  }
  const s = String(v).trim()
  if (!s) return ''
  // 直接是 yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const d = new Date(s)
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  return s
}

function normalizeFormerInfo(formerInfoRaw) {
  const s = String(formerInfoRaw ?? '').trim()
  if (!s) return ''
  // 去掉可能已经带有的前缀，避免出现「曾用人：曾用人：...」
  const stripped = s.replace(/^(曾用人信息|曾用人)[：:]/, '').trim()
  return stripped
}

function stripFormerSegmentFromRemark(remark) {
  const s = String(remark ?? '').trim()
  if (!s) return ''
  // 删除备注里已存在的「曾用人：... / 曾用人信息：...」片段（只按行删除，避免误伤其它文字）
  const removed = s
    .replace(/(曾用人信息|曾用人)[：:][^\n\r]*/g, '')
    .replace(/[。,.]?\s*$/, '')
    .trim()
  return removed
}

function cellValue(v) {
  // xlsx-js-style 对 undefined 处理可能不稳定，统一转空串
  if (v === undefined || v === null) return ''
  return v
}

function makeYellowRowStyle() {
  // xlsx-js-style 的样式结构：{ fill: { patternType, fgColor } }
  return {
    fill: {
      patternType: 'solid',
      fgColor: { rgb: 'FFF2CC' }, // 兼容旧实现：给前景色即可
    },
  }
}

function colLetter(idx0) {
  // 0-based -> Excel column letter
  let n = idx0 + 1
  let s = ''
  while (n > 0) {
    const r = (n - 1) % 26
    s = String.fromCharCode(65 + r) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

function main() {
  if (!fs.existsSync(IT_ASSETS_FILE)) throw new Error(`Missing: ${IT_ASSETS_FILE}`)
  if (!fs.existsSync(TERMINAL_OVERVIEW_FILE)) throw new Error(`Missing: ${TERMINAL_OVERVIEW_FILE}`)
  if (!fs.existsSync(IMPORT_TEMPLATE_FILE)) throw new Error(`Missing: ${IMPORT_TEMPLATE_FILE}`)

  // 1) 读取模板表头（第一行）
  const templateWb = XLSX.readFile(IMPORT_TEMPLATE_FILE)
  const templateSheet = templateWb.SheetNames[0]
  const templateWs = templateWb.Sheets[templateSheet]
  const templateRows = XLSX.utils.sheet_to_json(templateWs, { header: 1, defval: '' })

  const headerRowIndex = templateRows.findIndex((row) => row && row.some((v) => normKey(v) !== ''))
  const headers = (templateRows[headerRowIndex] ?? []).slice(0, 200).map((h) => normKey(h))

  if (!headers.length || headers[0] === '') {
    throw new Error('Cannot detect template headers')
  }

  // 2) 读取 IT 资产（第一行表头）
  const itWb = XLSX.readFile(IT_ASSETS_FILE)
  const itSheet = itWb.SheetNames[0]
  const itWs = itWb.Sheets[itSheet]
  const itRows = XLSX.utils.sheet_to_json(itWs, { defval: '' })

  console.log('IT rows:', itRows.length)

  // 3) 读取终端概况（表头在第 2 行：我们从全表中取第一个出现字段名的行）
  const termWb = XLSX.readFile(TERMINAL_OVERVIEW_FILE)
  const termSheet = termWb.SheetNames[0]
  const termWs = termWb.Sheets[termSheet]
  const termRaw = XLSX.utils.sheet_to_json(termWs, { header: 1, defval: '' })

  const headerCandidates = [
    '终端名称',
    '计算机名称',
    '操作系统名称',
    '系统制造商',
    '主机序列号',
    'CPU',
    '内存',
    '硬盘',
  ]
  const termHeaderRowIndex = (() => {
    for (let i = 0; i < Math.min(termRaw.length, 30); i++) {
      const row = termRaw[i] || []
      const set = new Set(row.map((v) => String(v).trim()))
      let hit = 0
      for (const n of headerCandidates) {
        if (set.has(n)) hit++
      }
      if (hit >= 6) return i
    }
    return -1
  })()

  if (termHeaderRowIndex < 0) throw new Error('Cannot detect terminal overview header row')

  const termHeaders = (termRaw[termHeaderRowIndex] || []).map((h) => normKey(h))
  const termData = termRaw.slice(termHeaderRowIndex + 1).filter((r) => r && r.some((v) => normKey(v) !== ''))

  const terminalRows = termData.map((rowArr) => {
    const obj = {}
    for (let c = 0; c < termHeaders.length; c++) {
      const key = termHeaders[c]
      if (!key) continue
      obj[key] = cellValue(rowArr[c])
    }
    return obj
  })

  console.log('Terminal overview rows:', terminalRows.length)

  // 4) 建立 terminal 查找表（按主机序列号 -> 备用按计算机名称）
  const terminalBySerial = new Map()
  const terminalByAssetCode = new Map()

  for (const tr of terminalRows) {
    const serial = normKey(tr['主机序列号'])
    const assetCode = normKey(tr['计算机名称'])
    if (serial && !terminalBySerial.has(serial)) terminalBySerial.set(serial, tr)
    if (assetCode && !terminalByAssetCode.has(assetCode)) terminalByAssetCode.set(assetCode, tr)
  }

  // 5) 将 IT rows 映射到 import template，并做字段合并
  const outRows = []
  const itKeysMatchedToTerminal = new Set()

  // 统计用：用于校验
  const mergeKeyFromIt = (r) => {
    const serial = normKey(r['序列号（EX）'] ?? r['序列号(EX)'] ?? r['序列号'] ?? '')
    const assetCode = normKey(r['电脑编号'] ?? r['assetCode'] ?? '')
    return serial || assetCode
  }

  for (const r of itRows) {
    const out = {}
    // 默认用 IT 为准
    for (const h of headers) out[h] = ''

    out['电脑编号'] = normKey(r['电脑编号'])
    out['序列号'] = normKey(r['序列号（EX）'])
    out['设备类型'] = normKey(r['设备类型'])

    // 状态映射
    const st = normKey(r['设备状态'])
    const statusMap = {
      在库: '在库',
      使用中: '使用中',
      闲置: '在库',
      借用: '借用中',
      借用中: '借用中',
    }
    out['设备状态'] = statusMap[st] ?? st

    out['现定人'] = normKey(r['现登记人'] ?? '')
    out['部门'] = normKey(r['部门'] ?? '')
    // 按你的要求：把 IT 表里的「开始使用时间」放到导入模板的「采购日期」
    // 同时把 Excel 日期序列号转换成 YYYY-MM-DD 便于你直观看
    out['采购日期'] = toYmdFromExcelDateValue(r['开始使用时间'] ?? r['启用日期'] ?? '')
    // 把 IT 表里的「曾用人信息」合并进备注，但展示文案只保留为「曾用人：...」
    // 规则：只保留一个「曾用人：...」，并用「。」与原备注分隔。
    const itRemarkRaw = cellValue(r['备注'] ?? '')
    const formerInfoRaw = cellValue(r['曾用人信息'] ?? r['曾用人'] ?? '')
    const itRemarkClean = stripFormerSegmentFromRemark(itRemarkRaw)
    const formerInfoClean = normalizeFormerInfo(formerInfoRaw)

    const segments = []
    if (itRemarkClean) segments.push(itRemarkClean.replace(/[。,.]\s*$/, '').trim())
    if (formerInfoClean) segments.push(`曾用人：${formerInfoClean}`)
    out['备注'] = segments.join('。')

    const serial = normKey(r['序列号（EX）'])
    const term = serial ? terminalBySerial.get(serial) : null
    const termByAsset = !term ? terminalByAssetCode.get(normKey(r['电脑编号'])) : null
    const picked = term ?? termByAsset

    if (picked) {
      itKeysMatchedToTerminal.add(serial || normKey(r['电脑编号']))
      const brand = normKey(picked['系统制造商'])
      const model = normKey(picked['系统型号'])
      out['品牌'] = brand
      out['型号'] = model
      out['操作系统'] = normKey(picked['操作系统名称'])
      out['CPU'] = normKey(picked['CPU'])
      out['内存'] = normKey(picked['内存'])
      out['存储'] = formatStorage(picked['硬盘'])

      const templateName = [brand, model].filter(Boolean).join(' ').trim()
      out['模板名称'] = templateName
    }

    outRows.push({ rowObj: out, isYellow: false, mergeKey: mergeKeyFromIt(r) })
  }

  // 6) 终端概况中额外数据：不在 IT 中的新增行，标黄色
  const itSerialSet = new Set(
    itRows.map((r) => normKey(r['序列号（EX）'])).filter(Boolean),
  )
  const itAssetCodeSet = new Set(itRows.map((r) => normKey(r['电脑编号'])).filter(Boolean))

  let extraCount = 0
  for (const tr of terminalRows) {
    const serial = normKey(tr['主机序列号'])
    const assetCode = normKey(tr['计算机名称'])
    const existsInIt = (serial && itSerialSet.has(serial)) || (assetCode && itAssetCodeSet.has(assetCode))
    if (existsInIt) continue

    extraCount++
    const out = {}
    for (const h of headers) out[h] = ''

    out['电脑编号'] = assetCode
    out['序列号'] = serial
    out['设备类型'] = inferDeviceTypeFromModel(tr['系统型号'])

    out['品牌'] = normKey(tr['系统制造商'])
    out['型号'] = normKey(tr['系统型号'])
    out['操作系统'] = normKey(tr['操作系统名称'])
    out['CPU'] = normKey(tr['CPU'])
    out['内存'] = normKey(tr['内存'])
    out['存储'] = formatStorage(tr['硬盘'])

    out['模板名称'] = [out['品牌'], out['型号']].filter(Boolean).join(' ').trim()

    // 额外行默认置为“在库”，避免无现定人导致导入无效
    out['设备状态'] = '在库'
    out['现定人'] = ''
    out['部门'] = ''
    out['备注'] = '来自终端概况但 IT资产表不存在（请确认后导入）'

    outRows.push({ rowObj: out, isYellow: true, mergeKey: serial || assetCode })
  }

  console.log('Extra rows (terminal not in IT):', extraCount)
  console.log('Total output rows:', outRows.length)

  // 6.5) 模板合并去重：
  // 若多台电脑在“模板配置字段”完全一致，则合并为一个模板。
  // - 统一这些行的「模板名称」
  // - 代表行（该模板配置的最早出现行）保留完整配置字段
  // - 其他行清空配置字段，只保留「模板名称」，其余由服务端模板继承补齐
  // 模板去重键：忽略「存储」差异，避免同型号仅因硬盘容量不同被拆成多个模板
  const templateConfigFields = ['设备类型', '品牌', '型号', '操作系统', 'CPU', '内存']
  const templateKeyOfRowObj = (rowObj) => templateConfigFields.map((f) => normKey(rowObj[f])).join('|')
  const canonicalNameOfRowObj = (rowObj) => {
    const v = normKey(rowObj['模板名称'])
    if (v) return v
    const bm = [normKey(rowObj['品牌']), normKey(rowObj['型号'])].filter(Boolean).join(' ').trim()
    return bm || '未命名型号'
  }

  const templateKeyToCanonicalName = new Map()
  const templateKeyToRepresentativeIndex = new Map()

  for (let i = 0; i < outRows.length; i++) {
    const item = outRows[i]
    const key = templateKeyOfRowObj(item.rowObj)
    if (!templateKeyToCanonicalName.has(key)) templateKeyToCanonicalName.set(key, canonicalNameOfRowObj(item.rowObj))
    if (!templateKeyToRepresentativeIndex.has(key)) templateKeyToRepresentativeIndex.set(key, i)
  }

  for (let i = 0; i < outRows.length; i++) {
    const item = outRows[i]
    const key = templateKeyOfRowObj(item.rowObj)
    const canonical = templateKeyToCanonicalName.get(key) ?? canonicalNameOfRowObj(item.rowObj)
    item.rowObj['模板名称'] = canonical

    const repIndex = templateKeyToRepresentativeIndex.get(key)
    if (repIndex !== i) {
      // 其他电脑行仅保留模板名称，其余模板配置字段清空
      for (const f of ['设备类型', '品牌', '型号', '操作系统', 'CPU', '内存', '存储']) {
        item.rowObj[f] = ''
      }
    }
  }

  // 7) 写出结果
  const aoa = []
  aoa.push(headers)
  for (const item of outRows) {
    aoa.push(headers.map((h) => item.rowObj[h] ?? ''))
  }

  const outWb = XLSX.utils.book_new()
  const outWs = XLSX.utils.aoa_to_sheet(aoa)

  // 应用样式：对 yellow 行把整行填充为浅黄色
  const yellowS = makeYellowRowStyle()

  for (let r = 0; r < outRows.length; r++) {
    const item = outRows[r]
    if (!item.isYellow) continue

    const excelRow = r + 2 // 因为第1行是表头
    for (let c = 0; c < headers.length; c++) {
      const letter = colLetter(c)
      const addr = `${letter}${excelRow}`
      if (outWs[addr]) {
        outWs[addr].s = outWs[addr].s || {}
        outWs[addr].s = { ...outWs[addr].s, fill: yellowS.fill }
      }
    }
  }

  const outSheetName = '资产导入_整理结果'
  XLSX.utils.book_append_sheet(outWb, outWs, outSheetName)

  const nowStr = new Date()
    .toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '-')
    .slice(0, 19)
  const outFile = path.join(TEST_DIR, `资产导入模板_整理结果_${nowStr}.xlsx`)

  XLSX.writeFile(outWb, outFile, { bookType: 'xlsx', cellStyles: true })
  console.log('Wrote:', outFile)
}

main()

