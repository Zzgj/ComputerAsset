<template>
  <div class="page-wrap">
    <el-card shadow="never">
      <div class="page-title">导入导出</div>
      <div class="page-subtitle">通过模板批量导入资产数据，或按需导出资产与出入库记录。</div>
    </el-card>

    <div class="grid-wrap">
      <el-card shadow="never">
        <template #header>
          <div class="section-title">导入资产</div>
        </template>

        <div class="block">
          <el-button type="primary" plain @click="downloadTemplate">下载导入模板</el-button>
          <span class="helper-text">按模板列名填写后上传，格式与系统保持一致</span>
        </div>

        <div class="block">
          <input type="file" @change="onFileChange" accept=".xlsx,.xls,.csv" />
          <el-button type="primary" :disabled="!file" :loading="importing" @click="doImport">导入 Excel</el-button>
        </div>

        <div class="hint-box">
          <div style="font-weight: 600; margin-bottom: 6px">导入规则与限制</div>
          <div>1. 必填：电脑编号（缺失将判为无效并跳过）。</div>
          <div>2. 序列号：同一批导入内不可重复；若与库内其他资产重复也会跳过该行。</div>
          <div>3. 状态校验：设备状态为“待领用/使用中/借用中”时，现定人必填。</div>
          <div>4. 日期校验：采购日期、保修到期日格式非法会判为无效。</div>
          <div>5. 模板匹配：优先按“模板名称”，其次按“品牌+型号”；未登记型号可选择自动创建模板。</div>
          <div>6. 处理方式：导入前会预校验并显示总数/有效/无效；无效行会在明细中给出原因并跳过。</div>
        </div>
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="section-title">导出数据</div>
        </template>

        <div class="block export-params">
          <span class="helper-text">资产清单分页导出</span>
          <span class="helper-text">页码</span>
          <el-input-number v-model="assetsExportPage" :min="1" :max="100000" size="small" />
          <span class="helper-text">每页</span>
          <el-input-number v-model="assetsExportPageSize" :min="10" :max="10000" size="small" />
          <span class="helper-text">条</span>
        </div>

        <div class="block actions">
          <el-button type="success" @click="exportAssets">导出资产清单</el-button>
          <el-button type="primary" plain @click="exportRecords">导出出入库记录</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getApiBaseURL } from '../services/api'

const file = ref<File | null>(null)
const importing = ref(false)
const assetsExportPage = ref(1)
const assetsExportPageSize = ref(500)

type UnknownTemplate = {
  key: string
  suggestedName: string
  brand: string
  model: string
  deviceType: string
  exampleRows: number[]
}

type SkippedRow = {
  row: number
  reason: string
  assetCode?: string
}

