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
    .select(
      "destination, tour_type, state_name, country_name, travel_month, travel_year, visitor_count, total_revenue, total_collected, total_pending, avg_revenue_per_tour"
    )
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

// ── Yearly Trends (National vs International tours per year) ──────────
/**
 * Fetches tours grouped by year and tour_type (National / International).
 * Returns an array like:
 *   [{ year: 2025, national: 1, international: 1 }, { year: 2026, national: 8, international: 5 }]
 *
 * Pulls from the `tours` table joined with `tour_types`.
 * If your DB uses a view or RPC for this, swap the query accordingly.
 */
export const getYearlyTrends = async () => {
  // Fetch all tours with their start_date and tour_type name
  const { data, error } = await supabase
    .from("tours")
    .select(`
      start_date,
      tour_type:tour_type_id ( name )
    `)
    .not("start_date", "is", null);

  if (error) throw error;

  // Aggregate client-side: group by year and tour_type
  const yearMap = {};

  (data || []).forEach(tour => {
    const year = new Date(tour.start_date).getFullYear();
    const type = (tour.tour_type?.name || "").toLowerCase(); // "national" | "international"

    if (!yearMap[year]) {
      yearMap[year] = { year, national: 0, international: 0 };
    }

    if (type === "national") {
      yearMap[year].national += 1;
    } else if (type === "international") {
      yearMap[year].international += 1;
    }
  });

  // Sort ascending by year
  return Object.values(yearMap).sort((a, b) => a.year - b.year);
};




/*import { useState, useEffect, useCallback } from "react"
import { useOutletContext } from "react-router-dom"
import { format, isValid } from "date-fns"
import {
  MapPin, Phone, Mail, ChevronDown, ChevronUp,
  Pencil, Trash2, Check, X, Plus, Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DashboardStats from "@/pages/Dashboard/dashboardstats"
import AddCustomerModal from "./AddCustomerModal"
import {
  getCustomers,
  addCustomer,
  updateCustomerFields,
  updateTourFields,
  deleteCustomer,
} from "@/api/customers"
import { exportCsv } from "@/api/ExportCsv"
import { TOUR_STATUSES, DESTINATIONS, PACKAGE_TYPES } from "@/utils/constants"
*/