<template>
    <el-card
        shadow="hover"
        class="product-card flex flex-col h-full rounded-xl bg-white
               border border-gray-200 p-4
               transition-all duration-200 hover:shadow-lg"
    >
        <!-- Content -->
        <div class="flex-1">
            <h3 class="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                {{ product.name }}
            </h3>

            <p class="text-xs text-gray-500 mb-2">
                Категория: {{ product.category?.name || '—' }}
            </p>

            <p class="text-sm text-gray-700 line-clamp-3">
                {{ product.description || 'Описание отсутствует' }}
            </p>
        </div>

        <!-- Footer -->
        <div class="mt-4 flex items-center justify-between">
            <span class="font-semibold text-gray-900">
                {{ priceText }}
            </span>

            <Button type="primary" size="small" @click="$emit('open', product.id)">
                Подробнее
            </Button>
        </div>
    </el-card>
</template>

<script setup>
import { computed } from 'vue'
import Button from './ui/Button.vue'

const props = defineProps({
    product: { type: Object, required: true },
})

const priceText = computed(() => {
    const n = Number(props.product.price || 0)
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
    }).format(n)
})
</script>

<style scoped>
/* Clamp helpers (Tailwind plugin not required) */
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Subtle lift */
.product-card:hover {
    transform: translateY(-2px);
}
</style>
