<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { apiRequest } from './services/api'
import { useAuthStore } from './stores/auth'
import { useIdleTimer } from './composables/useIdleTimer'
import { changelog } from './data/changelog'
import appPkg from '../package.json'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const appVersion = (appPkg as { version?: string }).version ?? ''

const isLogin = computed(() => route.path === '/login' || route.path === '/sign')
const navKeyword = ref('')
const sidebarCollapsed = ref(false)

const idleWarningVisible = ref(false)
const transferUnreadCount = ref(0)
const transferNoticeShown = ref(false)

const { isWarning: idleIsWarning, remaining: idleRemaining, continueSession, stop: stopIdleTimer, start: startIdleTimer } = useIdleTimer(
  () => { idleWarningVisible.value = true },
  async () => {
    idleWarningVisible.value = false
    await authStore.logout()
    router.push('/login')
    ElMessage.warning('您已超过 10 分钟未操作，系统已自动退出')
  },
)

function onIdleContinue() {
  idleWarningVisible.value = false
  continueSession()
}

watch(isLogin, (login) => {
  if (login) {
    stopIdleTimer()
    idleWarningVisible.value = false
  } else {
    startIdleTimer()
  }
})

const activeMenu = computed(() => {
  if (route.path.startsWith('/assets/')) return '/assets'
  return route.path
})

type NavItem = { path: string; label: string; perm: string; icon: string }

const navIcons: Record<string, string> = {
  dashboard: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  list: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  records: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  log: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  'stock-in': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="12 3 12 15"/><polyline points="8 11 12 15 16 11"/><path d="M20 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"/></svg>',
  'stock-out': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="12 15 12 3"/><polyline points="8 7 12 3 16 7"/><path d="M20 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"/></svg>',
  return: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
  message: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  import: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
  department: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  users: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  role: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  config: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1.08 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z"/></svg>',
  backup: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
}

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
  { path: '/transfer-notifications', label: '调拨消息', perm: 'operations.execute', icon: 'message' },
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

const collapsedSections = ref<Record<string, boolean>>({})
function toggleSection(key: string) {
  collapsedSections.value[key] = !collapsedSections.value[key]
}

const indicatorTop = ref(0)
const sidebarNavRef = ref<HTMLElement | null>(null)

function updateIndicator() {
  nextTick(() => {
    if (!sidebarNavRef.value) return
    const active = sidebarNavRef.value.querySelector('.nav-item.active') as HTMLElement | null
    if (active) {
      indicatorTop.value = active.offsetTop
    }
  })
}

watch(activeMenu, updateIndicator)
onMounted(updateIndicator)

async function loadTransferUnreadCount(showNotice = false) {
  if (!authStore.can('operations.execute')) {
    transferUnreadCount.value = 0
    return
  }
  try {
    const data = await apiRequest<{ unreadCount: number }>('/api/transfer-notifications/unread-count')
    transferUnreadCount.value = data.unreadCount ?? 0
    if (showNotice && transferUnreadCount.value > 0 && !transferNoticeShown.value) {
      transferNoticeShown.value = true
      ElMessage.warning(`您有 ${transferUnreadCount.value} 条跨园区调拨消息待处理`)
    }
  } catch {
    transferUnreadCount.value = 0
  }
}

function onTransferNotificationChanged() {
  loadTransferUnreadCount(false)
}

watch(
  () => [authStore.me?.id, route.path] as const,
  ([id]) => {
    if (!id || isLogin.value) return
    loadTransferUnreadCount(!transferNoticeShown.value)
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('transfer-notifications-changed', onTransferNotificationChanged)
})

onUnmounted(() => {
  window.removeEventListener('transfer-notifications-changed', onTransferNotificationChanged)
})

