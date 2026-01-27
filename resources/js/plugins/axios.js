    import axios from 'axios'

    // Инициализация Authorization из localStorage при загрузке
    try {
      const token = localStorage.getItem('token')
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    } catch (_) {}

    // Request: всегда подставлять актуальный токен из стора (fallback: localStorage)
    axios.interceptors.request.use((config) => {
      try {
        const fromStore = typeof window.__authTokenAccessor === 'function' ? window.__authTokenAccessor() : null
        const token = fromStore || localStorage.getItem('token')
        if (token) {
          config.headers = config.headers || {}
          config.headers['Authorization'] = `Bearer ${token}`
        }
      } catch (_) {}
      return config
    })

    // Response: унифицированные сообщения и обработка 401/403/404
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status

        if (status === 401) {
          // централизованный logout из стора (если доступен)
          if (typeof window.__authLogout === 'function') {
            try { window.__authLogout() } catch (_) {}
          } else {
            try { localStorage.removeItem('token') } catch (_) {}
            delete axios.defaults.headers.common['Authorization']
            window.dispatchEvent(new CustomEvent('auth:logout'))
          }
          if (error.response) {
            error.response.data = { message: 'Требуется авторизация' }
          }
          try {
            const onLoginPage = typeof window !== 'undefined' && window.location && window.location.pathname === '/login'
            if (!onLoginPage && window.ElMessage) {
              window.ElMessage.error('Требуется авторизация')
            }
          } catch (_) {}
        } else if (status === 403) {
          if (error.response) {
            error.response.data = { message: 'Нет доступа' }
          }
          if (window.ElMessage) {
            window.ElMessage.error('Нет доступа')
          }
        } else if (status === 404) {
          if (error.response) {
            error.response.data = { message: 'Не найдено' }
          }
        } else if (!error?.response?.data?.message) {
          // Общее сообщение по умолчанию
          if (error.response) {
            error.response.data = { message: 'Произошла ошибка. Попробуйте позже.' }
          }
        }

        return Promise.reject(error)
      }
    )

    export default axios
