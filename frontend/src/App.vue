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
const sidebarCollapsed = ref(false)

const activeMenu = computed(() => {
  if (route.path.startsWith('/assets/')) return '/assets'
  return route.path
})

type NavItem = { path: string; label: string; perm: string; icon: string }

const sectionCommon: NavItem[] = [
  { path: '/dashboard', label: '仪表盘', perm: 'dashboard.view', icon: 'dashboard' },
  { path: '/assets', label: '资产列表', perm: 'assets.read', icon: 'list' },
  { path: '/records', label: '出入库记录', perm: 'records.read', icon: 'records' },
  { path: '/logs', label: '操作日志', perm: 'logs.read', icon: 'log' },
]

const sectionBusiness: NavItem[] = [
  { path: '/stock-in', label: '入库登记', perm: 'assets.write', icon: 'stock-in' },
  { path: '/stock-out', label: '出库/借用', perm: 'operations.execute', icon: 'stock-out' },
  { path: '/return', label: '归还登记', perm: 'operations.execute', icon: 'return' },
  { path: '/import', label: '导入导出', perm: 'excel.import', icon: 'import' },
]

const sectionManage: NavItem[] = [
  { path: '/templates', label: '设备型号管理', perm: 'templates.manage', icon: 'template' },
  { path: '/departments', label: '部门管理', perm: 'departments.manage', icon: 'department' },
]

const sectionSystem: NavItem[] = [
  { path: '/users', label: '用户管理', perm: 'users.manage', icon: 'users' },
  { path: '/roles', label: '角色权限', perm: 'roles.manage', icon: 'role' },
  { path: '/config', label: '系统配置', perm: 'config.manage', icon: 'config' },
  { path: '/backup', label: '数据备份', perm: 'backup.run', icon: 'backup' },
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

  <div v-else class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <div class="sidebar-brand-text">
          <div class="sidebar-brand-name">ComputerAsset</div>
          <div class="sidebar-brand-sub">资产管理系统</div>
        </div>
      </div>

      <div class="sidebar-user">
        <div class="user-avatar">
          {{ (authStore.me?.realName || 'U').charAt(0) }}
        </div>
        <div class="user-info">
          <div class="user-name">{{ authStore.me?.realName || '-' }}</div>
          <div class="user-role">{{ authStore.me?.accessRole?.name ?? '' }}</div>
        </div>
      </div>

      <div class="sidebar-search">
        <el-input
          v-model="navKeyword"
          clearable
          placeholder="搜索功能..."
          size="small"
          class="nav-search"
        />
      </div>

      <nav class="sidebar-nav">
        <template v-if="sectionCommonFiltered.length">
          <div class="nav-group-label">常用</div>
          <div
            v-for="item in sectionCommonFiltered"
            :key="item.path"
            :class="['nav-item', { active: activeMenu === item.path }]"
            @click="go(item.path)"
          >
            <span class="nav-dot"></span>
            <span class="nav-label">{{ item.label }}</span>
          </div>
        </template>

        <template v-if="sectionBusinessFiltered.length">
          <div class="nav-group-label">业务操作</div>
          <div
            v-for="item in sectionBusinessFiltered"
            :key="item.path"
            :class="['nav-item', { active: activeMenu === item.path }]"
            @click="go(item.path)"
          >
            <span class="nav-dot"></span>
            <span class="nav-label">{{ item.label }}</span>
          </div>
        </template>

        <template v-if="sectionManageFiltered.length">
          <div class="nav-group-label">基础管理</div>
          <div
            v-for="item in sectionManageFiltered"
            :key="item.path"
            :class="['nav-item', { active: activeMenu === item.path }]"
            @click="go(item.path)"
          >
            <span class="nav-dot"></span>
            <span class="nav-label">{{ item.label }}</span>
          </div>
        </template>

        <template v-if="sectionSystemFiltered.length">
          <div class="nav-group-label">系统管理</div>
          <div
            v-for="item in sectionSystemFiltered"
            :key="item.path"
            :class="['nav-item', { active: activeMenu === item.path }]"
            @click="go(item.path)"
          >
            <span class="nav-dot"></span>
            <span class="nav-label">{{ item.label }}</span>
          </div>
        </template>

        <div v-if="keyword && !hasAnyFiltered" class="nav-empty">
          未找到匹配功能
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="sidebar-action-btn" @click="openChangePassword">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          修改密码
        </button>
        <button class="sidebar-action-btn logout" @click="logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          退出登录
        </button>
      </div>
    </aside>

    <main class="main-content">
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
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: var(--ca-bg-sidebar);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 16px;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c7d2fe;
  flex-shrink: 0;
}

.sidebar-brand-name {
  font-weight: 800;
  font-size: 16px;
  color: #fff;
  letter-spacing: -0.01em;
}

.sidebar-brand-sub {
  font-size: 11px;
  color: rgba(165, 180, 252, 0.7);
  margin-top: 1px;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(135deg, #818cf8, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #e0e7ff;
}

.user-role {
  font-size: 11px;
  color: rgba(165, 180, 252, 0.6);
}

.sidebar-search {
  padding: 12px 12px 4px;
}

.nav-search :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.08) !important;
  box-shadow: none !important;
  border-radius: 8px !important;
}

.nav-search :deep(.el-input__inner) {
  color: #e0e7ff !important;
}

.nav-search :deep(.el-input__inner::placeholder) {
  color: rgba(165, 180, 252, 0.4) !important;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.nav-group-label {
  font-size: 10px;
  font-weight: 700;
  color: rgba(165, 180, 252, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 16px 12px 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--ca-transition);
  margin: 1px 0;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.12);
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(165, 180, 252, 0.3);
  flex-shrink: 0;
  transition: all var(--ca-transition);
}

.nav-item.active .nav-dot {
  background: #818cf8;
  box-shadow: 0 0 8px rgba(129, 140, 248, 0.5);
}

.nav-label {
  font-size: 13px;
  color: rgba(224, 231, 255, 0.8);
  font-weight: 500;
  transition: color var(--ca-transition);
}

.nav-item.active .nav-label {
  color: #fff;
  font-weight: 600;
}

.nav-item:hover .nav-label {
  color: #e0e7ff;
}

.nav-empty {
  padding: 12px;
  color: rgba(165, 180, 252, 0.4);
  font-size: 13px;
  text-align: center;
}

.sidebar-footer {
  flex-shrink: 0;
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(165, 180, 252, 0.6);
  font-size: 13px;
  font-family: var(--ca-font);
  cursor: pointer;
  transition: all var(--ca-transition);
}

.sidebar-action-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #e0e7ff;
}

.sidebar-action-btn.logout:hover {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.1);
}

.main-content {
  flex: 1;
  background: var(--ca-bg);
  min-height: 100vh;
  overflow-x: hidden;
}
</style>
