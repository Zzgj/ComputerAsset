<template>
  <div class="detail-page ca-animate">
    <div class="detail-top-bar">
      <el-button type="primary" @click="backToAssetList">返回资产列表</el-button>
      <div class="detail-id-hint">
        资产ID：{{ assetId }}
      </div>
    </div>
    <el-card shadow="never" v-if="asset">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap">
        <div>
          <div style="font-size: 22px; font-weight: 800">{{ asset.assetCode }}</div>
          <div style="color: #666; margin-top: 6px">序列号：{{ formatSerial(asset.serialNumber) }}</div>
          <div style="margin-top: 10px">
            <el-tag type="info" style="margin-right: 8px">{{ statusLabel(asset.status) }}</el-tag>
            <el-tag v-if="asset.department?.campus?.name" type="success" effect="plain" style="margin-right: 8px">
              {{ asset.department.campus.name }}
            </el-tag>
            <el-tag v-if="asset.department?.deptPathOnly || asset.department?.name" effect="plain" style="margin-right: 8px">
              {{ asset.department.deptPathOnly || asset.department.name }}
            </el-tag>
            <el-tag>{{ formatText(asset.currentUserName) }}</el-tag>
          </div>
          <div v-if="asset.department?.displayPath" style="margin-top: 8px; font-size: 13px; color: #606266">
            全路径：{{ asset.department.displayPath }}
          </div>
        </div>
        <div style="min-width: 280px">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 8px" v-if="canEditAsset">
            <el-button type="warning" plain @click="openEditCore">编辑关键信息</el-button>
          </div>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="设备模板">
              <el-tag v-if="asset.template?.name" type="primary" effect="plain">{{ asset.template.name }}</el-tag>
              <el-tag v-else type="info" effect="plain">自定义</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="品牌">{{ formatText(asset.brand) }}</el-descriptions-item>
            <el-descriptions-item label="型号">{{ formatText(asset.model) }}</el-descriptions-item>
            <el-descriptions-item label="操作系统">{{ formatText(asset.os) }}</el-descriptions-item>
            <el-descriptions-item label="CPU">{{ formatText(asset.cpu) }}</el-descriptions-item>
            <el-descriptions-item label="内存">{{ formatText(asset.memory) }}</el-descriptions-item>
            <el-descriptions-item label="存储">{{ formatText(asset.storage) }}</el-descriptions-item>
            <el-descriptions-item label="园区">{{ formatText(asset.department?.campus?.name) }}</el-descriptions-item>
            <el-descriptions-item label="部门">{{ formatText(asset.department?.deptPathOnly ?? asset.department?.name) }}</el-descriptions-item>
            <el-descriptions-item label="采购日期">{{ toDate(asset.purchaseDate) }}</el-descriptions-item>
            <el-descriptions-item label="保修到期">{{ asset.warrantyExpiry ? toDate(asset.warrantyExpiry) : '暂无' }}</el-descriptions-item>
          </el-descriptions>
          <div
            style="
              margin-top: 10px;
              padding: 10px 12px;
              border: 1px dashed #e6a23c;
              background: #fff9ec;
              border-radius: 8px;
            "
          >
            <div style="font-size: 12px; color: #a1731a; font-weight: 700; margin-bottom: 6px">资产备注</div>
            <div style="color: #4e5969; line-height: 1.6; white-space: pre-wrap">{{ formatText(asset.remark) }}</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 管理操作：需「出入库与流转操作」权限 -->
    <el-card shadow="never" style="margin-top: 16px" v-if="asset && canOperations">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap">
        <div style="font-weight: 800">资产管理操作</div>
        <div style="color: #666; font-size: 13px">
          当前状态：<span style="font-weight: 700">{{ statusLabel(asset.status) }}</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin-top: 14px">
        <el-card shadow="never" style="border: 1px solid #eee" body-style="padding: 14px">
          <div style="font-weight: 700; margin-bottom: 8px">调拨</div>
          <div style="color: #666; font-size: 13px; margin-bottom: 10px">使用中的电脑：在库内换人换部门</div>
          <el-button type="primary" :disabled="asset.status !== 'in_use'" @click="openTransfer">调拨</el-button>
        </el-card>

        <el-card shadow="never" style="border: 1px solid #eee" body-style="padding: 14px">
          <div style="font-weight: 700; margin-bottom: 8px">送修</div>
          <div style="color: #666; font-size: 13px; margin-bottom: 10px">任意状态（非已报废）：填写故障与维修商</div>
          <el-button type="primary" :disabled="asset.status === 'retired'" @click="openRepair">送修</el-button>
        </el-card>

        <el-card shadow="never" style="border: 1px solid #eee" body-style="padding: 14px">
          <div style="font-weight: 700; margin-bottom: 8px">维修完成</div>
          <div style="color: #666; font-size: 13px; margin-bottom: 10px">仅维修中：选择结果与维修费用</div>
          <el-button type="primary" :disabled="asset.status !== 'in_repair'" @click="openRepairDone">维修完成</el-button>
        </el-card>

        <el-card shadow="never" style="border: 1px solid #eee" body-style="padding: 14px">
          <div style="font-weight: 700; margin-bottom: 8px">报废</div>
          <div style="color: #666; font-size: 13px; margin-bottom: 10px">任意状态（非已报废）：填写报废原因</div>
          <el-button type="danger" :disabled="asset.status === 'retired'" @click="openRetire">报废</el-button>
        </el-card>
      </div>
    </el-card>

    <el-card shadow="never" style="margin-top: 16px" v-if="records.length">
      <div style="font-weight: 700; margin-bottom: 10px">曾用人</div>
      <el-tag
        v-for="u in uniqueUsers"
        :key="u"
        style="margin: 4px 6px 0 0"
      >
        {{ u }}
      </el-tag>
    </el-card>

    <el-card shadow="never" style="margin-top: 16px">
      <div style="font-weight: 700; margin-bottom: 6px">流转历史</div>
      <div style="color: #909399; font-size: 12px; margin-bottom: 10px">
        每条为当时业务记录的归属部门（含园区）；调拨等可能造成跨园区，以记录为准。
      </div>
      <el-timeline v-if="timelineItems.length">
        <el-timeline-item
          v-for="r in timelineItems"
          :key="r.key"
          :timestamp="new Date(r.time).toLocaleString()"
          :type="r.kind === 'record' && r.action === 'return' ? 'success' : 'primary'"
          placement="top"
        >
          <div class="timeline-title">{{ r.title }}</div>
          <div class="timeline-body" v-if="r.kind === 'record'">
            <div class="timeline-meta">
              <el-tag effect="plain" size="small">
                {{ r.action === 'return' ? '原使用人' : '用户' }}：{{ formatText(r.userName) }}
              </el-tag>
              <el-tag type="info" effect="plain" size="small">
                园区 / 部门：{{ formatText(r.departmentDisplay) }}
              </el-tag>
              <el-tag v-if="r.recordOperatorName" type="warning" effect="plain" size="small">
                操作人：{{ r.recordOperatorName }}
              </el-tag>
            </div>
            <div class="timeline-remark">
              <span class="timeline-label">备注</span>
              <span class="timeline-value">{{ formatText(r.remark) }}</span>
            </div>
          </div>
          <div class="timeline-body" v-else>
            <div class="timeline-meta">
              <el-tag type="warning" effect="plain" size="small">操作人：{{ r.operatorName }}</el-tag>
            </div>
            <div class="timeline-remark">
              <span class="timeline-label">变更</span>
              <span class="timeline-value">{{ r.changeSummary }}</span>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
      <div v-else style="color:#666">暂无记录</div>
    </el-card>

    <el-card shadow="never" style="margin-top: 16px" v-if="repairs.length">
      <div style="font-weight: 700; margin-bottom: 10px">维修记录</div>
      <el-table :data="repairs" size="small" style="width: 100%">
        <el-table-column prop="faultDescription" label="故障描述" />
        <el-table-column prop="repairVendor" label="维修商" />
        <el-table-column prop="repairCost" label="维修费用" />
        <el-table-column prop="repairResult" label="结果" />
        <el-table-column label="开始/结束">
          <template #default="{ row }">{{ toDate(row.startDate) }} - {{ toDate(row.endDate) }}</template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 调拨 -->
    <el-dialog v-model="transferDialogVisible" title="调拨" width="620px" :close-on-click-modal="false">
      <el-form :model="transferForm" label-width="100px">
        <el-form-item label="领用人">
          <el-input v-model="transferForm.userName" placeholder="输入新使用人姓名" />
        </el-form-item>
        <el-form-item label="目标部门">
          <DepartmentCascader v-model="transferForm.departmentId" :departments="departments" :campuses="campuses" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="transferForm.remark" :rows="4" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="transferDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submittingTransfer" @click="submitTransfer">提交调拨</el-button>
      </template>
    </el-dialog>

    <!-- 送修 -->
    <el-dialog v-model="repairDialogVisible" title="送修" width="680px" :close-on-click-modal="false">
      <el-form :model="repairForm" label-width="110px">
        <el-form-item label="故障描述" required>
          <el-input type="textarea" v-model="repairForm.faultDescription" :rows="4" placeholder="填写故障现象" />
        </el-form-item>
        <el-form-item label="维修商" required>
          <el-input v-model="repairForm.repairVendor" placeholder="维修商/维修人名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="repairForm.remark" :rows="3" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="repairDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submittingRepair" @click="submitRepair">提交送修</el-button>
      </template>
    </el-dialog>

    <!-- 维修完成 -->
    <el-dialog v-model="repairDoneDialogVisible" title="维修完成" width="680px" :close-on-click-modal="false">
      <el-form :model="repairDoneForm" label-width="110px">
        <el-form-item label="维修结果" required>
          <el-radio-group v-model="repairDoneForm.repairResult">
            <el-radio-button value="fixed">已修复</el-radio-button>
            <el-radio-button value="unfixable">无法修复</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="维修费用" required>
          <el-input-number v-model="repairDoneForm.repairCost" :min="0" :step="0.01" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="repairDoneForm.remark" :rows="3" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="repairDoneDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submittingRepairDone" @click="submitRepairDone">提交维修完成</el-button>
      </template>
    </el-dialog>

    <!-- 报废 -->
    <el-dialog v-model="retireDialogVisible" title="报废" width="600px" :close-on-click-modal="false">
      <el-form :model="retireForm" label-width="100px">
        <el-form-item label="报废原因">
          <el-input type="textarea" v-model="retireForm.remark" :rows="4" placeholder="填写报废原因/说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="retireDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="submittingRetire" @click="submitRetire">确认报废</el-button>
      </template>
    </el-dialog>

    <!-- 关键信息编辑：需「登记/编辑资产」权限 -->
    <el-dialog v-model="editCoreDialogVisible" title="编辑资产关键信息（高风险）" width="720px" :close-on-click-modal="false">
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        title="此操作会影响资产标识与追溯，请确认变更依据（如重装、贴标调整）后再提交。"
        style="margin-bottom: 12px"
      />
      <el-form :model="editCoreForm" label-width="100px">
        <el-form-item label="电脑编号" required>
          <el-input v-model="editCoreForm.assetCode" />
        </el-form-item>
        <el-form-item label="序列号" required>
          <el-input v-model="editCoreForm.serialNumber" />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="editCoreForm.brand" />
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="editCoreForm.model" />
        </el-form-item>
        <el-form-item label="操作系统">
          <el-input v-model="editCoreForm.os" />
        </el-form-item>
        <el-form-item label="CPU">
          <el-input v-model="editCoreForm.cpu" />
        </el-form-item>
        <el-form-item label="内存">
          <el-input v-model="editCoreForm.memory" />
        </el-form-item>
        <el-form-item label="存储">
          <el-input v-model="editCoreForm.storage" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="editCoreForm.remark" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editCoreDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="submittingEditCore" @click="submitEditCore">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiRequest } from '../services/api'