type ImportResult = {
  invalidReasonStats?: Array<{ reason: string; count: number }>
  detectedRows?: number
  wouldImport?: number
  invalidRows?: number
  imported?: number
  createdTemplates?: number
  skippedCount?: number
  skippedRows?: SkippedRow[]
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  file.value = (target.files && target.files[0]) || null
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function postImport(formData: FormData) {
  const res = await fetch(`${getApiBaseURL()}/api/excel/import`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  return { res, data }
}

function formatUnknownList(items: UnknownTemplate[]): string {
  return items
    .slice(0, 15)
    .map((u) => {
      const rows = u.exampleRows?.length ? `（示例行：${u.exampleRows.join(', ')}）` : ''
      const bm = [u.brand, u.model].filter(Boolean).join(' ') || '—'
      return `<div>· <strong>${escapeHtml(u.suggestedName)}</strong> — ${escapeHtml(bm)} ${rows}</div>`
    })
    .join('')
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function showSkippedRows(result: ImportResult) {
  const skippedCount = Number(result?.skippedCount ?? 0)
  if (!skippedCount) return
  const rows = (result?.skippedRows ?? []).slice(0, 30)
  const rowsHtml = rows
    .map((r) => {
      const code = r.assetCode ? `，编号：${escapeHtml(r.assetCode)}` : ''
      return `<tr><td style="padding:6px 8px;border-bottom:1px solid #f0f0f0">${r.row}</td><td style="padding:6px 8px;border-bottom:1px solid #f0f0f0">${escapeHtml(r.reason)}${code}</td></tr>`
    })
    .join('')
  const more = skippedCount > rows.length ? `<div style="margin-top:8px;color:#999">仅展示前 ${rows.length} 条，实际共 ${skippedCount} 条</div>` : ''
  const html = `
    <div style="text-align:left;max-height:360px;overflow:auto">
      <div style="margin-bottom:8px">以下数据行已被跳过（共 ${skippedCount} 条）：</div>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr>
            <th style="text-align:left;padding:6px 8px;border-bottom:1px solid #e5e5e5;width:80px">行号</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:1px solid #e5e5e5">原因</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      ${more}
    </div>
  `
  await ElMessageBox.alert(html, '导入跳过明细', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '我知道了',
    type: 'warning',
  })
}

function buildSkippedRowsHtml(result: ImportResult) {
  const skippedCount = Number(result?.skippedCount ?? 0)
  const wouldImport = Number(result?.wouldImport ?? 0)
  const invalidRows = Number(result?.invalidRows ?? skippedCount)
  // 兼容旧后端：若未返回 detectedRows，则按 有效+无效 估算
  const detectedRows = Number(result?.detectedRows ?? wouldImport + invalidRows)
  const rows = (result?.skippedRows ?? []).slice(0, 30)
  const stats = (result?.invalidReasonStats ?? []).slice(0, 10)
  const statsHtml = stats.length
    ? `<div style="margin:10px 0 12px 0;padding:8px 10px;background:#fafafa;border:1px solid #f0f0f0;border-radius:6px">
        <div style="margin-bottom:6px;font-weight:600">无效原因分组统计</div>
        ${stats.map((s) => `<div>· ${escapeHtml(s.reason)}：${s.count} 条</div>`).join('')}
      </div>`
    : ''
  const rowsHtml = rows
    .map((r) => {
      const code = r.assetCode ? `，编号：${escapeHtml(r.assetCode)}` : ''
      return `<tr><td style="padding:6px 8px;border-bottom:1px solid #f0f0f0">${r.row}</td><td style="padding:6px 8px;border-bottom:1px solid #f0f0f0">${escapeHtml(r.reason)}${code}</td></tr>`
    })
    .join('')
  const more =
    skippedCount > rows.length ? `<div style="margin-top:8px;color:#999">仅展示前 ${rows.length} 条，实际共 ${skippedCount} 条</div>` : ''
  return `
    <div style="text-align:left;max-height:360px;overflow-y:auto;overflow-x:hidden;padding-right:4px">
      <div style="margin-bottom:8px;line-height:1.6">
        预校验结果：检测到 <strong>${detectedRows}</strong> 条，预计可导入 <strong>${wouldImport}</strong> 条，无效 <strong>${invalidRows}</strong> 条。
      </div>
      ${statsHtml}
      <div style="margin-bottom:8px">无效行明细（共 ${skippedCount} 条）：</div>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr>
            <th style="text-align:left;padding:6px 8px;border-bottom:1px solid #e5e5e5;width:80px">行号</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:1px solid #e5e5e5">原因</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      ${more}
    </div>
  `
}

async function confirmSkippedRowsAndProceed(result: ImportResult) {
  const skippedCount = Number(result?.skippedCount ?? 0)
  if (!skippedCount) return
  const html = buildSkippedRowsHtml(result)
  await ElMessageBox.confirm(html, '导入预校验', {
    dangerouslyUseHTMLString: true,
    distinguishCancelAndClose: true,
    confirmButtonText: '我已确认，继续导入（跳过无效行）',
    cancelButtonText: '取消导入',
    type: 'warning',
  })
}

async function doImport() {
  if (!file.value || importing.value) return
  importing.value = true
  try {
    // 先预校验：把“缺少电脑编号”等无效行先展示给你确认
    const fdPreview = new FormData()
    fdPreview.append('file', file.value)
    fdPreview.append('dryRun', 'true')
    const { res: r0, data: d0 } = await postImport(fdPreview)
    if (!r0.ok) {
      ElMessage.error(d0?.error?.message ?? d0?.message ?? '导入预校验失败')
      return
    }

    let previewShown = false
    const wouldImport = Number(d0?.wouldImport ?? 0)
    const invalidRows = Number(d0?.invalidRows ?? d0?.skippedCount ?? 0)
    // 兼容旧后端：若未返回 detectedRows，则按 有效+无效 估算
    const detectedRows = Number(d0?.detectedRows ?? wouldImport + invalidRows)
    const skipN0 = Number(d0?.skippedCount ?? 0)
    ElMessage.info({
      message: `预校验：检测到 ${detectedRows} 条，预计可导入 ${wouldImport} 条，无效 ${invalidRows} 条`,
      duration: 6000,
    })
    if (skipN0 > 0) {
      ElMessage.warning({ message: `导入预校验：将跳过 ${skipN0} 行无效数据`, duration: 6000 })
      try {
        await confirmSkippedRowsAndProceed(d0)
        previewShown = true
      } catch (e: any) {
        // cancel / close 都视为取消
        return
      }
    }

    // 未登记型号：按你的选择决定是否自动建模板
    const unknown: UnknownTemplate[] = d0?.unknownTemplates ?? []
    let createMissingTemplates = false
    let allowMissingTemplates = false

    if (unknown.length > 0) {
      const more = unknown.length > 15 ? `<div>… 共 ${unknown.length} 种未登记型号</div>` : ''
      const html = `
        <div style="text-align:left;max-height:280px;overflow:auto;line-height:1.6">
          <p>以下型号在系统中<strong>尚未登记</strong>（共 ${unknown.length} 种）：</p>
          ${formatUnknownList(unknown)}
          ${more}
        </div>
      `

      try {
        await ElMessageBox.confirm(html, '未登记的电脑型号', {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '创建型号模板并导入',
          cancelButtonText: '仅导入资产（不创建模板）',
          type: 'warning',
        })
        createMissingTemplates = true
      } catch (e: any) {
        if (e === 'close') return
        allowMissingTemplates = true
      }
    }

    // 真正导入
    const fd = new FormData()
    fd.append('file', file.value)
    if (createMissingTemplates) fd.append('createMissingTemplates', 'true')
    if (allowMissingTemplates) fd.append('allowMissingTemplates', 'true')
    const { res: r1, data: d1 } = await postImport(fd)
    if (!r1.ok) {
      ElMessage.error(d1?.error?.message ?? d1?.message ?? '导入失败')
      return
    }

    const extra =
      typeof d1.createdTemplates === 'number' && d1.createdTemplates > 0
        ? `，新建型号模板 ${d1.createdTemplates} 个`
        : ''
    const skipN1 = Number(d1.skippedCount ?? 0)
    const skipped = skipN1 > 0 ? `，跳过 ${skipN1} 条` : ''
    ElMessage.success(`导入完成：${d1.imported ?? 0} 条已写入${extra}${skipped}`)

    if (skipN1 > 0) {
      ElMessage.warning({ message: `有 ${skipN1} 行未导入，请核对 Excel 行号与原因`, duration: 6000 })
    }
    // 如果预校验已经让你确认过了，就不重复弹一遍明细
    if (!previewShown && skipN1 > 0) await showSkippedRows(d1)
    file.value = null
  } finally {
    importing.value = false
  }
}

async function downloadBlob(url: string, fileName: string) {
  const token = localStorage.getItem('token')
  const res = await fetch(url, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    let msg = text || `下载失败 (${res.status})`
    try {
      const j = JSON.parse(text)
      msg = j?.error?.message ?? j?.message ?? msg
    } catch {
      /* 非 JSON */
    }
    throw new Error(msg)
  }
  const blob = await res.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
  URL.revokeObjectURL(link.href)
}

async function downloadTemplate() {
  try {
    await downloadBlob(`${getApiBaseURL()}/api/excel/template`, '资产导入模板.xlsx')
    ElMessage.success('模板已下载（含示例行与填写说明工作表）')
  } catch (e: any) {
    ElMessage.error(e?.message ?? '下载失败')
  }
}

async function exportAssets() {
  try {
    const page = assetsExportPage.value
    const pageSize = assetsExportPageSize.value
    await downloadBlob(
      `${getApiBaseURL()}/api/excel/export?type=assets&page=${page}&pageSize=${pageSize}`,
      `assets_p${page}.xlsx`,
    )
    ElMessage.success('导出完成')
  } catch (e: any) {
    ElMessage.error(e?.message ?? '导出失败')
  }
}

async function exportRecords() {
  try {
    await downloadBlob(`${getApiBaseURL()}/api/excel/export?type=records`, 'records.xlsx')
    ElMessage.success('导出完成')
  } catch (e: any) {
    ElMessage.error(e?.message ?? '导出失败')
  }
}
</script>

<style scoped>
.page-wrap {
  padding: 20px;
  display: grid;
  gap: 16px;
}

.page-title {
  font-weight: 800;
  margin-bottom: 4px;
}

.page-subtitle {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.grid-wrap {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
}

.section-title {
  font-weight: 700;
}

.block {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.block + .block {
  margin-top: 14px;
}

.helper-text {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.hint-box {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  line-height: 1.6;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  background: #fafafa;
  border: 1px solid #f0f0f0;
}

.actions {
  justify-content: flex-start;
}
</style>
