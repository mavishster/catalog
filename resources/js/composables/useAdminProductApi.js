import { ref } from 'vue'
import { getErrorMessage } from '../utils/http'

export function useAdminProductApi() {
    const loading = ref(false)
    const error = ref(null)
    const lastStatus = ref(null)

    const create = async (payload) => {
        loading.value = true
        error.value = null
        try {
            const {data} = await window.axios.post('/api/v1/products', payload)
            lastStatus.value = 201
            return data
        } catch (e) {
            lastStatus.value = e?.response?.status || null
            error.value = getErrorMessage(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const update = async (id, payload) => {
        loading.value = true
        error.value = null
        try {
            const {data} = await window.axios.patch(`/api/v1/products/${id}`, payload)
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

    const remove = async (id) => {
        loading.value = true
        error.value = null
        try {
            const {data} = await window.axios.delete(`/api/v1/products/${id}`)
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

    return {loading, error, lastStatus, create, update, remove}
}
