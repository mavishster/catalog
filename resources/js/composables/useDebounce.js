import { ref, watch, onBeforeUnmount } from 'vue'

/**
 * Простая утилита для дебаунса значения.
 * Возвращает связку { input, debounced, cancel }.
 * - input: используйте для v-model
 * - debounced: обновляется спустя delay мс после остановки ввода
 * - cancel: немедленно отменяет отложенное обновление
 */
export function useDebouncedRef(initial = '', delay = 400) {
  const input = ref(initial)
  const debounced = ref(initial)
  let timer = null

  const cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  watch(input, (v) => {
    cancel()
    timer = setTimeout(() => {
      debounced.value = v
    }, delay)
  })

  onBeforeUnmount(cancel)

  return { input, debounced, cancel }
}
