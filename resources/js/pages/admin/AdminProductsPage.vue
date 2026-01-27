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
          placeholder="Поиск (название, описание)"
          clearable
          class="w-full sm:w-80"
          :prefix-icon="Search"
        />

        <div class="sm:ml-auto flex items-center gap-3">
          <span class="text-sm text-gray-500">Всего: {{ meta.total }}</span>
          <el-button type="primary" @click="goCreate">Добавить товар</el-button>
        </div>
      </div>
    </el-card>

    <el-alert v-if="error" :title="error" type="error" show-icon class="mb-4" />

    <el-table :data="items" v-loading="loading" border>
      <el-table-column prop="id" label="#" width="70" />
      <el-table-column prop="name" label="Название" />
      <el-table-column label="Категория" width="180">
        <template #default="{ row }">
          {{ row.category?.name || '—' }}
        </template>
      </el-table-column>
      <el-table-column label="Цена" width="140">
        <template #default="{ row }">
          {{ formatPrice(row.price) }}
        </template>
      </el-table-column>
      <el-table-column label="Действия" width="220" fixed="right">
        <template #default="{ row }">
          <div class="flex gap-2">
            <el-button size="small" @click="goEdit(row.id)">Редактировать</el-button>
            <el-button size="small" type="danger" @click="confirmDelete(row)">Удалить</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

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
import { ref, onMounted, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import CategorySelect from '../../components/filters/CategorySelect.vue'
import { useAdminProductApi } from '../../composables/useAdminProductApi'
import { ElMessageBox, ElMessage } from 'element-plus'

const { list, remove, loading, error } = useAdminProductApi()

const items = ref([])
const meta = ref({ page: 1, per_page: 12, total: 0, last_page: 1 })
const page = ref(1)
const perPage = ref(12)
const filters = ref({ category: null, q: '' })
const searchInput = ref('')
let searchTimer = null

watch(searchInput, (v) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    filters.value.q = v
    page.value = 1
    fetchItems()
  }, 400)
})

watch(() => filters.value.category, () => {
  page.value = 1
  fetchItems()
})

function onPageChange(p) {
  page.value = p
  fetchItems()
}

function formatPrice(n) {
  const num = Number(n || 0)
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(num)
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
    // error is reactive
  }
}

async function confirmDelete(row) {
  try {
    await ElMessageBox.confirm(
      `Удалить товар «${row.name}»?`,
      'Подтверждение удаления',
      { type: 'warning', confirmButtonText: 'Удалить', cancelButtonText: 'Отмена' }
    )
  } catch (_) {
    return
  }

  try {
    await remove(row.id)
    ElMessage.success('Товар удален')
    fetchItems()
  } catch (_) {
    // error displayed via alert
  }
}

function goCreate() {
  window.location.href = '/admin/products/create'
}
function goEdit(id) {
  window.location.href = `/admin/products/${id}/edit`
}

onMounted(fetchItems)
</script>

<style scoped>
</style>
