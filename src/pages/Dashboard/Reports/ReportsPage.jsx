import { useState, useEffect } from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp, MapPin, BarChart2 } from "lucide-react";
import { getMonthlyRevenue, getVisitorStats, getTopDestinations } from "@/api/reports";
import { exportCsv } from "@/api/ExportCsv";

// ── Constants ─────────────────────────────────────────────────────────
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [String(CURRENT_YEAR - 1), String(CURRENT_YEAR), String(CURRENT_YEAR + 1)];

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// ── Formatters ────────────────────────────────────────────────────────
const formatINR = (val) =>
  val == null ? "—" : "₹" + Number(val).toLocaleString("en-IN");

const formatINRShort = (val) => {
  if (val == null) return "—";
  if (val >= 100000) return "₹" + (val / 100000).toFixed(1) + "L";
  if (val >= 1000)   return "₹" + (val / 1000).toFixed(1) + "K";
  return "₹" + val;
};

// ── Custom Tooltip ────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-gray-800 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-gray-600 mt-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span>{p.name}:</span>
          <span className="font-medium text-gray-900">
            {typeof p.value === "number" && p.value > 1000
              ? formatINR(p.value)
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────
function ReportSection({ icon: Icon, title, subtitle, year, onYearChange, onExport, loading, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center"
               style={{ background: "#EEF2F7" }}>
            <Icon size={18} color="#2F4156" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onYearChange && (
            <select
              value={year}
              onChange={(e) => onYearChange(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5
                         bg-gray-50 text-gray-700 cursor-pointer
                         focus:outline-none focus:border-gray-400"
            >
              <option value="">All Years</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5
                       border border-gray-200 rounded-lg text-gray-600
                       hover:bg-[#2F4156] hover:text-white hover:border-[#2F4156]
                       transition-colors duration-150"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            Loading...
          </div>
        ) : children}
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────
function Empty() {
  return (
    <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
      No data available
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function ReportsPage() {

  // Monthly Revenue
  const [revenueYear, setRevenueYear]       = useState(String(CURRENT_YEAR));
  const [revenueData, setRevenueData]       = useState([]);
  const [revenueLoading, setRevenueLoading] = useState(true);

  // Visitor Stats
  const [visitorYear, setVisitorYear]       = useState(String(CURRENT_YEAR));
  const [visitorData, setVisitorData]       = useState([]);
  const [visitorLoading, setVisitorLoading] = useState(true);

  // Top Destinations
  const [topData, setTopData]               = useState([]);
  const [topLoading, setTopLoading]         = useState(true);

  // ── Fetch Monthly Revenue ─────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        setRevenueLoading(true);
        const raw = await getMonthlyRevenue(revenueYear || null);
        setRevenueData(raw.map((r) => ({
          ...r,
          label:           MONTH_NAMES[Number(r.month_number)] || "?",
          total_revenue:   Number(r.total_revenue   || 0),
          total_collected: Number(r.total_collected || 0),
          total_pending:   Number(r.total_pending   || 0),
          total_tours:     Number(r.total_tours     || 0),
        })));
      } catch (err) {
        console.error("Monthly revenue error:", err.message);
      } finally {
        setRevenueLoading(false);
      }
    };
    fetch();
  }, [revenueYear]);

  // ── Fetch Visitor Stats ───────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        setVisitorLoading(true);
        const raw = await getVisitorStats(visitorYear || null);

        // Aggregate by destination across months
        const map = {};
        raw.forEach((r) => {
          if (!map[r.destination]) {
            map[r.destination] = { destination: r.destination, visitor_count: 0, total_revenue: 0 };
          }
          map[r.destination].visitor_count += Number(r.visitor_count || 0);
          map[r.destination].total_revenue += Number(r.total_revenue || 0);
        });

        setVisitorData(
          Object.values(map)
            .sort((a, b) => b.visitor_count - a.visitor_count)
            .slice(0, 10)
        );
      } catch (err) {
        console.error("Visitor stats error:", err.message);
      } finally {
        setVisitorLoading(false);
      }
    };
    fetch();
  }, [visitorYear]);

  // ── Fetch Top Destinations ────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        setTopLoading(true);
        const raw = await getTopDestinations();
        setTopData(raw.map((r) => ({
          ...r,
          total_revenue: Number(r.total_revenue || 0),
          avg_revenue:   Number(r.avg_revenue   || 0),
          total_tours:   Number(r.total_tours   || 0),
        })));
      } catch (err) {
        console.error("Top destinations error:", err.message);
      } finally {
        setTopLoading(false);
      }
    };
    fetch();
  }, []);

  // ── CSV exports ───────────────────────────────────────────────────
  const exportRevenue = () => exportCsv(
    revenueData.map((r) => ({
      "Month":            r.label,
      "Year":             r.year,
      "Total Tours":      r.total_tours,
      "Total Revenue":    r.total_revenue,
      "Collected":        r.total_collected,
      "Pending":          r.total_pending,
    })),
    `monthly-revenue-${revenueYear || "all"}`
  );

  const exportVisitor = () => exportCsv(
    visitorData.map((r) => ({
      "Destination":      r.destination,
      "Visitors":         r.visitor_count,
      "Total Revenue":    r.total_revenue,
    })),
    `visitor-stats-${visitorYear || "all"}`
  );

  const exportTop = () => exportCsv(
    topData.map((r) => ({
      "Destination":      r.destination,
      "Total Tours":      r.total_tours,
      "Total Revenue":    r.total_revenue,
      "Avg Revenue":      Math.round(r.avg_revenue),
    })),
    "top-destinations"
  );

  return (
    <div className="p-6 space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">
          Revenue trends, visitor statistics and destination performance
        </p>
      </div>

      {/* ── 1. Monthly Revenue ── */}
      <ReportSection
        icon={TrendingUp}
        title="Monthly Revenue"
        subtitle="Revenue collected vs pending per month"
        year={revenueYear}
        onYearChange={setRevenueYear}
        onExport={exportRevenue}
        loading={revenueLoading}
      >
        {revenueData.length === 0 ? <Empty /> : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis tickFormatter={formatINRShort} tick={{ fontSize: 11, fill: "#6b7280" }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone" dataKey="total_revenue" name="Total Revenue"
                stroke="#2F4156" strokeWidth={2.5}
                dot={{ r: 4, fill: "#2F4156" }} activeDot={{ r: 6 }}
              />
              <Line
                type="monotone" dataKey="total_collected" name="Collected"
                stroke="#10b981" strokeWidth={2}
                dot={{ r: 3, fill: "#10b981" }} activeDot={{ r: 5 }}
              />
              <Line
                type="monotone" dataKey="total_pending" name="Pending"
                stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5"
                dot={{ r: 3, fill: "#ef4444" }} activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ReportSection>

      {/* ── 2. Visitor Stats ── */}
      <ReportSection
        icon={BarChart2}
        title="Visitor Stats by Destination"
        subtitle="Number of visitors per destination"
        year={visitorYear}
        onYearChange={setVisitorYear}
        onExport={exportVisitor}
        loading={visitorLoading}
      >
        {visitorData.length === 0 ? <Empty /> : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visitorData} margin={{ top: 5, right: 20, left: 10, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="destination"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                angle={-35} textAnchor="end" interval={0}
              />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
              <Bar dataKey="visitor_count" name="Visitors" fill="#2F4156" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ReportSection>

      {/* ── 3. Top Destinations ── */}
      <ReportSection
        icon={MapPin}
        title="Top Destinations"
        subtitle="All-time most booked destinations by revenue"
        onExport={exportTop}
        loading={topLoading}
      >
        {topData.length === 0 ? <Empty /> : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={topData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 110, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis
                type="number" tickFormatter={formatINRShort}
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <YAxis
                type="category" dataKey="destination" width={100}
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Bar dataKey="total_revenue" name="Total Revenue" fill="#2F4156" radius={[0, 4, 4, 0]} />
              <Bar dataKey="avg_revenue"   name="Avg Revenue"   fill="#C5D8E8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ReportSection>

    </div>
  );
}