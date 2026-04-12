import { apiClient } from './apiClient'

export const getQueries = () => apiClient('/api/queries')

export const createQuery = (payload) =>
  apiClient('/api/queries', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const updateQuery = (id, payload) =>
  apiClient(`/api/queries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })

export const deleteQuery = (id) =>
  apiClient(`/api/queries/${id}`, {
    method: 'DELETE'
  })
