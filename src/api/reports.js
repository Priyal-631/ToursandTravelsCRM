import { supabase } from "@/api/supabaseClient";

// ── Monthly Revenue ───────────────────────────────────────────────────
export const getMonthlyRevenue = async (year) => {
  let query = supabase
    .from("monthly_revenue")
    .select("month, year, month_number, total_tours, total_revenue, total_collected, total_pending")
    .order("month", { ascending: true });

  if (year) query = query.eq("year", Number(year));

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// ── Visitor Stats ─────────────────────────────────────────────────────
export const getVisitorStats = async (year) => {
  let query = supabase
    .from("visitor_stats")
    .select("destination, tour_type, state_name, country_name, travel_month, travel_year, visitor_count, total_revenue, total_collected, total_pending, avg_revenue_per_tour")
    .order("visitor_count", { ascending: false });

  if (year) query = query.eq("travel_year", Number(year));

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// ── Top Destinations ──────────────────────────────────────────────────
export const getTopDestinations = async () => {
  const { data, error } = await supabase
    .from("top_destinations")
    .select("destination, total_tours, total_revenue, avg_revenue");

  if (error) throw error;
  return data || [];
};