import { actionLabel } from '../actionLabel'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import DepartmentCascader from '../components/DepartmentCascader.vue'

const route = useRoute()
const router = useRouter()
const assetId = Number(route.params.id)

function backToAssetList() {
  router.push({ name: 'assets', query: route.query })
}

const asset = ref<any | null>(null)
const records = ref<any[]>([])
const repairs = ref<any[]>([])
const campuses = ref<Array<{ id: number; name: string; sortOrder: number }>>([])
const departments = ref<Array<{ id: number; name: string; displayPath?: string; campusId: number; parentId: number | null; sortOrder: number }>>([])

const authStore = useAuthStore()
const canOperations = computed(() => authStore.can('operations.execute'))
const canEditAsset = computed(() => authStore.can('assets.write'))
const changeLogs = ref<any[]>([])

function toDate(d: any) {
  if (!d) return '暂无'
  return new Date(d).toLocaleDateString()
}

function formatText(v: unknown) {
  const s = String(v ?? '').trim()
  if (!s) return '暂无'
  return s
}

function formatSerial(serialNumber: string) {
  const s = String(serialNumber ?? '').trim()
  if (!s) return '暂无'
  if (s === '暂无' || s.startsWith('暂无-')) return '暂无'
  return s
}

function statusLabel(statusRaw: string) {
  const s = String(statusRaw ?? '').trim()
  const map: Record<string, string> = {
    in_stock: '在库',
    waiting_pickup: '待领用',
    in_use: '使用中',
    borrowed: '借用中',
    in_repair: '维修中',
    retired: '已报废',
  }
  return map[s] ?? s
}

