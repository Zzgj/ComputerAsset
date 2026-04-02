<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { apiRequest } from './services/api'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isLogin = computed(() => route.path === '/login')
const navKeyword = ref('')

const activeMenu = computed(() => {
  if (route.path.startsWith('/assets/')) return '/assets'
  return route.path
})

type NavItem = { path: string; label: string; perm: string }

const sectionCommon: NavItem[] = [
  { path: '/dashboard', label: '仪表盘', perm: 'dashboard.view' },
  { path: '/assets', label: '资产列表', perm: 'assets.read' },
  { path: '/records', label: '出入库记录', perm: 'records.read' },
  { path: '/logs', label: '操作日志', perm: 'logs.read' },
]

const sectionBusiness: NavItem[] = [
  { path: '/stock-in', label: '入库登记', perm: 'assets.write' },
  { path: '/stock-out', label: '出库/借用', perm: 'operations.execute' },
  { path: '/return', label: '归还登记', perm: 'operations.execute' },
  { path: '/import', label: '导入导出', perm: 'excel.import' },
]

const sectionManage: NavItem[] = [
  { path: '/templates', label: '设备型号管理', perm: 'templates.manage' },
  { path: '/departments', label: '部门管理', perm: 'departments.manage' },
]

const sectionSystem: NavItem[] = [
  { path: '/users', label: '用户管理', perm: 'users.manage' },
  { path: '/roles', label: '角色权限', perm: 'roles.manage' },
  { path: '/config', label: '系统配置', perm: 'config.manage' },
  { path: '/backup', label: '数据备份', perm: 'backup.run' },
]

function navVisible(item: NavItem) {
  if (item.path === '/import') {
    return authStore.can('excel.import') || authStore.can('excel.export')
  }
  return authStore.can(item.perm)
}

const keyword = computed(() => navKeyword.value.trim().toLowerCase())
function filterByKeyword(items: NavItem[]) {
  const base = items.filter(navVisible)
  if (!keyword.value) return base
  return base.filter((x) => x.label.toLowerCase().includes(keyword.value) || x.path.toLowerCase().includes(keyword.value))
}

const sectionCommonFiltered = computed(() => filterByKeyword(sectionCommon))
const sectionBusinessFiltered = computed(() => filterByKeyword(sectionBusiness))
const sectionManageFiltered = computed(() => filterByKeyword(sectionManage))
const sectionSystemFiltered = computed(() => filterByKeyword(sectionSystem))
const hasAnyFiltered = computed(() => {
  return (
    sectionCommonFiltered.value.length > 0 ||
    sectionBusinessFiltered.value.length > 0 ||
    sectionManageFiltered.value.length > 0 ||
    sectionSystemFiltered.value.length > 0
  )
})

function go(path: string) {
  if (route.path !== path) router.push(path)
}

async function logout() {
  await authStore.logout()
  router.push('/login')
}

const changePwdVisible = ref(false)
const changingPwd = ref(false)
const pwdForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

function openChangePassword() {
  pwdForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  changePwdVisible.value = true
}

async function submitChangePassword() {
  if (!pwdForm.value.oldPassword || !pwdForm.value.newPassword || !pwdForm.value.confirmPassword) {
    ElMessage.error('请完整填写密码信息')
    return
  }
  if (pwdForm.value.newPassword.length < 6) {
    ElMessage.error('新密码长度不能少于 6 位')
    return
  }
  if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
    ElMessage.error('两次输入的新密码不一致')
    return
  }
  changingPwd.value = true
  try {
    await apiRequest('/api/auth/change-password', {
      method: 'POST',
      body: {
        oldPassword: pwdForm.value.oldPassword,
        newPassword: pwdForm.value.newPassword,
      },
    })
    ElMessage.success('密码修改成功')
    changePwdVisible.value = false
  } catch (e: any) {
    ElMessage.error(e?.message ?? '修改密码失败')
  } finally {
    changingPwd.value = false
  }
}
</script>

