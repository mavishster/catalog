import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

export function useAuth() {
  const store = useAuthStore()

  const isAuthenticated = computed(() => store.isAuthenticated)
  const token = computed(() => store.token)

  const init = () => store.init()
  const login = (email, password, remember = true) => store.login(email, password, remember)
  const logout = () => store.logout()

  return { isAuthenticated, token, init, login, logout }
}
