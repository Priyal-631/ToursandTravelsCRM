// frontend/src/api/customers.js  — replace these functions

import { apiClient } from "@/api/apiClient";

export async function getCustomers() {
  return apiClient('/api/customers');
}

export async function addCustomer(customerFields, tourFields = null) {
  // 1. Create customer
  const newCustomer = await apiClient('/api/customers', {
    method: 'POST',
    body: JSON.stringify(customerFields),
  });

  // 2. Create tour if provided
  if (tourFields && tourFields.destination) {
    await apiClient('/api/tours', {
      method: 'POST',
      body: JSON.stringify({ ...tourFields, customer_id: newCustomer.id }),
    });
  }

  // 3. Return full customer with tours
  const all = await apiClient('/api/customers');
  return all.find(c => c.id === newCustomer.id) || newCustomer;
}

export async function updateCustomerFields(customerId, fields) {
  return apiClient(`/api/customers/${customerId}`, {
    method: 'PATCH',
    body: JSON.stringify(fields),
  });
}

export async function updateTourFields(tourId, fields) {
  return apiClient(`/api/tours/${tourId}`, {
    method: 'PATCH',
    body: JSON.stringify(fields),
  });
}

export async function deleteCustomer(customerId) {
  return apiClient(`/api/customers/${customerId}`, { method: 'DELETE' });
}