<template>
  <router-view v-if="isLogin" />

  <div v-else style="display: flex; min-height: 100vh">
    <aside style="width: 260px; border-right: 1px solid #eee; background: #fff; display: flex; flex-direction: column">
      <div style="padding: 16px 16px 8px 16px; border-bottom: 1px solid #f0f0f0">
        <div style="font-weight: 800; font-size: 16px">电脑资产管理系统</div>
        <div style="font-size: 12px; color: #888; margin-top: 6px">
          当前用户：{{ authStore.me?.realName || '-' }}
          <span v-if="authStore.me?.accessRole?.name" style="color: #aaa">（{{ authStore.me.accessRole.name }}）</span>
        </div>
      </div>

      <div style="padding: 8px 8px 0 8px; overflow: auto; flex: 1">
        <div style="padding: 4px 8px 10px 8px">
          <el-input
            v-model="navKeyword"
            clearable
            placeholder="搜索功能，例如：导入、借用、用户"
            size="small"
          />
        </div>

        <div class="nav-section-title">常用</div>
        <el-menu :default-active="activeMenu" unique-opened>
          <el-menu-item v-for="item in sectionCommonFiltered" :key="item.path" :index="item.path" @click="go(item.path)">
            {{ item.label }}
          </el-menu-item>
        </el-menu>

        <template v-if="sectionBusinessFiltered.length">
          <div class="nav-section-title">业务操作</div>
          <el-menu :default-active="activeMenu" unique-opened>
            <el-menu-item v-for="item in sectionBusinessFiltered" :key="item.path" :index="item.path" @click="go(item.path)">
              {{ item.label }}
            </el-menu-item>
          </el-menu>
        </template>

        <template v-if="sectionManageFiltered.length">
          <div class="nav-section-title">基础管理</div>
          <el-menu :default-active="activeMenu" unique-opened>
            <el-menu-item v-for="item in sectionManageFiltered" :key="item.path" :index="item.path" @click="go(item.path)">
              {{ item.label }}
            </el-menu-item>
          </el-menu>
        </template>

        <template v-if="sectionSystemFiltered.length">
          <div class="nav-section-title">系统管理</div>
          <el-menu :default-active="activeMenu" unique-opened>
            <el-menu-item v-for="item in sectionSystemFiltered" :key="item.path" :index="item.path" @click="go(item.path)">
              {{ item.label }}
            </el-menu-item>
          </el-menu>
        </template>

        <div v-if="keyword && !hasAnyFiltered" style="padding: 8px 10px; color: #999; font-size: 13px">
          未找到匹配功能
        </div>
      </div>

      <div class="sidebar-footer-actions">
        <el-button class="sidebar-footer-btn" @click="openChangePassword">修改密码</el-button>
        <el-button class="sidebar-footer-btn" @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main style="flex: 1; background: #fafafa">
      <router-view />
    </main>
  </div>

  <el-dialog v-model="changePwdVisible" title="修改密码" width="460px" :close-on-click-modal="false">
    <el-form label-width="100px">
      <el-form-item label="旧密码" required>
        <el-input v-model="pwdForm.oldPassword" type="password" show-password autocomplete="current-password" />
      </el-form-item>
      <el-form-item label="新密码" required>
        <el-input v-model="pwdForm.newPassword" type="password" show-password autocomplete="new-password" />
      </el-form-item>
      <el-form-item label="确认新密码" required>
        <el-input v-model="pwdForm.confirmPassword" type="password" show-password autocomplete="new-password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="changePwdVisible = false">取消</el-button>
      <el-button type="primary" :loading="changingPwd" @click="submitChangePassword">确认修改</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.nav-section-title {
  font-size: 12px;
  color: #909399;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin: 8px 8px 4px;
}

/* 侧栏底部：两按钮同宽、同列对齐，避免 el-button 默认 margin 导致错位 */
.sidebar-footer-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  box-sizing: border-box;
}

.sidebar-footer-btn {
  width: 100%;
  margin: 0 !important;
  box-sizing: border-box;
}
</style>
