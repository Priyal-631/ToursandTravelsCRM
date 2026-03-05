import { useState, useEffect } from "react";
import { Users, IndianRupee, Star } from "lucide-react";
import StatsCard from "./statscard";
import BarChart  from "@/components/charts/BarChart";
import TrendChart from "@/components/charts/TrendChart";
import DonutChart from "@/components/charts/DonutChart";
import MostVisitedGrid from "@/components/charts/MostVisitedGrid";

// ─── Temporary stubs — remove these and uncomment the real imports below
// once reports.js is ready (DB work done by backend dev)
async function getReportStats()            { return { totalVisitors: 3640, revenue: 2450000, avgRating: "4.8", visitorTrend: 18, revenueTrend: 12, ratingTrend: 0.3 }; }
async function getDestinationVisitors()    { return []; }
async function getMonthlyTrends()          { return []; }
async function getNationalVsInternational(){ return { national: 59, international: 41 }; }
async function getMostVisitedPlaces()      { return []; }

// ─── Uncomment this block and delete the stubs above when reports.js is ready ─
/*import {
getReportStats,
getDestinationVisitors,
getMonthlyTrends,
getNationalVsInternational,
getMostVisitedPlaces,
} from "../../../api/reports";*/

// ─── Chart titles that change based on selected period ────────────────────────
const CHART_TITLES = {
  monthly: {
    trends:      "Monthly Trends",
    destination: "Destination-wise Visitors",
    split:       "National vs International",
    places:      "Most Visited Places",
  },
  yearly: {
    trends:      "Yearly Trends",
    destination: "Destination-wise Visitors (Annual)",
    split:       "National vs International (Annual)",
    places:      "Most Visited Places (Annual)",
  },
};

export default function Analytics() {
  const [period, setPeriod]   = useState("monthly"); // "monthly" | "yearly"
  const [stats, setStats]     = useState(null);
  const [destData, setDest]   = useState([]);
  const [trendData, setTrend] = useState([]);
  const [splitData, setSplit] = useState(null);
  const [placesData, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function load() {
    setLoading(true);
    try {
      const [s, d, t, sp, pl] = await Promise.all([
        getReportStats(period),
        getDestinationVisitors(period),
        getMonthlyTrends(period),
        getNationalVsInternational(period),
        getMostVisitedPlaces(period),
      ]);
      setStats(s);
      setDest(d);
      setTrend(t);
      setSplit(sp);
      setPlaces(pl);
    } catch (err) {
      console.error("Analytics load failed:", err.message);
      // Charts will fall back to their built-in DUMMY data automatically
    } finally {
      setLoading(false);
    }
  }
  load();
}, [period]);
  // ── helpers ────────────────────────────────────────────────────────────────
  const fmtRevenue = (amt = 0) => {
    if (amt >= 1_00_000) return (amt / 1_00_000).toFixed(1) + "L";
    if (amt >= 1_000)    return (amt / 1_000).toFixed(1) + "K";
    return String(amt);
  };

  // Active title set — switches every time `period` changes
  const titles = CHART_TITLES[period];

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Reports &amp; Analytics</h1>
          <p style={s.subtitle}>Visual business intelligence at your fingertips</p>
        </div>

        {/* Period toggle — controls BOTH stats AND chart titles */}
        <div style={s.toggle}>
          {["monthly", "yearly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                ...s.toggleBtn,
                ...(period === p ? s.toggleActive : s.toggleInactive),
              }}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stat cards row ────────────────────────────────────────────────────
           StatsCard is fully reusable for both periods.
           It receives different numbers depending on what getReportStats(period)
           returns — the card itself has zero period-awareness.
      ── */}
      <div style={s.statsRow}>
        <StatsCard
          label="Total Visitors"
          value={loading ? "…" : stats?.totalVisitors?.toLocaleString("en-IN")}
          icon={Users}
          iconColor="#4A90D9"
          trend={stats?.visitorTrend}
        />
        <StatsCard
          label="Revenue"
          value={loading ? "…" : fmtRevenue(stats?.revenue)}
          prefix="₹"
          icon={IndianRupee}
          iconColor="#16A34A"
          trend={stats?.revenueTrend}
        />
        <StatsCard
          label="Avg. Rating"
          value={loading ? "…" : stats?.avgRating}
          suffix="/5"
          icon={Star}
          iconColor="#F59E0B"
          trend={stats?.ratingTrend}
        />
      </div>

      {/* ── Charts row 1: Bar + Line ── */}
      <div style={s.chartsRow}>
        <div style={s.chartCard}>
          {/* Title auto-switches: "Destination-wise Visitors" ↔ "Destination-wise Visitors (Annual)" */}
          <h3 style={s.chartTitle}>{titles.destination}</h3>
          <BarChart data={destData} loading={loading} period={period} />
        </div>

        <div style={s.chartCard}>
          {/* Title auto-switches: "Monthly Trends" ↔ "Yearly Trends" */}
          <h3 style={s.chartTitle}>{titles.trends}</h3>
          <TrendChart data={trendData} loading={loading} period={period} />
        </div>
      </div>

      {/* ── Charts row 2: Donut + Grid ── */}
      <div style={s.chartsRow}>
        <div style={s.chartCard}>
          {/* Title auto-switches: "National vs International" ↔ "National vs International (Annual)" */}
          <h3 style={s.chartTitle}>{titles.split}</h3>
          <DonutChart data={splitData} loading={loading} period={period} />
        </div>

        <div style={s.chartCard}>
          {/* Title auto-switches: "Most Visited Places" ↔ "Most Visited Places (Annual)" */}
          <h3 style={s.chartTitle}>{titles.places}</h3>
          <MostVisitedGrid data={placesData} loading={loading} period={period} />
        </div>
      </div>

    </div>
  );
}

// ─── Page-level layout styles (chart cards sizing etc.) ──────────────────────
const s = {
  page: {
    padding: "28px 32px",
    background: "#F3F4F6",
    minHeight: "100vh",
    fontFamily: "system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "12px",
  },
  h1: { margin: 0, fontSize: "22px", fontWeight: 700, color: "#111827" },
  subtitle: { margin: "4px 0 0", fontSize: "13px", color: "#6B7280" },

  // Period toggle pill
  toggle: {
    display: "flex",
    background: "#E5E7EB",
    borderRadius: "8px",
    padding: "3px",
    gap: "2px",
  },
  toggleBtn: {
    padding: "6px 18px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    transition: "all 0.15s",
  },
  toggleActive:  { background: "#2563EB", color: "#fff", boxShadow: "0 1px 3px rgba(37,99,235,0.3)" },
  toggleInactive:{ background: "transparent", color: "#6B7280" },

  // Stat cards
  statsRow: { display: "flex", gap: "16px", flexWrap: "wrap" },

  // Chart rows
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  chartCard: {
    background: "#fff",
    borderRadius: "14px",
    padding: "22px 24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
    minHeight: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  chartTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 700,
    color: "#111827",
  },
};
