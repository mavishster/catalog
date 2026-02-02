<template>
  <!-- App layout -->
  <el-container class="min-h-screen bg-gray-50 text-gray-900">
    <el-header class="bg-white border-b !h-auto shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="text-xl font-bold text-gray-800">Каталог Товаров</span>
        </div>

        <nav class="flex items-center gap-2">
          <template v-if="isAuth">
            <el-button text size="small" @click="go('/admin/products')">Управление товарами</el-button>
            <el-divider direction="vertical" class="hidden sm:block" />
            <el-button type="primary" size="default" @click="logout">Выйти</el-button>
          </template>
          <template v-else>
            <el-button v-if="currentRoute.name === 'login'" type="primary" size="default" @click="go('/')">Главная</el-button>
            <el-button v-else type="primary" size="default" @click="go('/login')">Вход</el-button>
          </template>
        </nav>
      </div>
    </el-header>

    <el-main class="flex-1 flex flex-col p-0">
      <div class="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col"
           :class="currentRoute.name === 'login' ? 'items-center justify-center' : ''">
        <slot v-if="isPersistent">
          <!-- Page content goes here when used as persistent layout -->
        </slot>
        <template v-else>
          <LoginPage v-if="currentRoute.name === 'login'" />
          <ProductListPage v-else-if="currentRoute.name === 'list'" @open="goToProduct" />
          <ProductShowPage v-else-if="currentRoute.name === 'show'" :id="currentRoute.params.id" @back="goHome" />
          <AdminProductsPage v-else-if="currentRoute.name === 'admin-products'" />
          <AdminProductFormPage v-else-if="currentRoute.name === 'admin-create'" mode="create" />
          <AdminProductFormPage v-else-if="currentRoute.name === 'admin-edit'" mode="edit" :id="currentRoute.params.id" />
        </template>
      </div>
    </el-main>

    <footer class="bg-white border-t px-6 py-4 text-center text-gray-500 text-sm">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>&copy; 2026 My Catalog App</div>
      </div>
    </footer>

    <el-backtop :right="20" :bottom="20" />
  </el-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import ProductListPage from './Pages/ProductListPage.vue'
import ProductShowPage from './Pages/Product/ProductShow.vue'
import LoginPage from './Pages/LoginPage.vue'
import AdminProductsPage from './Pages/admin/AdminProductsPage.vue'
import AdminProductFormPage from './Pages/admin/AdminProductFormPage.vue'
import { useAuth } from './composables/useAuth'

const props = defineProps({
  isPersistent: {
    type: Boolean,
    default: false
  }
})

function parseRoute() {
  const path = window.location.pathname

  if (props.isPersistent) {
      // In Inertia mode, we can try to map current path to route names for UI highlighting
      if (path === '/') return { name: 'list', params: {} }
      if (path === '/login') return { name: 'login', params: {} }
      const match = path.match(/^\/product\/(\d+)$/)
      if (match) return { name: 'show', params: { id: Number(match[1]) } }
      // ... we could add more, but for header/footer visibility this is mostly enough
  }

  // /product/{id}
  const match = path.match(/^\/product\/(\d+)$/)
  if (match) {
    return { name: 'show', params: { id: Number(match[1]) } }
  }
  if (path === '/login') {
    return { name: 'login', params: {} }
  }
  if (path === '/admin/products') {
    return { name: 'admin-products', params: {} }
  }
  if (path === '/admin/products/create') {
    return { name: 'admin-create', params: {} }
  }
  const editMatch = path.match(/^\/admin\/products\/(\d+)\/edit$/)
  if (editMatch) {
    return { name: 'admin-edit', params: { id: Number(editMatch[1]) } }
  }
  return { name: 'list', params: {} }
}

const currentRoute = computed(() => parseRoute())

function goToProduct(id) {
  window.location.href = `/product/${id}`
}
function goHome() {
  window.location.href = `/`
}

const { isAuthenticated, logout: doLogout } = useAuth()
const isAuth = isAuthenticated

onMounted(() => {
  // Simple guard for admin routes
  const adminRoutes = ['admin-products', 'admin-create', 'admin-edit']
  if (adminRoutes.includes(currentRoute.value.name) && !isAuth.value) {
    window.location.href = '/login'
  }

  // Реакция на глобальное событие logout (на случай вызова из перехватчика)
  window.addEventListener('auth:logout', () => {
    try { if (location.pathname !== '/login') window.location.href = '/login' } catch (_) {}
  })
})

// метод остаётся для совместимости с шаблоном
function logout() { doLogout() }

function go(path) {
  try { window.location.href = path } catch (_) {}
}
</script>

<style scoped>
</style>
