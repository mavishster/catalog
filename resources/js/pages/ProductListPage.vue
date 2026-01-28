<template>
  <section>
    <el-card class="mb-4" shadow="never">
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Категория</span>
          <CategorySelect v-model="filters.category" />
        </div>

        <el-input
          v-model="searchInput"
          placeholder="Поиск товаров (название, описание)"
          clearable
          class="w-full sm:w-80"
          :prefix-icon="Search"
        />

        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">На странице</span>
          <el-select v-model="perPage" class="w-28">
            <el-option v-for="n in perPageOptions" :key="n" :label="String(n)" :value="n" />
          </el-select>
        </div>

        <div class="sm:ml-auto flex items-center gap-3">
          <span class="text-sm text-gray-500">Всего: {{ meta.total }}</span>
          <el-button size="small" @click="resetFilters">Сбросить</el-button>
        </div>
      </div>
    </el-card>

    <el-alert v-if="error" :title="error" type="error" show-icon class="mb-4" />

    <div v-loading="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="p in items"
        :key="p.id"
        :product="p"
        @open="$emit('open', p.id)"
      />
    </div>

    <el-empty v-if="!loading && items.length === 0" description="Нет товаров" class="mt-6" />

    <div class="mt-6 flex justify-center">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="page"
        :page-size="perPage"
        :total="meta.total"
        @current-change="onPageChange"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useProductApi } from '../composables/useProductApi'
import ProductCard from '../components/ProductCard.vue'
import CategorySelect from '../components/filters/CategorySelect.vue'
import { Search } from '@element-plus/icons-vue'
import { useDebouncedRef } from '../composables/useDebounce'

const emit = defineEmits(['open'])

const { list, loading, error } = useProductApi()
const items = ref([])
const meta = ref({ page: 1, per_page: 12, total: 0, last_page: 1 })
const page = ref(1)
const perPage = ref(12)
const perPageOptions = [12, 24, 48]
const filters = ref({ category: null, q: '' })

const { input: searchInput, debounced: debouncedSearch } = useDebouncedRef('', 400)
watch(debouncedSearch, (v) => {
  filters.value.q = v
  page.value = 1
  fetchItems()
})

watch(() => filters.value.category, () => {
  page.value = 1
  fetchItems()
})

watch(perPage, () => {
  page.value = 1
  fetchItems()
})

function onPageChange(p) {
  page.value = p
  fetchItems()
}

async function fetchItems() {
  try {
    const res = await list({
      page: page.value,
      per_page: perPage.value,
      category: filters.value.category,
      q: filters.value.q || undefined,
    })
    items.value = Array.isArray(res.data) ? res.data : []
    meta.value = res.meta || meta.value
  } catch (_) {
    // error реактивен из composable
  }
}

function resetFilters() {
  filters.value = { category: null, q: '' }
  searchInput.value = ''
  page.value = 1
  perPage.value = 12
  fetchItems()
}

onMounted(() => {
  fetchItems()
})
</script>

<style scoped>
</style>
