<template>
    <section class="space-y-6">
        <!-- Filters -->
        <el-card class="mb-4" shadow="hover">
            <div class="px-4 pt-2 pb-4 space-y-4">
                <!-- Filters grid -->
                <div class="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-4">
                    <!-- Category -->
                    <div class="flex flex-col gap-1">
                        <span class="text-sm text-gray-500">Категория</span>
                        <CategorySelect
                            v-model="filters.category"
                            class="w-full"
                        />
                    </div>

                    <!-- Search -->
                    <div class="flex flex-col gap-1">
                        <span class="text-sm text-gray-500">Поиск товаров</span>
                        <el-input
                            v-model="searchInput"
                            placeholder="Название или описание"
                            clearable
                            :prefix-icon="Search"
                            class="w-full"
                        />
                    </div>

                    <!-- Per page -->
                    <div class="flex flex-col gap-1">
                        <span class="text-sm text-gray-500">На странице</span>
                        <el-select v-model="perPage" class="w-full">
                            <el-option
                                v-for="n in perPageOptions"
                                :key="n"
                                :label="String(n)"
                                :value="n"
                            />
                        </el-select>
                    </div>

                    <!-- Total -->
                    <div class="flex flex-col gap-1">
                        <span class="text-sm text-gray-500">Всего: </span>
                        <span>{{ meta.total }}</span>
                    </div>

                </div>

                <!-- Actions -->
                <div class="flex justify-end">
                    <el-button
                        type="warning"
                        size="small"
                        @click="resetFilters"
                    >
                        Сбросить
                    </el-button>
                </div>
            </div>
        </el-card>


        <!-- Error -->
        <el-alert
            v-if="error"
            :title="error"
            type="error"
            show-icon
        />

        <!-- Grid -->
        <div
            v-loading="loading"
            class="grid gap-8
                   grid-cols-1
                   sm:grid-cols-2
                   lg:grid-cols-3
                   xl:grid-cols-4
                   items-stretch"
        >
            <ProductCard
                v-for="p in items"
                :key="p.id"
                :product="p"
                @open="openProduct"
            />
        </div>

        <!-- Empty -->
        <el-empty
            v-if="!loading && items.length === 0"
            description="Нет товаров"
        />

        <!-- Pagination -->
        <div class="flex justify-center pt-4">
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
import {ref, watch, onMounted} from 'vue'
import {useProductApi} from '../composables/useProductApi'
import ProductCard from '../components/ProductCard.vue'
import CategorySelect from '../components/filters/CategorySelect.vue'
import {Search} from '@element-plus/icons-vue'
import {useDebouncedRef} from '../composables/useDebounce'


const {list, loading, error} = useProductApi()

const items = ref([])
const meta = ref({total: 0})
const page = ref(1)
const perPage = ref(12)
const perPageOptions = [12, 24, 48]
const filters = ref({category: null, q: ''})

const {input: searchInput, debounced} = useDebouncedRef('', 400)

watch(debounced, (v) => {
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

function openProduct(id) {
    window.location.href = `/product/${id}`
}

async function fetchItems() {
    const res = await list({
        page: page.value,
        per_page: perPage.value,
        category: filters.value.category || undefined,
        q: filters.value.q || undefined,
    })

    items.value = res.data || []
    meta.value = res.meta || {total: items.value.length}
}

function resetFilters() {
    filters.value = {category: null, q: ''}
    searchInput.value = ''
    page.value = 1
    perPage.value = 12
    fetchItems()
}

onMounted(fetchItems)
</script>

<style scoped>
.el-card {
    border-radius: 0.75rem;
}
</style>