async function logout() {
  await authStore.logout()
  transferUnreadCount.value = 0
  transferNoticeShown.value = false
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

const CHANGELOG_STORAGE_KEY = 'changelogReadVersions'
const changelogVisible = ref(false)
const displayedChangelog = computed(() => changelog.slice(0, 5))
const hasUnreadChangelog = computed(() => {
  const latest = changelog[0]?.version
  if (!latest) return false
  try {
    const read: string[] = JSON.parse(localStorage.getItem(CHANGELOG_STORAGE_KEY) || '[]')
    return !read.includes(latest)
  } catch { return true }
})

function openChangelog() {
  changelogVisible.value = true
  const latest = changelog[0]?.version
  if (latest) {
    try {
      const read: string[] = JSON.parse(localStorage.getItem(CHANGELOG_STORAGE_KEY) || '[]')
      if (!read.includes(latest)) {
        read.push(latest)
        localStorage.setItem(CHANGELOG_STORAGE_KEY, JSON.stringify(read.slice(-20)))
      }
    } catch {
      localStorage.setItem(CHANGELOG_STORAGE_KEY, JSON.stringify([latest]))
    }
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
          <div class="sidebar-brand-sub">资产管理系统<span v-if="appVersion" class="sidebar-version"> · v{{ appVersion }}</span></div>
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

      <nav class="sidebar-nav" ref="sidebarNavRef">
        <div class="nav-indicator" :style="{ top: indicatorTop + 'px' }"></div>
        <template v-if="sectionCommonFiltered.length">
          <div class="nav-group-label" @click="toggleSection('common')">
            <span>常用</span>
            <svg :class="['nav-group-arrow', { collapsed: collapsedSections.common }]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div :class="['nav-group-items', { collapsed: collapsedSections.common }]">
            <div
              v-for="item in sectionCommonFiltered"
              :key="item.path"
              :class="['nav-item', { active: activeMenu === item.path }]"
              @click="go(item.path)"
            >
              <span class="nav-icon" v-html="navIcons[item.icon]"></span>
              <span class="nav-label">{{ item.label }}</span>
            </div>
          </div>
        </template>

        <template v-if="sectionBusinessFiltered.length">
          <div class="nav-group-label" @click="toggleSection('business')">
            <span>业务操作</span>
            <svg :class="['nav-group-arrow', { collapsed: collapsedSections.business }]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div :class="['nav-group-items', { collapsed: collapsedSections.business }]">
            <div
              v-for="item in sectionBusinessFiltered"
              :key="item.path"
              :class="['nav-item', { active: activeMenu === item.path }]"
              @click="go(item.path)"
            >
              <span class="nav-icon" v-html="navIcons[item.icon]"></span>
              <span class="nav-label">{{ item.label }}</span>
              <el-tag
                v-if="item.path === '/transfer-notifications' && transferUnreadCount"
                type="danger"
                effect="dark"
                size="small"
                round
                class="nav-badge"
              >
                {{ transferUnreadCount }}
              </el-tag>
            </div>
          </div>
        </template>

        <template v-if="sectionManageFiltered.length">
          <div class="nav-group-label" @click="toggleSection('manage')">
            <span>基础管理</span>
            <svg :class="['nav-group-arrow', { collapsed: collapsedSections.manage }]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div :class="['nav-group-items', { collapsed: collapsedSections.manage }]">
            <div
              v-for="item in sectionManageFiltered"
              :key="item.path"
              :class="['nav-item', { active: activeMenu === item.path }]"
              @click="go(item.path)"
            >
              <span class="nav-icon" v-html="navIcons[item.icon]"></span>
              <span class="nav-label">{{ item.label }}</span>
            </div>
          </div>
        </template>

        <template v-if="sectionSystemFiltered.length">
          <div class="nav-group-label" @click="toggleSection('system')">
            <span>系统管理</span>
            <svg :class="['nav-group-arrow', { collapsed: collapsedSections.system }]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div :class="['nav-group-items', { collapsed: collapsedSections.system }]">
            <div
              v-for="item in sectionSystemFiltered"
              :key="item.path"
              :class="['nav-item', { active: activeMenu === item.path }]"
              @click="go(item.path)"
            >
              <span class="nav-icon" v-html="navIcons[item.icon]"></span>
              <span class="nav-label">{{ item.label }}</span>
            </div>
          </div>
        </template>

        <div v-if="keyword && !hasAnyFiltered" class="nav-empty">
          未找到匹配功能
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="sidebar-action-btn" @click="openChangelog">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          版本公告
          <span v-if="hasUnreadChangelog" class="changelog-dot" />
        </button>
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
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
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

  <!-- 版本公告 -->
  <el-dialog v-model="changelogVisible" title="版本更新公告" width="560px">
    <div class="changelog-list">
      <div v-for="entry in displayedChangelog" :key="entry.version" class="changelog-entry">
        <div class="changelog-version-header">
          <el-tag type="primary" effect="dark" size="small">v{{ entry.version }}</el-tag>
          <span class="changelog-date">{{ entry.date }}</span>
        </div>
        <ul class="changelog-changes">
          <li v-for="(c, i) in entry.changes" :key="i">{{ c }}</li>
        </ul>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="changelogVisible = false">知道了</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="idleWarningVisible"
    title="会话即将过期"
    width="420px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    align-center
    class="idle-dialog"
  >
    <div class="idle-dialog-body">
      <div class="idle-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ca-warning)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <div class="idle-text">
        <p class="idle-title">检测到长时间未操作</p>
        <p class="idle-desc">
          为保障账号安全，系统将在
          <span class="idle-countdown">{{ idleRemaining }}</span>
          秒后自动退出登录。
        </p>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" size="large" @click="onIdleContinue" style="width: 100%">
        继续使用
      </el-button>
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

.sidebar-version {
  font-weight: 600;
  color: rgba(199, 210, 254, 0.95);
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
  position: relative;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.nav-indicator {
  position: absolute;
  left: 0;
  width: 3px;
  height: 36px;
  background: #818cf8;
  border-radius: 0 3px 3px 0;
  transition: top 0.25s var(--ca-ease-out-expo);
  box-shadow: 0 0 8px rgba(129, 140, 248, 0.4);
}

.nav-group-label {
  font-size: 10px;
  font-weight: 700;
  color: rgba(165, 180, 252, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 16px 12px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: color var(--ca-transition);
}

.nav-group-label:hover {
  color: rgba(165, 180, 252, 0.7);
}

.nav-group-arrow {
  transition: transform 0.25s var(--ca-ease-out-expo);
}

.nav-group-arrow.collapsed {
  transform: rotate(-90deg);
}

.nav-group-items {
  max-height: 500px;
  overflow: hidden;
  transition: max-height 0.3s var(--ca-ease-out-expo), opacity 0.2s ease;
  opacity: 1;
}

.nav-group-items.collapsed {
  max-height: 0;
  opacity: 0;
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

.nav-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: rgba(165, 180, 252, 0.5);
  transition: all var(--ca-transition);
}

.nav-item.active .nav-icon {
  color: #818cf8;
  filter: drop-shadow(0 0 4px rgba(129, 140, 248, 0.5));
}

.nav-item:hover .nav-icon {
  color: rgba(199, 210, 254, 0.9);
  transform: scale(1.1);
}

.nav-label {
  font-size: 13px;
  color: rgba(224, 231, 255, 0.8);
  font-weight: 500;
  transition: color var(--ca-transition);
  flex: 1;
  min-width: 0;
}

.nav-badge {
  flex-shrink: 0;
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

.changelog-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  margin-left: auto;
  flex-shrink: 0;
}

.changelog-list {
  max-height: 60vh;
  overflow-y: auto;
}

.changelog-entry {
  padding: 12px 0;
  border-bottom: 1px dashed var(--ca-border-light);
}

.changelog-entry:last-child {
  border-bottom: none;
}

.changelog-version-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.changelog-date {
  font-size: 13px;
  color: var(--ca-text-secondary);
}

.changelog-changes {
  margin: 0;
  padding-left: 20px;
  color: var(--ca-text-primary);
  font-size: 14px;
  line-height: 1.7;
}

.main-content {
  flex: 1;
  background: var(--ca-bg);
  min-height: 100vh;
  overflow-x: hidden;
}

.idle-dialog-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px 0;
}

.idle-icon {
  margin-bottom: 16px;
  animation: idle-pulse 2s ease-in-out infinite;
}

@keyframes idle-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.85; }
}

.idle-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--ca-text-primary);
  margin: 0 0 8px;
}

.idle-desc {
  font-size: 14px;
  color: var(--ca-text-secondary);
  margin: 0;
  line-height: 1.6;
}

.idle-countdown {
  display: inline-block;
  font-size: 22px;
  font-weight: 800;
  color: var(--ca-warning);
  min-width: 28px;
  font-variant-numeric: tabular-nums;
}
</style>