const uniqueUsers = computed(() => {
  const set = new Set<string>()
  for (const r of records.value) {
    if (typeof r.userName === 'string' && r.userName.trim()) set.add(r.userName)
  }
  return Array.from(set)
})

/** 流转时间线：最新在前，便于看到刚发生的归还等操作 */
const sortedRecords = computed(() =>
  [...records.value].sort((a, b) => new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime()),
)
const timelineItems = computed(() => {
  const flow = sortedRecords.value.map((r: any) => ({
    key: `record-${r.id}`,
    kind: 'record' as const,
    time: r.actionDate,
    title: actionLabel(r.action),
    action: String(r.action ?? ''),
    userName: r.userName,
    departmentDisplay: r.department?.displayPath ?? r.department?.name ?? '-',
    remark: r.remark ?? '-',
    recordOperatorName: r.operator?.realName?.trim() || r.operator?.username?.trim() || '',
  }))
  const edits = (changeLogs.value ?? []).map((l: any) => {
    const before = l?.detail?.before ?? {}
    const after = l?.detail?.after ?? {}
    const keys = ['assetCode', 'serialNumber', 'brand', 'model', 'os', 'cpu', 'memory', 'storage'] as const
    const labelMap: Record<(typeof keys)[number], string> = {
      assetCode: '电脑编号',
      serialNumber: '序列号',
      brand: '品牌',
      model: '型号',
      os: '操作系统',
      cpu: 'CPU',
      memory: '内存',
      storage: '存储',
    }
    const changed = keys.filter((k) => String(before?.[k] ?? '') !== String(after?.[k] ?? ''))
    const fmt = (v: unknown) => {
      const s = String(v ?? '').trim()
      return s || '（空）'
    }
    const details = changed.map((k) => `${labelMap[k]}：${fmt(before?.[k])} -> ${fmt(after?.[k])}`)
    return {
      key: `log-${l.id}`,
      kind: 'log' as const,
      time: l.createdAt,
      title: '关键信息修改',
      operatorName: l.operator?.realName ?? l.operator?.username ?? '-',
      changeSummary: details.length ? details.join('；') : '字段更新',
    }
  })
  return [...flow, ...edits].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
})

