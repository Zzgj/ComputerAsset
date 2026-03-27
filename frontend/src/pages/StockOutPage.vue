<template>
  <div class="page-wrap">
    <el-card shadow="never" class="intro-card">
      <div class="page-title">出库 / 借用</div>
      <div class="page-subtitle">
        办理在库设备的直接领用、分配待领用、临时借出，以及待领用确认与取消分配。按下方页签切换流程。
      </div>
    </el-card>

    <el-card shadow="never" class="main-card">
      <el-alert
        v-if="onePersonOneDeviceEnabled"
        type="warning"
        :closable="false"
        show-icon
        class="policy-alert"
        title="已开启「一人一机」规则：出库与借出时，若使用人名下已有在领用/借用等状态的电脑，系统将提示冲突；您仍可选择继续办理。"
      />

      <el-tabs v-model="activeTab" class="stock-tabs">
        <el-tab-pane label="出库（直接领用）" name="check_out">
          <div class="tab-panel">
            <p class="tab-desc">从在库状态直接变为使用中，适用于当场领走设备。</p>
            <el-form label-width="100px" class="op-form">
              <el-form-item label="在库电脑" required>
                <el-select v-model="checkOut.assetId" placeholder="搜索电脑编号或配置" filterable class="field-full">
                  <el-option v-for="a in inStockAssets" :key="a.id" :label="`${a.assetCode} · ${a.brand}/${a.model}`" :value="a.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="领用人" required>
                <el-input v-model="checkOut.userName" placeholder="姓名" class="field-full" clearable />
              </el-form-item>
              <el-form-item label="部门" required>
                <el-select v-model="checkOut.departmentId" placeholder="选择部门" filterable class="field-full">
                  <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="checkOut.remark" placeholder="可选" :rows="3" class="field-wide" />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="large"
                  :loading="submitting"
                  @click="doCheckOut"
                  :disabled="!checkOut.assetId || !checkOut.userName || !checkOut.departmentId"
                >
                  确认出库
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="分配（待领用）" name="assign">
          <div class="tab-panel">
            <p class="tab-desc">设备先进入待领用，指定领用人与部门；对方在「待领用操作」中确认领用后变为使用中。</p>
            <el-form label-width="100px" class="op-form">
              <el-form-item label="在库电脑" required>
                <el-select v-model="assign.assetId" placeholder="搜索电脑编号或配置" filterable class="field-full">
                  <el-option v-for="a in inStockAssets" :key="a.id" :label="`${a.assetCode} · ${a.brand}/${a.model}`" :value="a.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="领用人" required>
                <el-input v-model="assign.userName" placeholder="姓名" class="field-full" clearable />
              </el-form-item>
              <el-form-item label="部门" required>
                <el-select v-model="assign.departmentId" placeholder="选择部门" filterable class="field-full">
                  <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="assign.remark" placeholder="可选" :rows="3" class="field-wide" />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="large"
                  :loading="submitting"
                  @click="doAssign"
                  :disabled="!assign.assetId || !assign.userName || !assign.departmentId"
                >
                  确认分配
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="借出" name="lend">
          <div class="tab-panel">
            <p class="tab-desc">临时借出至借用中状态，需填写预计归还日期（默认按系统配置的借用天数推算，可在系统配置中修改）。</p>
            <el-form label-width="100px" class="op-form">
              <el-form-item label="在库电脑" required>
                <el-select v-model="lend.assetId" placeholder="搜索电脑编号或配置" filterable class="field-full">
                  <el-option v-for="a in inStockAssets" :key="a.id" :label="`${a.assetCode} · ${a.brand}/${a.model}`" :value="a.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="借用人" required>
                <el-input v-model="lend.userName" placeholder="姓名" class="field-full" clearable />
              </el-form-item>
              <el-form-item label="部门" required>
                <el-select v-model="lend.departmentId" placeholder="选择部门" filterable class="field-full">
                  <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="预计归还" required>
                <el-date-picker
                  v-model="lend.expectedReturnDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="YYYY-MM-DD"
                  class="field-date"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="lend.remark" placeholder="可选" :rows="3" class="field-wide" />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="large"
                  :loading="submitting"
                  @click="doLend"
                  :disabled="!lend.assetId || !lend.userName || !lend.departmentId || !lend.expectedReturnDate"
                >
                  确认借出
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="待领用操作" name="pickup">
          <div class="tab-panel">
            <p class="tab-desc">对「待领用」资产确认领用（变为使用中）或取消分配（退回在库）。</p>
            <el-form label-width="100px" class="op-form">
              <el-form-item label="待领用电脑" required>
                <el-select v-model="pickup.assetId" placeholder="搜索编号或领用人" filterable class="field-full">
                  <el-option v-for="a in waitingPickupAssets" :key="a.id" :label="`${a.assetCode} → ${a.currentUserName || '—'}`" :value="a.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="pickup.remark" placeholder="可选" :rows="3" class="field-wide" />
              </el-form-item>
              <el-form-item>
                <div class="btn-group">
                  <el-button type="primary" size="large" :loading="submitting" @click="doPickUp" :disabled="!pickup.assetId">
                    确认领用
                  </el-button>
                  <el-button type="danger" plain size="large" :loading="submitting" @click="doCancelAssign" :disabled="!pickup.assetId">
                    取消分配
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { apiRequest } from '../services/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('check_out')
const submitting = ref(false)

