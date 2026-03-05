import { supabase } from "../supabaseClient";

// ── Existing functions (keep as-is) ──────────────────────────────────────────

export const getVisitorStats = async (year) => {
  const { data, error } = await supabase.rpc("get_visitor_stats", { p_year: year });
  if (error) throw error;
  return data;
};

export const getMonthlyRevenue = async (year) => {
  const { data, error } = await supabase.rpc("get_monthly_revenue", { p_year: year });
  if (error) throw error;
  return data;
};

export const getDashboardSummary = async () => {
  const { data, error } = await supabase.rpc("get_dashboard_summary");
  if (error) throw error;
  return data;
};

// ── NEW functions required by Analytics/index.jsx ────────────────────────────

/**
 * Returns KPI numbers for the 3 StatsCards.
 * Your SQL RPC "get_dashboard_summary" should return a single row with:
 * { total_visitors, revenue, avg_rating, visitor_trend, revenue_trend, rating_trend }
 */
export const getReportStats = async (period) => {
  const { data, error } = await supabase.rpc("get_report_stats", { p_period: period });
  if (error) throw error;
  // Shape the DB row to match what StatsCard expects
  return {
    totalVisitors: data?.total_visitors ?? 0,
    revenue:       data?.revenue        ?? 0,
    avgRating:     data?.avg_rating     ?? "—",
    visitorTrend:  data?.visitor_trend  ?? 0,
    revenueTrend:  data?.revenue_trend  ?? 0,
    ratingTrend:   data?.rating_trend   ?? 0,
  };
};

/**
 * Returns bar chart data: [{ destination, visitors }]
 * SQL RPC: "get_destination_visitors"
 */
export const getDestinationVisitors = async (period) => {
  const { data, error } = await supabase.rpc("get_destination_visitors", { p_period: period });
  if (error) throw error;
  return data ?? [];
};

/**
 * Returns line chart data: [{ period, national, international }]
 * SQL RPC: "get_monthly_trends" (reuses get_visitor_stats shape)
 */
export const getMonthlyTrends = async (period) => {
  const year = new Date().getFullYear();
  const data = await getVisitorStats(year);  // reuse existing RPC
  return data ?? [];
};

/**
 * Returns donut chart data: { national: 59, international: 41 }
 * SQL RPC: "get_national_vs_international"
 */
export const getNationalVsInternational = async (period) => {
  const { data, error } = await supabase.rpc("get_national_vs_international", { p_period: period });
  if (error) throw error;
  return {
    national:      data?.national      ?? 50,
    international: data?.international ?? 50,
  };
};

/**
 * Returns grid data: [{ place, count }]
 * SQL RPC: "get_most_visited_places"
 */
export const getMostVisitedPlaces = async (period) => {
  const { data, error } = await supabase.rpc("get_most_visited_places", { p_period: period });
  if (error) throw error;
  return data ?? [];
};