function uuid() {
  return (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now())
}

async function loadDepartments() {
  const [d, c] = await Promise.all([
    apiRequest<{ items: any[] }>('/api/departments'),
    apiRequest<{ items: any[] }>('/api/campuses'),
  ])
  departments.value = d.items ?? []
  campuses.value = c.items ?? []
}

async function reload() {
  const [a, r, rep, logs] = await Promise.all([
    apiRequest<any>(`/api/assets/${assetId}`),
    apiRequest<{ records: any[] }>(`/api/assets/${assetId}/records`),
    apiRequest<{ repairs: any[] }>(`/api/assets/${assetId}/repairs`),
    apiRequest<{ logs: any[] }>(`/api/assets/${assetId}/change-logs`),
  ])
  asset.value = a.asset ?? a
  records.value = r.records ?? []
  repairs.value = rep.repairs ?? []
  changeLogs.value = logs.logs ?? []
}

// ---- 对话框与表单状态 ----
const transferDialogVisible = ref(false)
const repairDialogVisible = ref(false)
const repairDoneDialogVisible = ref(false)
const retireDialogVisible = ref(false)

const submittingTransfer = ref(false)
const submittingRepair = ref(false)
const submittingRepairDone = ref(false)
const submittingRetire = ref(false)
const editCoreDialogVisible = ref(false)
const submittingEditCore = ref(false)

