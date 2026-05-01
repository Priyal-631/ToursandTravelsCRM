import { apiClient } from './apiClient'

export const createTour = (payload) =>
  apiClient('/api/tours', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const updateTour = (id, payload) =>
  apiClient(`/api/tours/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
