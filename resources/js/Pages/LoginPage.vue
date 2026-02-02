<template>
    <section
        class="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 animate-fade-in mx-auto"
    >
            <!-- Header -->
            <div class="text-center mb-6">
                <h2 class="text-2xl font-bold tracking-tight text-gray-900">
                    Добро пожаловать
                </h2>
            </div>

            <!-- Global Error -->
            <el-alert
                v-if="globalError"
                :title="globalError"
                type="error"
                show-icon
                class="mb-4"
            />

            <!-- Login Form -->
            <el-form
                :model="form"
                :rules="rules"
                ref="formRef"
                label-position="top"
                @submit.prevent
                class="space-y-4"
            >
                <el-form-item label="Email" prop="email">
                    <el-input
                        v-model="form.email"
                        placeholder="you@example.com"
                        autocomplete="email"
                    />
                </el-form-item>

                <el-form-item label="Пароль" prop="password">
                    <el-input
                        v-model="form.password"
                        type="password"
                        placeholder="••••••••"
                        autocomplete="current-password"
                    />
                </el-form-item>

                <el-button
                    type="primary"
                    :loading="loading"
                    @click="onSubmit"
                    class="w-full !h-12 !text-base"
                >
                    Войти
                </el-button>
            </el-form>
        </section>
</template>

<script setup>
import {ref} from 'vue'
import {useAuth} from '../composables/useAuth'

const formRef = ref()
const loading = ref(false)
const globalError = ref(null)
const {login} = useAuth()

const form = ref({email: '', password: ''})
const remember = ref(true)

const rules = {
    email: [
        {required: true, message: 'Введите email', trigger: 'blur'},
        {type: 'email', message: 'Неверный формат email', trigger: ['blur', 'change']},
    ],
    password: [
        {required: true, message: 'Введите пароль', trigger: 'blur'},
        {min: 4, message: 'Минимум 4 символа', trigger: 'blur'},
    ],
}

async function onSubmit() {
    globalError.value = null
    try {
        await formRef.value.validate()
    } catch (_) {
        return
    }

    loading.value = true
    try {
        await login(form.value.email, form.value.password, remember.value)

        if (window.ElMessage) window.ElMessage.success('Успешный вход')

        window.location.href = '/admin/products'
    } catch (e) {
        globalError.value =
            e?.response?.data?.message || e?.message || 'Ошибка входа. Проверьте email и пароль.'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* Glass effect */
section {
    backdrop-filter: blur(12px);
}

/* Fade-in + scale animation */
@keyframes fadeInScale {
    0% {
        opacity: 0;
        transform: scale(0.95);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in {
    animation: fadeInScale 0.4s ease-out forwards;
}
</style>
