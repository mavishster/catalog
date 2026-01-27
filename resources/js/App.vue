<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
    <header class="border-b px-4 py-3 flex items-center justify-between">
      <h1 class="text-lg font-semibold">Каталог Товаров</h1>
      <nav class="flex items-center gap-3 text-sm">
        <template v-if="isAuth">
          <a href="/admin/products" class="hover:underline">Управление товарами</a>
          <span class="opacity-30">|</span>
          <button class="hover:underline" @click="logout">Выйти</button>
        </template>
        <template v-else>
          <a href="/" class="hover:underline">Главная</a>
          <template v-if="currentRoute.name !== 'login'">
            <span class="opacity-30">|</span>
            <a href="/login" class="hover:underline">Login</a>
          </template>
        </template>
      </nav>
    </header>

    <main class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <ProductListPage v-if="currentRoute.name === 'list'" @open="goToProduct" />
      <ProductShowPage v-else-if="currentRoute.name === 'show'" :id="currentRoute.params.id" @back="goHome" />
      <LoginPage v-else-if="currentRoute.name === 'login'" />
      <AdminProductsPage v-else-if="currentRoute.name === 'admin-products'" />
      <AdminProductFormPage v-else-if="currentRoute.name === 'admin-create'" mode="create" />
      <AdminProductFormPage v-else-if="currentRoute.name === 'admin-edit'" mode="edit" :id="currentRoute.params.id" />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import ProductListPage from './pages/ProductListPage.vue'
import ProductShowPage from './pages/ProductShowPage.vue'
import LoginPage from './pages/LoginPage.vue'
import AdminProductsPage from './pages/admin/AdminProductsPage.vue'
import AdminProductFormPage from './pages/admin/AdminProductFormPage.vue'
import { useAuthStore } from './stores/auth'

function parseRoute() {
  const path = window.location.pathname
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

const auth = useAuthStore()
const isAuth = computed(() => auth.isAuthenticated)

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

function logout() {
  auth.logout()
}
</script>

<style scoped>
</style>
