<template>
  <div class="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
    <ProductShowPage :id="id" @back="goBack" />
  </div>

</template>

<script setup>
import { router } from '@inertiajs/vue3'
import ProductShowPage from '@/pages/ProductShowPage.vue'

const props = defineProps({ id: { type: [String, Number], required: true } })

function goBack() {
  router.visit('/')
}
</script>

<style scoped>
</style>
