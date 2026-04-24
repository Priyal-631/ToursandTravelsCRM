import { apiClient } from './apiClient'

export const getStates = () => apiClient('/api/states')

export const getCountries = () => apiClient('/api/countries')

export const getTourTypes = () => apiClient('/api/tour-types')