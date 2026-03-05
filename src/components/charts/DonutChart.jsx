// src/components/charts/NationalDonutChart.jsx
// Status: [I] Independent — receives data as props, no DB calls.
// Recharts PieChart (donut) matching Image 2 (National 59% / International 41%)

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const DUMMY = { national: 59, international: 41 };
const COLORS = { national: "#4A90D9", international: "#F5A623" };

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={tt.box}>
      <p style={{ ...tt.label, color: COLORS[name.toLowerCase()] }}>{name}</p>
      <p style={tt.value}>{value}%</p>
    </div>
  );
}
const tt = {
  box:   { background: "#1F2937", borderRadius: "8px", padding: "8px 12px" },
  label: { margin: 0, fontSize: "12px", fontWeight: 600 },
  value: { margin: "2px 0 0", fontSize: "16px", fontWeight: 700, color: "#fff" },
};

// Custom label rendered outside the arc (matching Image 2 style)
function OuterLabel({ cx, cy, midAngle, outerRadius, name, value }) {
  const RADIAN   = Math.PI / 180;
  const radius   = outerRadius + 28;
  const x        = cx + radius * Math.cos(-midAngle * RADIAN);
  const y        = cy + radius * Math.sin(-midAngle * RADIAN);
  const anchor   = x > cx ? "start" : "end";
  const color    = COLORS[name.toLowerCase()] ?? "#374151";

  return (
    <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={13} fontWeight={600}>
      {name} {value}%
    </text>
  );
}

/**
 * @param {{ national: number, international: number } | null} data
 * @param {boolean} loading
 * @param {string}  period  "monthly" | "yearly"
 */
export default function DonutChart({ data, loading, period }) {
  const source = data ?? DUMMY;

  const chartData = [
    { name: "National",      value: source.national      },
    { name: "International", value: source.international },
  ];

  if (loading) return <div style={s.skeleton} />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={75}
          outerRadius={110}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          labelLine={false}
          label={OuterLabel}
          paddingAngle={2}
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.name}
              fill={COLORS[entry.name.toLowerCase()]}
              stroke="none"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

const s = {
  skeleton: {
    width: "100%", height: "280px",
    background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
    borderRadius: "8px",
  },
};
