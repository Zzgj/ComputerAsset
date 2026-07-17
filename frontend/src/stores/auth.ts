import { defineStore } from 'pinia'
import { apiRequest } from '../services/api'

export type Me = {
  id: number
  username: string
  realName: string
  mustChangePass: boolean
  bypassAll: boolean
  permissions: string[]
  campusesAll: boolean
  campusIds: number[]
  accessRole: { id: number; name: string; slug: string }
}

type LoginResponse = { token: string; me: Me }

/** fetchMe 缓存有效期（毫秒）。短过 LRU TTL 也够用：路由守卫每跳一次就用得上。 */
const ME_TTL_MS = 5 * 60 * 1000

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
    me: null as Me | null,
    hydrated: false,
    /** 上次 fetchMe 成功时间戳，用于判断是否仍在 5 分钟缓存窗口内 */
    meHydratedAt: 0,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    hydrate() {
      if (this.hydrated) return
      const token = localStorage.getItem('token')
      this.token = token
      this.hydrated = true
    },
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    clearToken() {
      this.token = null
      localStorage.removeItem('token')
      this.meHydratedAt = 0
    },
    can(permission: string): boolean {
      if (!this.me) return false
      if (this.me.bypassAll) return true
      return this.me.permissions.includes(permission)
    },
    async login(username: string, password: string) {
      const data = await apiRequest<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      })
      this.setToken(data.token)
      this.me = data.me
      this.meHydratedAt = Date.now()
    },
    async fetchMe() {
      if (this.me && Date.now() - this.meHydratedAt < ME_TTL_MS) {
        return
      }
      const data = await apiRequest<{ me: Me }>('/api/auth/me', { method: 'GET' })
      this.me = data.me
      this.meHydratedAt = Date.now()
    },
    async logout() {
      if (this.token) {
        try {
          await apiRequest('/api/auth/logout', { method: 'POST' })
        } catch {
          // Ignore logout-log failure and still clear local auth state.
        }
      }
      this.clearToken()
      this.me = null
    },
  },
})