const transferForm = reactive<any>({
  userName: '',
  departmentId: null as number | null,
  remark: '',
})

const repairForm = reactive<any>({
  faultDescription: '',
  repairVendor: '',
  remark: '',
})

const repairDoneForm = reactive<any>({
  repairResult: 'fixed' as 'fixed' | 'unfixable',
  repairCost: 0,
  remark: '',
})

const retireForm = reactive<any>({
  remark: '',
})
const editCoreForm = reactive<any>({
  assetCode: '',
  serialNumber: '',
  brand: '',
  model: '',
  os: '',
  cpu: '',
  memory: '',
  storage: '',
  remark: '',
})

function openTransfer() {
  transferForm.userName = asset.value?.currentUserName ?? ''
  transferForm.departmentId = asset.value?.department?.id ?? null
  transferForm.remark = ''
  transferDialogVisible.value = true
}

function openRepair() {
  repairForm.faultDescription = ''
  repairForm.repairVendor = ''
  repairForm.remark = ''
  repairDialogVisible.value = true
}

function openRepairDone() {
  repairDoneForm.repairResult = 'fixed'
  repairDoneForm.repairCost = 0
  repairDoneForm.remark = ''
  repairDoneDialogVisible.value = true
}

function openRetire() {
  retireForm.remark = ''
  retireDialogVisible.value = true
}

function openEditCore() {
  if (!asset.value) return
  Object.assign(editCoreForm, {
    assetCode: asset.value.assetCode ?? '',
    serialNumber: asset.value.serialNumber ?? '',
    brand: asset.value.brand ?? '',
    model: asset.value.model ?? '',
    os: asset.value.os ?? '',
    cpu: asset.value.cpu ?? '',
    memory: asset.value.memory ?? '',
    storage: asset.value.storage ?? '',
    remark: asset.value.remark ?? '',
  })
  editCoreDialogVisible.value = true
}

async function submitEditCore() {
  if (!asset.value) return
  if (!editCoreForm.assetCode?.trim()) return ElMessage.error('电脑编号不能为空')
  if (!editCoreForm.serialNumber?.trim()) return ElMessage.error('序列号不能为空')
  const changed =
    editCoreForm.assetCode.trim() !== String(asset.value.assetCode ?? '') ||
    editCoreForm.serialNumber.trim() !== String(asset.value.serialNumber ?? '') ||
    String(editCoreForm.brand ?? '') !== String(asset.value.brand ?? '') ||
    String(editCoreForm.model ?? '') !== String(asset.value.model ?? '') ||
    String(editCoreForm.os ?? '') !== String(asset.value.os ?? '') ||
    String(editCoreForm.cpu ?? '') !== String(asset.value.cpu ?? '') ||
    String(editCoreForm.memory ?? '') !== String(asset.value.memory ?? '') ||
    String(editCoreForm.storage ?? '') !== String(asset.value.storage ?? '') ||
    String(editCoreForm.remark ?? '') !== String(asset.value.remark ?? '')
  if (!changed) return ElMessage.warning('未检测到变更')

  // 高风险强提示：要求再次确认
  const ok = window.confirm(
    '高风险操作：你正在修改资产关键标识（编号/序列号/品牌等）。这会影响后续追溯与对账，确定继续吗？',
  )
  if (!ok) return

  submittingEditCore.value = true
  try {
    await apiRequest(`/api/assets/${assetId}`, {
      method: 'PUT',
      body: {
        version: asset.value.version,
        forceCustom: true,
        assetCode: editCoreForm.assetCode.trim(),
        serialNumber: editCoreForm.serialNumber.trim(),
        brand: editCoreForm.brand ?? '',
        model: editCoreForm.model ?? '',
        os: editCoreForm.os ?? '',
        cpu: editCoreForm.cpu ?? '',
        memory: editCoreForm.memory ?? '',
        storage: editCoreForm.storage ?? '',
        remark: editCoreForm.remark ?? '',
        currentUserName: asset.value.currentUserName ?? '',
        departmentId: asset.value.departmentId,
        deviceType: asset.value.deviceType,
      },
    })
    ElMessage.success('关键信息修改成功')
    editCoreDialogVisible.value = false
    await reload()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '修改失败')
  } finally {
    submittingEditCore.value = false
  }
}

