import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '../stores/auth'

// 首屏热路径页面保持 eager import：登录后立即用到，懒加载会引入额外 chunk 请求
import LoginPage from '../pages/LoginPage.vue'
import SignaturePage from '../pages/SignaturePage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import AssetsPage from '../pages/AssetsPage.vue'

// 其余页面按需异步加载，Vite 自动 code-split
const AssetDetailPage = () => import('../pages/AssetDetailPage.vue')
const StockInPage = () => import('../pages/StockInPage.vue')
const StockOutPage = () => import('../pages/StockOutPage.vue')
const ReturnPage = () => import('../pages/ReturnPage.vue')
const RecordsPage = () => import('../pages/RecordsPage.vue')
const TemplatesPage = () => import('../pages/TemplatesPage.vue')
const DepartmentsPage = () => import('../pages/DepartmentsPage.vue')
const UsersPage = () => import('../pages/UsersPage.vue')
const RolesPage = () => import('../pages/RolesPage.vue')
const ConfigPage = () => import('../pages/ConfigPage.vue')
const LogsPage = () => import('../pages/LogsPage.vue')
const ImportPage = () => import('../pages/ImportPage.vue')
const BackupPage = () => import('../pages/BackupPage.vue')
const TransferNotificationsPage = () => import('../pages/TransferNotificationsPage.vue')
const EmployeesPage = () => import('../pages/EmployeesPage.vue')
const EmployeeDetailPage = () => import('../pages/EmployeeDetailPage.vue')

type Meta = {
  public?: boolean
  requiresAuth?: boolean
  /** 满足任一权限即可进入（超级管理员 bypass 时直接放行） */
  permissions?: string[]
  title?: string
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { public: true } satisfies Meta,
    },
    {
      path: '/sign',
      name: 'sign',
      component: SignaturePage,
      meta: { public: true } satisfies Meta,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true, permissions: ['dashboard.view'], title: '仪表盘' } satisfies Meta,
    },
    {
      path: '/assets',
      name: 'assets',
      component: AssetsPage,
      meta: { requiresAuth: true, permissions: ['assets.read'], title: '资产列表' } satisfies Meta,
    },
    {
      path: '/assets/:id',
      name: 'assetDetail',
      component: AssetDetailPage,
      meta: { requiresAuth: true, permissions: ['assets.read'], title: '资产详情' } satisfies Meta,
    },
    {
      path: '/stock-in',
      name: 'stockIn',
      component: StockInPage,
      meta: { requiresAuth: true, permissions: ['assets.write'], title: '入库登记' } satisfies Meta,
    },
    {
      path: '/stock-out',
      name: 'stockOut',
      component: StockOutPage,
      meta: { requiresAuth: true, permissions: ['operations.execute'], title: '出库/借用' } satisfies Meta,
    },
    {
      path: '/return',
      name: 'return',
      component: ReturnPage,
      meta: { requiresAuth: true, permissions: ['operations.execute'], title: '归还登记' } satisfies Meta,
    },
    {
      path: '/transfer-notifications',
      name: 'transferNotifications',
      component: TransferNotificationsPage,
      meta: { requiresAuth: true, permissions: ['operations.execute'], title: '调拨消息' } satisfies Meta,
    },
    {
      path: '/records',
      name: 'records',
      component: RecordsPage,
      meta: { requiresAuth: true, permissions: ['records.read'], title: '出入库记录' } satisfies Meta,
    },
    {
      path: '/employees',
      name: 'employees',
      component: EmployeesPage,
      meta: { requiresAuth: true, permissions: ['employees.read'], title: '员工管理' } satisfies Meta,
    },
    {
      path: '/employees/:id',
      name: 'employeeDetail',
      component: EmployeeDetailPage,
      meta: { requiresAuth: true, permissions: ['employees.read'], title: '员工详情' } satisfies Meta,
    },
    {
      path: '/templates',
      name: 'templates',
      component: TemplatesPage,
      meta: { requiresAuth: true, permissions: ['templates.manage'], title: '设备型号管理' } satisfies Meta,
    },
    {
      path: '/departments',
      name: 'departments',
      component: DepartmentsPage,
      meta: { requiresAuth: true, permissions: ['departments.manage'], title: '部门管理' } satisfies Meta,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersPage,
      meta: { requiresAuth: true, permissions: ['users.manage'], title: '用户管理' } satisfies Meta,
    },
    {
      path: '/roles',
      name: 'roles',
      component: RolesPage,
      meta: { requiresAuth: true, permissions: ['roles.manage'], title: '角色权限' } satisfies Meta,
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigPage,
      meta: { requiresAuth: true, permissions: ['config.manage'], title: '系统配置' } satisfies Meta,
    },
    {
      path: '/logs',
      name: 'logs',
      component: LogsPage,
      meta: { requiresAuth: true, permissions: ['logs.read'], title: '操作日志' } satisfies Meta,
    },
    {
      path: '/import',
      name: 'import',
      component: ImportPage,
      meta: {
        requiresAuth: true,
        permissions: ['excel.import', 'excel.export'],
        title: '导入导出',
      } satisfies Meta,
    },
    {
      path: '/backup',
      name: 'backup',
      component: BackupPage,
      meta: { requiresAuth: true, permissions: ['backup.run'], title: '数据备份' } satisfies Meta,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const meta = (to.meta ?? {}) as Meta
  if (meta.public) return next()

  const authStore = useAuthStore()
  authStore.hydrate()

  if (!authStore.token) {
    return next('/login')
  }

  // fetchMe 内部已含 5 分钟缓存：me 已存在且未过期时直接返回，仅在过期或首次调用才发请求
  try {
    await authStore.fetchMe()
  } catch {
    await authStore.logout()
    return next('/login')
  }

  const required = meta.permissions
  if (required?.length) {
    const bypass = authStore.me?.bypassAll
    if (!bypass) {
      const hasPermission = required.some((p) => authStore.can(p))
      if (!hasPermission) {
        const { ElMessage } = await import('element-plus')
        ElMessage.warning('您没有访问该页面的权限')
        return next('/dashboard')
      }
    }
  }

  return next()
})

export default router
