<template>
    <el-button :type="type">
        <slot/>
    </el-button>

</template>

<script setup>
defineProps({
    type: {
        type: String,
        default: 'default',
    },
})
</script>

<style scoped>
</style>
