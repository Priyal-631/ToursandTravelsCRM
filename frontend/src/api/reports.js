//import { supabase } from "@/api/supabaseClient";

// ── Monthly Revenue ───────────────────────────────────────────────────
import { apiClient } from "@/api/apiClient";

// ── Monthly Revenue ───────────────────────────────────────────────────
export const getMonthlyRevenue = async (year) => {
  let url = "/api/reports/monthly-revenue";

  if (year) {
    url += `?year=${year}`;
  }

  const data = await apiClient(url);
  return data || [];
};

// ── Visitor Stats ─────────────────────────────────────────────────────
export const getVisitorStats = async (year) => {
  let url = "/api/reports/visitor-stats";

  if (year) {
    url += `?year=${year}`;
  }

  const data = await apiClient(url);
  return data || [];
};

// ── Top Destinations ──────────────────────────────────────────────────
export const getTopDestinations = async () => {
  const data = await apiClient("/api/reports/top-destinations");
  return data || [];
};

// ── Yearly Trends ─────────────────────────────────────────────────────
export const getYearlyTrends = async () => {
  const data = await apiClient("/api/reports/yearly-trends");
  return data || [];
};