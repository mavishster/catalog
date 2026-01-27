import { defineStore } from 'pinia'
import axios from '../plugins/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    init() {
      try {
        const t = localStorage.getItem('token')
        if (t) {
          this.token = t
          axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
        }
      } catch (_) {}

      // мост для axios-плагина
      window.__authTokenAccessor = () => this.token
      window.__authLogout = () => this.logout()
    },
    async login(email, password, remember = true) {
      const { data } = await axios.post('/api/v1/login', { email, password, remember })
      const token = data?.token || data?.data?.token
      if (!token) {
        throw new Error('Токен не получен')
      }
      this.token = token
      try { localStorage.setItem('token', token) } catch (_) {}
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      return token
    },
    logout() {
      this.token = null
      try { localStorage.removeItem('token') } catch (_) {}
      delete axios.defaults.headers.common['Authorization']
      // уведомление и редирект
      if (window.ElMessage) {
        window.ElMessage.info('Требуется авторизация')
      }
      // событие для совместимости
      window.dispatchEvent(new CustomEvent('auth:logout'))
      // мгновенный редирект на /login
      try { if (location.pathname !== '/login') window.location.href = '/login' } catch (_) {}
    }
  }
})
