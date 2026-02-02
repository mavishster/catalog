import '../css/app.css'
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createPinia } from 'pinia'
import ElementPlus, { ElMessage, ElLoading } from 'element-plus'
import ru from 'element-plus/es/locale/lang/ru'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import axios from './plugins/axios'
window.axios = axios
window.ElMessage = ElMessage

import { useAuthStore } from './stores/auth'
import AppLayout from './App.vue'

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob('./Pages/**/*.vue')
        ).then((module) => {
            if (module.default) {
                module.default.layout = module.default.layout || ((h, page) => h(AppLayout, { isPersistent: true }, () => page))
            }
            return module
        }),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) })
        const pinia = createPinia()

        // Global plugins
        app.use(plugin)
        app.use(pinia)
        app.use(ElementPlus, { size: 'small', locale: ru }) // smaller buttons/inputs

        // Global properties
        app.config.globalProperties.$loading = ElLoading.service

        // Initialize auth store
        const auth = useAuthStore(pinia)
        auth.init()

        // Global registration of Element Plus icons
        try {
            for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
                app.component(key, component)
            }
        } catch (_) {}

        app.mount(el)
    },
})
