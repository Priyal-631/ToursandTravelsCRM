import {
  BarChart as RechartsBarChart,  
  Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const BAR_COLORS = ["#4A90D9", "#4ECDC4", "#F5A623", "#E91E8C", "#2ECC71", "#F1C40F", "#5DADE2"];

// Dummy data — replace with real `data` prop when reports.js is ready
const DUMMY = [
  { destination: "Goa",       count: 342 },
  { destination: "Dubai",     count: 312 },
  { destination: "Kerala",    count: 287 },
  { destination: "Manali",    count: 256 },
  { destination: "Bali",      count: 203 },
  { destination: "Rajasthan", count: 198 },
  { destination: "Kashmir",   count: 178 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tt.box}>
      <p style={tt.label}>{label}</p>
      <p style={tt.value}>{payload[0].value} visitors</p>
    </div>
  );
}
const tt = {
  box:   { background: "#1F2937", borderRadius: "8px", padding: "8px 12px", border: "none" },
  label: { margin: 0, fontSize: "12px", color: "#9CA3AF" },
  value: { margin: "2px 0 0", fontSize: "14px", fontWeight: 700, color: "#fff" },
};

/**
 * @param {Array}   data     [{ destination, count }] — from getDestinationVisitors()
 * @param {boolean} loading
 * @param {string}  period   "monthly" | "yearly"
 */
export default function BarChart({ data, loading, period }) {
  const chartData = (data && data.length > 0 ? data : DUMMY).map((d) => ({
    name:  d.destination,
    value: d.count,
  }));

  if (loading) return <div style={s.skeleton} />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RechartsBarChart  
        data={chartData}
        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
        barCategoryGap="10%"
      >
        <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="4 4" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
          width={35}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

const s = {
  skeleton: {
    width: "100%", height: "260px",
    background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
    borderRadius: "8px",
    animation: "pulse 1.5s infinite",
  },
};
