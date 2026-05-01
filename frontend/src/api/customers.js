import { apiClient } from './apiClient'

const toQueryString = (params = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.set(key, String(value))
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getCustomers = (params) =>
  apiClient(`/api/customers${params ? toQueryString(params) : ''}`)

export const getCustomerStats = () => apiClient('/api/customers/stats')

export const createCustomer = (payload) =>
  apiClient('/api/customers', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const updateCustomer = (id, payload) =>
  apiClient(`/api/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })

export const deleteCustomer = (id) =>
  apiClient(`/api/customers/${id}`, {
    method: 'DELETE'
  })
