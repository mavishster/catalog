<template>
    <el-button
        :type="type"
        class="px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 shadow-md
           hover:shadow-lg hover:-translate-y-0.5
           focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400
           bg-blue-600"
    >
        <slot />
    </el-button>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        default: 'primary',
    },
})
</script>

<style scoped>
/* Smooth hover animation */
.el-button {
    transition: all 0.2s ease-in-out;
}
</style>
