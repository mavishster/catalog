import './bootstrap'
import '../css/app.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus, { ElMessage } from 'element-plus'
import ru from 'element-plus/es/locale/lang/ru'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import { useAuth } from './composables/useAuth'

// Подключаем настроенный axios с перехватчиками
import axios from './plugins/axios'
// Глобально: для совместимости с текущими composables
window.axios = axios

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(ElementPlus, { locale: ru })

// Глобальная регистрация иконок Element Plus
try {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
} catch (_) {}

// Делает ElMessage доступным глобально для перехватчиков и страниц
window.ElMessage = ElMessage

// Инициализируем авторизацию и мосты для перехватчиков через composable
try {
  const { init } = useAuth()
  init()
} catch (_) {}
app.mount('#app')