const departments = ref<any[]>([])
const inStockAssets = ref<any[]>([])
const waitingPickupAssets = ref<any[]>([])

const onePersonOneDeviceEnabled = ref(false)
const defaultBorrowDays = ref(7)

const checkOut = reactive<any>({ assetId: null, userName: '', departmentId: null, remark: '' })
const assign = reactive<any>({ assetId: null, userName: '', departmentId: null, remark: '' })
const lend = reactive<any>({ assetId: null, userName: '', departmentId: null, expectedReturnDate: null, remark: '' })
const pickup = reactive<any>({ assetId: null, remark: '' })

function formatYmd(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

async function loadConfig() {
  try {
    const data = await apiRequest<{ items: Array<{ configKey: string; configValue: string }> }>('/api/config')
    const map = new Map(data.items.map((x) => [x.configKey, x.configValue]))

    const one = map.get('one_person_one_device')
    onePersonOneDeviceEnabled.value = one === 'true' || one === '1'

    const days = Number(map.get('default_borrow_days') ?? '7')
    defaultBorrowDays.value = Number.isFinite(days) ? days : 7
  } catch (_e) {
    onePersonOneDeviceEnabled.value = false
    defaultBorrowDays.value = 7
  }
}

async function ensureDefaultLendDate() {
  if (lend.expectedReturnDate) return
  lend.expectedReturnDate = formatYmd(addDays(new Date(), defaultBorrowDays.value))
}

async function findUserAssetsConflicts(userName: string) {
  const [inUse, waiting, borrowed] = await Promise.all([
    apiRequest<{ items: any[] }>(`/api/assets?status=in_use&page=1&pageSize=100`),
    apiRequest<{ items: any[] }>(`/api/assets?status=waiting_pickup&page=1&pageSize=100`),
    apiRequest<{ items: any[] }>(`/api/assets?status=borrowed&page=1&pageSize=100`),
  ])
  const all = [...(inUse.items ?? []), ...(waiting.items ?? []), ...(borrowed.items ?? [])]
  const u = userName.trim()
  return all.filter((a) => String(a.currentUserName ?? '') === u)
}

async function loadDepartments() {
  const data = await apiRequest<{ items: any[] }>('/api/departments')
  departments.value = data.items ?? []
}

async function loadAssets() {
  const [inStock, waiting] = await Promise.all([
    apiRequest<{ items: any[] }>('/api/assets?status=in_stock&page=1&pageSize=50'),
    apiRequest<{ items: any[] }>('/api/assets?status=waiting_pickup&page=1&pageSize=50'),
  ])
  inStockAssets.value = inStock.items ?? []
  waitingPickupAssets.value = waiting.items ?? []
}

function uuid() {
  return (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now())
}

async function doCheckOut() {
  submitting.value = true
  try {
    let ignoreConflict = false
    if (onePersonOneDeviceEnabled.value && checkOut.userName?.trim()) {
      const conflicts = await findUserAssetsConflicts(checkOut.userName)
      if (conflicts.length > 0) {
        const preview = conflicts
          .slice(0, 5)
          .map((a) => a.assetCode)
          .filter(Boolean)
          .join('、')
        try {
          await ElMessageBox.confirm(
            `检测到用户「${checkOut.userName.trim()}」已持有电脑（${preview || '已有资产'}）。是否继续出库？`,
            '一人一机冲突警告',
            { type: 'warning', confirmButtonText: '继续', cancelButtonText: '取消' },
          )
          ignoreConflict = true
        } catch {
          return
        }
      }
    }

    await apiRequest('/api/operations/check-out', {
      method: 'POST',
      body: {
        requestId: uuid(),
        assetId: checkOut.assetId,
        userName: checkOut.userName.trim(),
        departmentId: checkOut.departmentId,
        ignoreConflict: ignoreConflict || undefined,
        remark: checkOut.remark || undefined,
      },
    })
    ElMessage.success('出库成功')
    await loadAssets()
    checkOut.assetId = null
    checkOut.userName = ''
    checkOut.departmentId = null
    checkOut.remark = ''
  } catch (e: any) {
    if (e?.status === 409 && e?.code === 'ONE_PERSON_ONE_DEVICE_CONFLICT') {
      const conflicts = e?.details?.conflicts ?? []
      const preview = Array.isArray(conflicts)
        ? conflicts
            .slice(0, 5)
            .map((x: any) => x.assetCode)
            .filter(Boolean)
            .join('、')
        : ''
      try {
        await ElMessageBox.confirm(
          `检测到冲突（${preview || '该用户已持有电脑'}）。是否继续出库？`,
          '一人一机冲突警告',
          { type: 'warning', confirmButtonText: '继续', cancelButtonText: '取消' },
        )
        await apiRequest('/api/operations/check-out', {
          method: 'POST',
          body: {
            requestId: uuid(),
            assetId: checkOut.assetId,
            userName: checkOut.userName.trim(),
            departmentId: checkOut.departmentId,
            ignoreConflict: true,
            remark: checkOut.remark || undefined,
          },
        })
        ElMessage.success('出库成功')
        await loadAssets()
        checkOut.assetId = null
        checkOut.userName = ''
        checkOut.departmentId = null
        checkOut.remark = ''
      } catch {
        // 用户取消
      }
      return
    }
    ElMessage.error(e?.message ?? '出库失败')
  } finally {
    submitting.value = false
  }
}

async function doAssign() {
  submitting.value = true
  try {
    await apiRequest('/api/operations/assign', {
      method: 'POST',
      body: {
        requestId: uuid(),
        assetId: assign.assetId,
        userName: String(assign.userName ?? '').trim(),
        departmentId: assign.departmentId,
        remark: assign.remark || undefined,
      },
    })
    ElMessage.success('分配成功')
    await loadAssets()
    assign.assetId = null
    assign.userName = ''
    assign.departmentId = null
    assign.remark = ''
  } finally {
    submitting.value = false
  }
}

async function doLend() {
  submitting.value = true
  try {
    let ignoreConflict = false
    if (onePersonOneDeviceEnabled.value && lend.userName?.trim()) {
      const conflicts = await findUserAssetsConflicts(lend.userName)
      if (conflicts.length > 0) {
        const preview = conflicts
          .slice(0, 5)
          .map((a) => a.assetCode)
          .filter(Boolean)
          .join('、')
        try {
          await ElMessageBox.confirm(
            `检测到用户「${lend.userName.trim()}」已持有电脑（${preview || '已有资产'}）。是否继续借出？`,
            '一人一机冲突警告',
            { type: 'warning', confirmButtonText: '继续', cancelButtonText: '取消' },
          )
          ignoreConflict = true
        } catch {
          return
        }
      }
    }

    await apiRequest('/api/operations/lend', {
      method: 'POST',
      body: {
        requestId: uuid(),
        assetId: lend.assetId,
        userName: lend.userName.trim(),
        departmentId: lend.departmentId,
        ignoreConflict: ignoreConflict || undefined,
        expectedReturnDate: lend.expectedReturnDate
          ? new Date(`${lend.expectedReturnDate}T00:00:00`).toISOString()
          : undefined,
        remark: lend.remark || undefined,
      },
    })
    ElMessage.success('借出成功')
    await loadAssets()
    lend.assetId = null
    lend.userName = ''
    lend.departmentId = null
    lend.expectedReturnDate = null
    lend.remark = ''
  } catch (e: any) {
    if (e?.status === 409 && e?.code === 'ONE_PERSON_ONE_DEVICE_CONFLICT') {
      const conflicts = e?.details?.conflicts ?? []
      const preview = Array.isArray(conflicts)
        ? conflicts
            .slice(0, 5)
            .map((x: any) => x.assetCode)
            .filter(Boolean)
            .join('、')
        : ''
      try {
        await ElMessageBox.confirm(
          `检测到冲突（${preview || '该用户已持有电脑'}）。是否继续借出？`,
          '一人一机冲突警告',
          { type: 'warning', confirmButtonText: '继续', cancelButtonText: '取消' },
        )
        await apiRequest('/api/operations/lend', {
          method: 'POST',
          body: {
            requestId: uuid(),
            assetId: lend.assetId,
            userName: lend.userName.trim(),
            departmentId: lend.departmentId,
            ignoreConflict: true,
            expectedReturnDate: lend.expectedReturnDate
              ? new Date(`${lend.expectedReturnDate}T00:00:00`).toISOString()
              : undefined,
            remark: lend.remark || undefined,
          },
        })
        ElMessage.success('借出成功')
        await loadAssets()
        lend.assetId = null
        lend.userName = ''
        lend.departmentId = null
        lend.expectedReturnDate = null
        lend.remark = ''
      } catch {
        // 用户取消
      }
      return
    }
    ElMessage.error(e?.message ?? '借出失败')
  } finally {
    submitting.value = false
  }
}

async function doPickUp() {
  submitting.value = true
  try {
    await apiRequest('/api/operations/pick-up', {
      method: 'POST',
      body: { requestId: uuid(), assetId: pickup.assetId, remark: pickup.remark || undefined },
    })
    ElMessage.success('确认领用成功')
    await loadAssets()
    pickup.assetId = null
    pickup.remark = ''
  } finally {
    submitting.value = false
  }
}

async function doCancelAssign() {
  submitting.value = true
  try {
    await apiRequest('/api/operations/cancel-assign', {
      method: 'POST',
      body: { requestId: uuid(), assetId: pickup.assetId, remark: pickup.remark || undefined },
    })
    ElMessage.success('已取消分配')
    await loadAssets()
    pickup.assetId = null
    pickup.remark = ''
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await loadConfig()
  await ensureDefaultLendDate()
  await loadDepartments()
  await loadAssets()
})
</script>

<style scoped>
.page-wrap {
  padding: 20px;
  display: grid;
  gap: 16px;
  max-width: 960px;
}

.intro-card {
  border-radius: 10px;
}

.page-title {
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}

.page-subtitle {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 1.55;
}

.main-card {
  border-radius: 10px;
}

.policy-alert {
  margin-bottom: 16px;
}

.stock-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.stock-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--el-border-color-light);
}

.stock-tabs :deep(.el-tabs__item) {
  font-weight: 600;
}

.tab-panel {
  padding: 20px 4px 8px;
  max-width: 560px;
}

.tab-desc {
  margin: 0 0 18px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.55;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
}

.op-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.field-full {
  width: 100%;
  max-width: 420px;
}

.field-wide {
  width: 100%;
  max-width: 480px;
}

.field-date {
  width: 100%;
  max-width: 260px;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
