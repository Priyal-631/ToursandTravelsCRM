import { supabase } from './supabaseClient';

// ─── Page 2: Analytics ──────────────────────────────

// Get visitor stats for bar chart
export async function getVisitorStats({ 
  year = null, 
  month = null, 
  tourType = null,
  state = null,
  country = null 
} = {}) {
  const { data, error } = await supabase
    .rpc('get_visitor_stats', {
      p_year: year,
      p_month: month,
      p_tour_type: tourType,
      p_state: state,
      p_country: country,
    });

  if (error) throw error;
  return data;
}

// Get monthly revenue for line chart
export async function getMonthlyRevenue({ year = null } = {}) {
  const { data, error } = await supabase
    .rpc('get_monthly_revenue', {
      p_year: year,
    });

  if (error) throw error;
  return data;
}

// Get top destinations for pie chart
export async function getTopDestinations() {
  const { data, error } = await supabase
    .from('top_destinations')
    .select('*');

  if (error) throw error;
  return data;
}

// ─── Page 1: Dashboard ──────────────────────────────

// Get summary cards data
export async function getDashboardSummary() {
  const { data, error } = await supabase
    .rpc('get_dashboard_summary');

  if (error) throw error;
  return data[0]; // returns single row
}

// Get recent tours for dashboard list
export async function getRecentTours({ limit = 10 } = {}) {
  const { data, error } = await supabase
    .from('tours')
    .select(`
      id,
      destination,
      start_date,
      end_date,
      status,
      package_type,
      number_of_adults,
      number_of_children,
      revenue,
      customer:customer_id (
        full_name,
        contact_number
      ),
      tour_type:tour_type_id (
        name
      ),
      state:state_id (
        name
      ),
      country:country_id (
        name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}