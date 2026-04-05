const STORAGE_KEY = 'crm_queries_submitted';

export function getStoredEnquiries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEnquiry(enquiry) {
  const existing = getStoredEnquiries();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([enquiry, ...existing]));
}

export function toDateLabel(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}
