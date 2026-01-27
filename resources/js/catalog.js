import './bootstrap'
import '../css/app.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus, { ElMessage } from 'element-plus'
import App from './App.vue'
import { useAuthStore } from './stores/auth'

// Подключаем настроенный axios с перехватчиками
import axios from './plugins/axios'
// Глобально: для совместимости с текущими composables
window.axios = axios

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(ElementPlus)

// Делает ElMessage доступным глобально для перехватчиков и страниц
window.ElMessage = ElMessage

// Инициализируем auth‑store и мост для перехватчиков
try {
  const auth = useAuthStore()
  auth.init()
} catch (_) {}
app.mount('#app')