async function submitTransfer() {
  if (!asset.value) return
  if (!transferForm.userName?.trim()) return ElMessage.error('请填写领用人')
  if (!transferForm.departmentId) return ElMessage.error('请选择目标部门')

  submittingTransfer.value = true
  try {
    await apiRequest('/api/operations/transfer', {
      method: 'POST',
      body: {
        requestId: uuid(),
        assetId,
        userName: transferForm.userName.trim(),
        departmentId: transferForm.departmentId,
        remark: transferForm.remark || undefined,
      },
    })
    ElMessage.success('调拨成功')
    transferDialogVisible.value = false
    await reload()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '调拨失败')
  } finally {
    submittingTransfer.value = false
  }
}

async function submitRepair() {
  if (!asset.value) return
  if (!repairForm.faultDescription?.trim()) return ElMessage.error('请填写故障描述')
  if (!repairForm.repairVendor?.trim()) return ElMessage.error('请填写维修商')

  submittingRepair.value = true
  try {
    await apiRequest('/api/operations/repair', {
      method: 'POST',
      body: {
        requestId: uuid(),
        assetId,
        faultDescription: repairForm.faultDescription.trim(),
        repairVendor: repairForm.repairVendor.trim(),
        remark: repairForm.remark || undefined,
      },
    })
    ElMessage.success('送修成功')
    repairDialogVisible.value = false
    await reload()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '送修失败')
  } finally {
    submittingRepair.value = false
  }
}

async function submitRepairDone() {
  if (!asset.value) return
  submittingRepairDone.value = true
  try {
    await apiRequest('/api/operations/repair-done', {
      method: 'POST',
      body: {
        requestId: uuid(),
        assetId,
        repairResult: repairDoneForm.repairResult,
        repairCost: Number(repairDoneForm.repairCost),
        remark: repairDoneForm.remark || undefined,
      },
    })
    ElMessage.success('维修完成成功')
    repairDoneDialogVisible.value = false
    await reload()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '维修完成失败')
  } finally {
    submittingRepairDone.value = false
  }
}

async function submitRetire() {
  if (!asset.value) return
  submittingRetire.value = true
  try {
    await apiRequest('/api/operations/retire', {
      method: 'POST',
      body: {
        requestId: uuid(),
        assetId,
        remark: retireForm.remark || undefined,
      },
    })
    ElMessage.success('报废成功')
    retireDialogVisible.value = false
    await reload()
  } catch (e: any) {
    ElMessage.error(e?.message ?? '报废失败')
  } finally {
    submittingRetire.value = false
  }
}

onMounted(async () => {
  await reload()
  if (canOperations.value) await loadDepartments()
})
</script>

<style scoped>
.detail-page {
  padding: 24px;
}

.detail-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.detail-id-hint {
  color: var(--ca-text-muted);
  font-size: 13px;
}

.timeline-title {
  font-weight: 700;
}

.timeline-body {
  margin-top: 8px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 10px 12px;
  background: var(--el-fill-color-extra-light);
}

.timeline-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.timeline-remark {
  margin-top: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.timeline-label {
  flex: 0 0 auto;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.timeline-value {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

