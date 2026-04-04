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
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}