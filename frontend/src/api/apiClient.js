const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  })
  const payload = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(payload?.message || payload?.error || 'Request failed')
  }

  if (payload && typeof payload === 'object' && 'success' in payload) {
    if (!payload.success) {
      throw new Error(payload.message || 'Request failed')
    }
    return payload.data
  }

  return payload
}
