// src/components/charts/MonthlyTrendChart.jsx
// Status: [I] Independent — receives data as props, no DB calls.
// Recharts LineChart matching Image 1 (national vs international dual lines)

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Dot,
} from "recharts";

const DUMMY_MONTHLY = [
  { period: "Jan", national: 125, international: 75  },
  { period: "Feb", national: 148, international: 90  },
  { period: "Mar", national: 162, international: 105 },
  { period: "Apr", national: 175, international: 118 },
  { period: "May", national: 190, international: 140 },
  { period: "Jun", national: 210, international: 165 },
  { period: "Jul", national: 248, international: 158 },
  { period: "Aug", national: 235, international: 175 },
  { period: "Sep", national: 195, international: 145 },
  { period: "Oct", national: 168, international: 130 },
  { period: "Nov", national: 172, international: 118 },
  { period: "Dec", national: 255, international: 195 },
];

const DUMMY_YEARLY = [
  { period: "2019", national: 980,  international: 620  },
  { period: "2020", national: 540,  international: 210  },
  { period: "2021", national: 820,  international: 390  },
  { period: "2022", national: 1240, international: 780  },
  { period: "2023", national: 1680, international: 1050 },
  { period: "2024", national: 2100, international: 1380 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tt.box}>
      <p style={tt.label}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ ...tt.row, color: p.color }}>
          {p.dataKey.charAt(0).toUpperCase() + p.dataKey.slice(1)}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}
const tt = {
  box:   { background: "#1F2937", borderRadius: "8px", padding: "10px 14px" },
  label: { margin: "0 0 6px", fontSize: "12px", color: "#9CA3AF" },
  row:   { margin: "2px 0", fontSize: "13px" },
};

// Custom dot matching the circle markers in Image 1
function CircleDot(props) {
  const { cx, cy, fill } = props;
  return <circle cx={cx} cy={cy} r={4} fill="#fff" stroke={fill} strokeWidth={2} />;
}

/**
 * @param {Array}   data     [{ period, national, international }]
 * @param {boolean} loading
 * @param {string}  period   "monthly" | "yearly" — switches dataset & x-axis label
 */
export default function TrendChart({ data, loading, period }) {
  const isYearly   = period === "yearly";
  const fallback   = isYearly ? DUMMY_YEARLY : DUMMY_MONTHLY;
  const chartData  = data && data.length > 0 ? data : fallback;

  if (loading) return <div style={s.skeleton} />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
      >
        <CartesianGrid stroke="#F3F4F6" strokeDasharray="4 4" />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
          width={35}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
        />
        <Line
          type="monotone"
          dataKey="national"
          stroke="#4A90D9"
          strokeWidth={2}
          dot={<CircleDot fill="#4A90D9" />}
          activeDot={{ r: 6, fill: "#4A90D9" }}
        />
        <Line
          type="monotone"
          dataKey="international"
          stroke="#F5A623"
          strokeWidth={2}
          dot={<CircleDot fill="#F5A623" />}
          activeDot={{ r: 6, fill: "#F5A623" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const s = {
  skeleton: {
    width: "100%", height: "260px",
    background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
    borderRadius: "8px",
  },
};
