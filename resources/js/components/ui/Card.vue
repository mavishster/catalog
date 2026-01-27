<template>
    <el-card shadow="hover">
        <template #header v-if="title">
            <div class="font-medium">{{ title }}</div>
        </template>
        <slot/>
    </el-card>

</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: '',
    },
})
</script>

<style scoped>
</style>
