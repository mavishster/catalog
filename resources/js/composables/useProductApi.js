import { ref } from 'vue'
import { getErrorMessage } from '../utils/http'

export function useProductApi() {
    const loading = ref(false)
    const error = ref(null)
    const lastStatus = ref(null)

    const list = async (params = {}) => {
        loading.value = true
        error.value = null
        try {
            const {data} = await window.axios.get('/api/v1/products', {params})
            lastStatus.value = 200
            return data
        } catch (e) {
            lastStatus.value = e?.response?.status || null
            error.value = getErrorMessage(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const get = async (id) => {
        loading.value = true
        error.value = null
        try {
            const {data} = await window.axios.get(`/api/v1/products/${id}`)
            lastStatus.value = 200
            return data
        } catch (e) {
            lastStatus.value = e?.response?.status || null
            error.value = getErrorMessage(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const listCategories = async () => {
        loading.value = true
        error.value = null
        try {
            const {data} = await window.axios.get('/api/v1/categories')
            lastStatus.value = 200
            return data
        } catch (e) {
            lastStatus.value = e?.response?.status || null
            error.value = getErrorMessage(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    return {loading, error, lastStatus, list, get, listCategories}
}
