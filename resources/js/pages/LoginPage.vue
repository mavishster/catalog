<template>
  <section class="max-w-md mx-auto">
    <h2 class="text-xl font-semibold mb-4">Войти</h2>

    <el-alert v-if="globalError" :title="globalError" type="error" show-icon class="mb-4" />

    <el-form :model="form" :rules="rules" ref="formRef" label-position="top" @submit.prevent>
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" placeholder="you@example.com" autocomplete="email" />
      </el-form-item>

      <el-form-item label="Пароль" prop="password">
        <el-input v-model="form.password" type="password" placeholder="••••••••" autocomplete="current-password" />
      </el-form-item>

      <div class="flex items-center justify-between mb-3">
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="remember" class="rounded" />
          Запомнить меня
        </label>
        <span class="text-sm text-gray-500">&nbsp;</span>
      </div>

      <el-button type="primary" :loading="loading" @click="onSubmit" class="w-full">Войти</el-button>
    </el-form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const formRef = ref()
const loading = ref(false)
const globalError = ref(null)
const { login } = useAuth()

const form = ref({ email: '', password: '' })
const remember = ref(true)

const rules = {
  email: [
    { required: true, message: 'Введите email', trigger: 'blur' },
    { type: 'email', message: 'Неверный формат email', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: 'Введите пароль', trigger: 'blur' },
    { min: 4, message: 'Минимум 4 символа', trigger: 'blur' },
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

    // Simple success message and redirect
    if (window.ElMessage) {
      window.ElMessage.success('Успешный вход')
    }
    window.location.href = '/admin/products'
  } catch (e) {
    globalError.value = e?.response?.data?.message || e?.message || 'Ошибка входа. Проверьте email и пароль.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
