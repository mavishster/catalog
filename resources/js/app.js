import '../css/app.css'
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createPinia } from 'pinia'
import ElementPlus, { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'

// Настроенный axios с перехватчиками (и глобалями, как в catalog.js)
import axios from './plugins/axios'
// Доступ глобально для существующих composables
window.axios = axios
window.ElMessage = ElMessage

createInertiaApp({
  resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob('./pages/**/*.vue')),
  setup({ el, App, props, plugin }) {
    const app = createApp({ render: () => h(App, props) })
    const pinia = createPinia()

    app.use(plugin)
    app.use(pinia)
    app.use(ElementPlus)

    app.mount(el)
  },
})
