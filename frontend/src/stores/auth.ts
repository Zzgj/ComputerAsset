import { defineStore } from 'pinia'
import { apiRequest } from '../services/api'

export type UserRole = 'super_admin' | 'admin' | 'viewer'

export type Me = {
  id: number
  username: string
  realName: string
  role: UserRole
  mustChangePass: boolean
}

type LoginResponse = { token: string; me: Me }

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
    me: null as Me | null,
    hydrated: false,
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
    },
    async login(username: string, password: string) {
      const data = await apiRequest<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      })
      this.setToken(data.token)
      this.me = data.me
    },
    async fetchMe() {
      const data = await apiRequest<{ me: Me }>('/api/auth/me', { method: 'GET' })
      this.me = data.me
    },
    logout() {
      this.clearToken()
      this.me = null
    },
  },
})

