import { supabase } from "../lib/supabaseClient";

export const getVisitorStats = async (year) => {
  const { data, error } = await supabase.rpc("get_visitor_stats", {
    p_year: year
  });

  if (error) throw error;
  return data;
};

export const getMonthlyRevenue = async (year) => {
  const { data, error } = await supabase.rpc("get_monthly_revenue", {
    p_year: year
  });

  if (error) throw error;
  return data;
};

export const getDashboardSummary = async () => {
  const { data, error } = await supabase.rpc("get_dashboard_summary");

  if (error) throw error;
  return data;
};