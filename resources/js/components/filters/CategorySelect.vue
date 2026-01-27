<template>
    <el-select
        v-model="model"
        filterable
        clearable
        placeholder="Категория"
        class="w-full sm:w-64"
        :loading="loading"
    >
        <el-option :key="0" :label="'Все категории'" :value="null"/>
        <el-option
            v-for="c in categories"
            :key="c.id"
            :label="c.name"
            :value="c.id"
        />
    </el-select>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue'
import {useProductApi} from '../../composables/useProductApi'

const props = defineProps({
    modelValue: {type: [Number, null], default: null},
})
const emit = defineEmits(['update:modelValue'])

const model = ref(props.modelValue)
watch(() => props.modelValue, v => (model.value = v))
watch(model, v => emit('update:modelValue', v))

const categories = ref([])
const {listCategories, loading} = useProductApi()

onMounted(async () => {
    try {
        const res = await listCategories()
        categories.value = res.data || []
    } catch (_) {
        // ошибки обрабатываются наверху
    }
})
</script>

<style scoped>
</style>
