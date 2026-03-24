<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isLogin = computed(() => route.path === '/login')
const role = computed(() => authStore.me?.role)
const isAdmin = computed(() => role.value === 'admin' || role.value === 'super_admin')
const isSuperAdmin = computed(() => role.value === 'super_admin')
const navKeyword = ref('')

const activeMenu = computed(() => {
  // 详情页高亮回“资产列表”，避免看起来像丢失导航位置
  if (route.path.startsWith('/assets/')) return '/assets'
  return route.path
})

const sectionCommon = [
  { path: '/dashboard', label: '仪表盘' },
  { path: '/assets', label: '资产列表' },
  { path: '/records', label: '出入库记录' },
  { path: '/logs', label: '操作日志' },
]

const sectionBusiness = [
  { path: '/stock-in', label: '入库登记' },
  { path: '/stock-out', label: '出库/借用' },
  { path: '/return', label: '归还登记' },
  { path: '/import', label: '导入导出' },
]

const sectionManage = [
  { path: '/templates', label: '设备型号管理' },
  { path: '/departments', label: '部门管理' },
]

const sectionSystem = [
  { path: '/users', label: '用户管理' },
  { path: '/config', label: '系统配置' },
  { path: '/backup', label: '数据备份' },
]

const keyword = computed(() => navKeyword.value.trim().toLowerCase())
function filterByKeyword(items: Array<{ path: string; label: string }>) {
  if (!keyword.value) return items
  return items.filter((x) => x.label.toLowerCase().includes(keyword.value) || x.path.toLowerCase().includes(keyword.value))
}

const sectionCommonFiltered = computed(() => filterByKeyword(sectionCommon))
const sectionBusinessFiltered = computed(() => filterByKeyword(sectionBusiness))
const sectionManageFiltered = computed(() => filterByKeyword(sectionManage))
const sectionSystemFiltered = computed(() => filterByKeyword(sectionSystem))
const hasAnyFiltered = computed(() => {
  return (
    sectionCommonFiltered.value.length > 0 ||
    (isAdmin.value && (sectionBusinessFiltered.value.length > 0 || sectionManageFiltered.value.length > 0)) ||
    (isSuperAdmin.value && sectionSystemFiltered.value.length > 0)
  )
})

function go(path: string) {
  if (route.path !== path) router.push(path)
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <router-view v-if="isLogin" />

  <div v-else style="display: flex; min-height: 100vh">
    <aside style="width: 260px; border-right: 1px solid #eee; background: #fff; display: flex; flex-direction: column">
      <div style="padding: 16px 16px 8px 16px; border-bottom: 1px solid #f0f0f0">
        <div style="font-weight: 800; font-size: 16px">电脑资产管理系统</div>
        <div style="font-size: 12px; color: #888; margin-top: 6px">当前用户：{{ authStore.me?.realName || '-' }}</div>
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

        <template v-if="isAdmin">
          <div class="nav-section-title">业务操作</div>
          <el-menu :default-active="activeMenu" unique-opened>
            <el-menu-item v-for="item in sectionBusinessFiltered" :key="item.path" :index="item.path" @click="go(item.path)">
              {{ item.label }}
            </el-menu-item>
          </el-menu>

          <div class="nav-section-title">基础管理</div>
          <el-menu :default-active="activeMenu" unique-opened>
            <el-menu-item v-for="item in sectionManageFiltered" :key="item.path" :index="item.path" @click="go(item.path)">
              {{ item.label }}
            </el-menu-item>
          </el-menu>
        </template>

        <template v-if="isSuperAdmin">
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

      <div style="padding: 12px; border-top: 1px solid #f0f0f0">
        <el-button style="width: 100%" @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main style="flex: 1; background: #fafafa">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.nav-section-title {
  font-size: 12px;
  color: #909399;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin: 8px 8px 4px;
}
</style>
