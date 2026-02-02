<template>
  <section>
    <el-page-header @back="goBack" :content="pageTitle" class="mb-4" />

    <el-alert v-if="error" :title="error" type="error" show-icon class="mb-4" />

    <el-card v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="Название" prop="name">
          <el-input v-model="form.name" placeholder="Введите название" />
        </el-form-item>

        <el-form-item label="Категория" prop="category_id">
          <el-select v-model="form.category_id" placeholder="Выберите категорию" filterable class="w-full">
            <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Цена" prop="price">
          <el-input v-model.number="form.price" type="number" placeholder="0.00" />
        </el-form-item>

        <el-form-item label="Описание" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="6" placeholder="Описание товара" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="saving" @click="submit">Сохранить</el-button>
          <el-button @click="goBack">Отмена</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProductApi } from '../../composables/useProductApi'
import { useAdminProductApi } from '../../composables/useAdminProductApi'
import { ElMessage } from 'element-plus'

const props = defineProps({
  mode: { type: String, required: true }, // 'create' | 'edit'
  id: { type: [Number, String], default: null },
})

const { create, update, loading, error } = useAdminProductApi()
const { get, listCategories } = useProductApi()
const formRef = ref()
const categories = ref([])
const saving = ref(false)

const form = ref({
  name: '',
  category_id: null,
  price: null,
  description: '',
})

const rules = {
  name: [{ required: true, message: 'Введите название', trigger: 'blur' }],
  category_id: [{ required: true, message: 'Выберите категорию', trigger: 'change' }],
  price: [
    { required: true, message: 'Укажите цену', trigger: 'change' },
    { validator: (_, v, cb) => (Number(v) > 0 ? cb() : cb(new Error('Цена должна быть больше 0'))), trigger: 'change' },
  ],
}

const pageTitle = computed(() => (props.mode === 'edit' ? 'Редактирование товара' : 'Добавление товара'))

async function loadCategories() {
  try {
    const res = await listCategories()
    categories.value = res.data || []
  } catch (_) {}
}

async function loadItem() {
  if (props.mode !== 'edit' || !props.id) return
  try {
    const res = await get(props.id)
    const p = res.data
    form.value = {
      name: p?.name || '',
      category_id: p?.category?.id || null,
      price: p?.price != null ? Number(p.price) : null,
      description: p?.description || '',
    }
  } catch (_) {}
}

function goBack() {
  window.location.href = '/admin/products'
}

function submit() {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    saving.value = true
    try {
      if (props.mode === 'edit' && props.id) {
        await update(props.id, form.value)
        ElMessage.success('Изменения сохранены')
      } else {
        await create(form.value)
        ElMessage.success('Товар создан')
      }
      goBack()
    } catch (_) {
      // error reactive
    } finally {
      saving.value = false
    }
  })
}

onMounted(async () => {
  await loadCategories()
  await loadItem()
})
</script>

<style scoped>
</style>
