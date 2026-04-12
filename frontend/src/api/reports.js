import { apiClient } from './apiClient'

// ── Monthly Revenue ───────────────────────────────────────────────────
// Calls GET /api/reports/monthly-revenue?year=2025
// Backend groups tours by month and returns aggregated revenue data
export const getMonthlyRevenue = async (year) => {
  const url = year
    ? `/api/reports/monthly-revenue?year=${year}`
    : `/api/reports/monthly-revenue`
  return apiClient(url)
}

// ── Visitor Stats ─────────────────────────────────────────────────────
// Calls GET /api/reports/visitor-stats?year=2025
// Backend groups tours by destination and returns visitor counts
export const getVisitorStats = async (year) => {
  const url = year
    ? `/api/reports/visitor-stats?year=${year}`
    : `/api/reports/visitor-stats`
  return apiClient(url)
}

// ── Top Destinations ──────────────────────────────────────────────────
// Calls GET /api/reports/top-destinations
// Backend returns top 10 destinations by tour count, all time
export const getTopDestinations = async () => {
  return apiClient('/api/reports/top-destinations')
}

// ── Yearly Trends ─────────────────────────────────────────────────────
// Calls GET /api/reports/yearly-trends
// Backend groups tours by year and returns national vs international counts
export const getYearlyTrends = async () => {
  return apiClient('/api/reports/yearly-trends')
}