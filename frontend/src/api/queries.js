import { apiClient } from './apiClient'

/**
 * GET /api/queries
 * Fetches all queries with joined Customer and Profile (assigned_member) data.
 * Supports optional filtering by priority, status, and assigned_to.
 */
export const getQueries = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.priority && filters.priority !== 'All Priority') params.append('priority', filters.priority);
  if (filters.status && filters.status !== 'All Status') params.append('status', filters.status);
  if (filters.assigned_to && filters.assigned_to !== 'All Members') params.append('assigned_to', filters.assigned_to);

  const queryString = params.toString();
  return apiClient(`/api/queries${queryString ? `?${queryString}` : ''}`);
}

/**
 * POST /api/queries
 * Public endpoint used by the Enquiry Form.
 */
export const createQuery = (data) =>
  apiClient('/api/queries', {
    method: 'POST',
    body: JSON.stringify(data),
  })

/**
 * PATCH /api/queries/:id
 * Handles inline updates for priority, status, assigned_to, or replied_at.
 */
export const updateQuery = (id, data) =>
  apiClient(`/api/queries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

/**
 * POST /api/queries/:id/reply
 * Triggers the Resend email integration and updates replied_at timestamp.
 * @param {string} id - Query ID
 * @param {string} reply - Reply message text
 * @param {string} status - Optional status update (defaults to 'Closed')
 */
export const sendReply = (id, reply, status = 'Closed') =>
  apiClient(`/api/queries/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ reply, status }),
  })

/**
 * GET /api/profiles
 * Used to populate the "Assigned To" dropdown filter.
 */
export const getProfiles = () => apiClient('/api/profiles')