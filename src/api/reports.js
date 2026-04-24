import { apiClient } from "@/api/apiClient";

// ── Visitor Stats ───────────────────────────────────────────
export const getVisitorStats = async (year) => {
  const data = await apiClient(`/api/reports/visitor-stats?year=${year}`);
  return data || [];
};

// ── Monthly Revenue ─────────────────────────────────────────
export const getMonthlyRevenue = async (year) => {
  const data = await apiClient(`/api/reports/monthly-revenue?year=${year}`);
  return data || [];
};

// ── Dashboard Summary ───────────────────────────────────────
export const getDashboardSummary = async () => {
  const data = await apiClient(`/api/reports/dashboard-summary`);
  return data || {};
};

// ── Stats Cards (Analytics) ─────────────────────────────────
export const getReportStats = async (period) => {
  const data = await apiClient(`/api/reports/stats?period=${period}`);

  return {
    totalVisitors: data?.totalVisitors ?? 0,
    revenue:       data?.revenue ?? 0,
    avgRating:     data?.avgRating ?? "—",
    visitorTrend:  data?.visitorTrend ?? 0,
    revenueTrend:  data?.revenueTrend ?? 0,
    ratingTrend:   data?.ratingTrend ?? 0,
  };
};

// ── Destination Visitors (Bar Chart) ────────────────────────
export const getDestinationVisitors = async (period) => {
  const data = await apiClient(`/api/reports/destination-visitors?period=${period}`);
  return data || [];
};

// ── Monthly Trends (Line Chart) ─────────────────────────────
export const getMonthlyTrends = async (period) => {
  const data = await apiClient(`/api/reports/monthly-trends?period=${period}`);
  return data || [];
};

// ── National vs International (Donut) ───────────────────────
export const getNationalVsInternational = async (period) => {
  const data = await apiClient(`/api/reports/national-vs-international?period=${period}`);

  return {
    national: data?.national ?? 50,
    international: data?.international ?? 50,
  };
};

// ── Most Visited Places ─────────────────────────────────────
export const getMostVisitedPlaces = async (period) => {
  const data = await apiClient(`/api/reports/most-visited?period=${period}`);
  return data || [];
};