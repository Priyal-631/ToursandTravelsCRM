import { apiClient } from './apiClient'

export const getCustomers = () => apiClient('/api/customers')

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
