<template>
  <div>
    <header class="border-b px-4 py-3 flex items-center justify-between">
      <h1 class="text-lg font-semibold">Каталог Товаров</h1>
      <nav class="text-sm">
        <a class="hover:underline" href="/login">Login</a>
      </nav>
    </header>
    <main class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <ProductListPage @open="openProduct" />
    </main>
  </div>

</template>

<script setup>
import ProductListPage from './ProductListPage.vue'
import { router } from '@inertiajs/vue3'

function openProduct(id) {
  router.visit(`/product/${id}`)
}
</script>

<style scoped>
</style>
