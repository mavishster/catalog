<template>
    <el-card class="h-full flex flex-col" shadow="hover">
        <div class="flex-1">
            <h3 class="text-base font-medium mb-1">{{ product.name }}</h3>
            <p class="text-xs text-gray-500 mb-2">Категория: {{ product.category?.name || '—' }}</p>
            <p class="text-sm text-gray-700 mb-3">{{ shortText }}</p>
        </div>
        <div class="mt-auto flex items-center justify-between">
            <span class="font-semibold">{{ priceText }}</span>
            <el-button size="small" type="primary" @click="$emit('open', product.id)">Подробнее</el-button>
        </div>
    </el-card>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
    product: {type: Object, required: true},
})

const shortText = computed(() => {
    const d = props.product.description || ''
    return d.length > 120 ? d.slice(0, 120) + '…' : d
})

const priceText = computed(() => {
    const n = Number(props.product.price || 0)
    return new Intl.NumberFormat('ru-RU', {style: 'currency', currency: 'RUB'}).format(n)
})
</script>

<style scoped>
</style>
