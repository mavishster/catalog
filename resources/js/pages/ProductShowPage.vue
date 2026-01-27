<template>
  <section>
    <el-button type="default" size="small" @click="$emit('back')" class="mb-4">← Назад</el-button>

    <el-alert v-if="error" :title="error" type="error" show-icon class="mb-4" />

    <div v-loading="loading">
      <template v-if="product">
        <h2 class="text-xl font-semibold mb-2">{{ product.name }}</h2>
        <p class="text-sm text-gray-500 mb-4">Категория: {{ product.category?.name || '—' }}</p>

        <el-descriptions :column="1" border class="mb-6">
          <el-descriptions-item label="Цена">{{ priceText }}</el-descriptions-item>
          <el-descriptions-item label="Описание">
            <div class="whitespace-pre-line">{{ product.description || '—' }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </template>

      <el-empty v-else-if="!loading && !product" description="Товар не найден" />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useProductApi } from '../composables/useProductApi'

const props = defineProps({ id: { type: [String, Number], required: true } })
const { get, loading, error } = useProductApi()
const product = ref(null)

const priceText = computed(() => {
  const n = Number(product.value?.price || 0)
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(n)
})

async function fetchItem() {
  try {
    const res = await get(props.id)
    product.value = res.data || null
  } catch (_) {
    product.value = null
  }
}

onMounted(fetchItem)
watch(() => props.id, fetchItem)
</script>

<style scoped>
</style>
