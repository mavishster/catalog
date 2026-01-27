export function getErrorMessage(e, fallback = 'Произошла ошибка. Попробуйте позже.') {
  const msg = e?.response?.data?.message || e?.message || fallback
  return typeof msg === 'string' ? msg : fallback
}
