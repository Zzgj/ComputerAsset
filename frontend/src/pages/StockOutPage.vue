<template>
  <div style="padding: 20px">
    <el-card shadow="never">
      <div style="font-weight: 800; margin-bottom: 4px">出库/借用</div>
      <div style="color: #666; font-size: 13px; margin-bottom: 12px">包含出库（直接领用）、分配待领用、借出，以及待领用确认/取消。</div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="出库（直接领用）" name="check_out">
          <div style="display: grid; gap: 12px; margin-top: 10px">
            <el-select v-model="checkOut.assetId" placeholder="选择在库电脑" filterable style="width: 420px">
              <el-option v-for="a in inStockAssets" :key="a.id" :label="`${a.assetCode} - ${a.brand}/${a.model}`" :value="a.id" />
            </el-select>
            <el-input v-model="checkOut.userName" placeholder="领用人姓名" style="width: 420px" />
            <el-select v-model="checkOut.departmentId" placeholder="部门" style="width: 420px">
              <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
            </el-select>
            <el-input type="textarea" v-model="checkOut.remark" placeholder="备注（可选）" :rows="3" style="width: 560px" />
            <el-button type="primary" :loading="submitting" @click="doCheckOut" :disabled="!checkOut.assetId || !checkOut.userName || !checkOut.departmentId">
              确认出库
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="分配（待领用）" name="assign">
          <div style="display: grid; gap: 12px; margin-top: 10px">
            <el-select v-model="assign.assetId" placeholder="选择在库电脑" filterable style="width: 420px">
              <el-option v-for="a in inStockAssets" :key="a.id" :label="`${a.assetCode} - ${a.brand}/${a.model}`" :value="a.id" />
            </el-select>
            <el-input v-model="assign.userName" placeholder="领用人姓名" style="width: 420px" />
            <el-select v-model="assign.departmentId" placeholder="部门" style="width: 420px">
              <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
            </el-select>
            <el-input type="textarea" v-model="assign.remark" placeholder="备注（可选）" :rows="3" style="width: 560px" />
            <el-button
              type="primary"
              :loading="submitting"
              @click="doAssign"
              :disabled="!assign.assetId || !assign.userName || !assign.departmentId"
            >
              确认分配
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="借出" name="lend">
          <div style="display: grid; gap: 12px; margin-top: 10px">
            <el-select v-model="lend.assetId" placeholder="选择在库电脑" filterable style="width: 420px">
              <el-option v-for="a in inStockAssets" :key="a.id" :label="`${a.assetCode} - ${a.brand}/${a.model}`" :value="a.id" />
            </el-select>
            <el-input v-model="lend.userName" placeholder="借用人姓名" style="width: 420px" />
            <el-select v-model="lend.departmentId" placeholder="部门" style="width: 420px">
              <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
            </el-select>
            <el-date-picker v-model="lend.expectedReturnDate" type="date" placeholder="预计归还日期" value-format="YYYY-MM-DD" />
            <el-input type="textarea" v-model="lend.remark" placeholder="备注（可选）" :rows="3" style="width: 560px" />
            <el-button type="primary" :loading="submitting" @click="doLend" :disabled="!lend.assetId || !lend.userName || !lend.departmentId || !lend.expectedReturnDate">
              确认借出
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="待领用操作" name="pickup">
          <div style="display: grid; gap: 12px; margin-top: 10px">
            <el-select v-model="pickup.assetId" placeholder="选择待领用电脑" filterable style="width: 420px">
              <el-option v-for="a in waitingPickupAssets" :key="a.id" :label="`${a.assetCode} - ${a.currentUserName}`" :value="a.id" />
            </el-select>
            <el-input type="textarea" v-model="pickup.remark" placeholder="备注（可选）" :rows="3" style="width: 560px" />
            <div style="display: flex; gap: 12px; flex-wrap: wrap">
              <el-button type="primary" :loading="submitting" @click="doPickUp" :disabled="!pickup.assetId">
                确认领用
              </el-button>
              <el-button type="danger" :loading="submitting" @click="doCancelAssign" :disabled="!pickup.assetId">
                取消分配
              </el-button>
            </div>
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
    // 以兜底默认值保证管理员页面可用
    onePersonOneDeviceEnabled.value = false
    defaultBorrowDays.value = 7
  }
}

async function ensureDefaultLendDate() {
  if (lend.expectedReturnDate) return
  lend.expectedReturnDate = formatYmd(addDays(new Date(), defaultBorrowDays.value))
}

async function findUserAssetsConflicts(userName: string) {
  // 仅用于“提示警告/继续取消”场景，因此这里走前端聚合查询即可
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
        // 用户取消：不做任何处理
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
        userName: assign.userName,
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
        // 用户取消：不做任何处理
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

