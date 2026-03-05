// src/pages/Analytics/StatsCard.jsx
// Status: [I] Independent UI — accepts props for numbers, no direct DB calls.
// Used by: Analytics/Index.jsx (which fetches from reports.js and passes data down)

import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * StatsCard
 * ─────────
 * @param {string}        label      e.g. "Total Visitors"
 * @param {string|number} value      e.g. "3,640" or 3640
 * @param {string}        prefix     e.g. "₹"  (optional)
 * @param {string}        suffix     e.g. "/5" (optional)
 * @param {number}        trend      e.g. 18 → "+18%" | 0.3 → "+0.3" (optional)
 * @param {node}          icon       Lucide icon component (optional)
 * @param {string}        iconColor  hex color string (optional)
 */
export default function StatsCard({
  label,
  value,
  prefix = "",
  suffix = "",
  trend,
  icon: Icon,
  iconColor = "#4A90D9",
}) {
  const hasTrend = trend !== undefined && trend !== null;
  const positive = hasTrend && trend >= 0;

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <span style={styles.label}>{label}</span>
        {Icon && (
          <span style={{ ...styles.iconWrap, background: iconColor + "18" }}>
            <Icon size={18} color={iconColor} strokeWidth={2} />
          </span>
        )}
      </div>

      <div style={styles.valueRow}>
        {prefix && <span style={styles.prefix}>{prefix}</span>}
        <span style={styles.value}>{value ?? "—"}</span>
        {suffix && <span style={styles.suffix}>{suffix}</span>}
      </div>

      {hasTrend && (
        <div style={{ ...styles.trend, color: positive ? "#16A34A" : "#DC2626" }}>
          {positive
            ? <TrendingUp size={12} strokeWidth={2.5} />
            : <TrendingDown size={12} strokeWidth={2.5} />}
          <span>{positive ? "+" : ""}{trend}{typeof trend === "number" ? "%" : ""}</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    flex: "1 1 180px",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px 22px 16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minWidth: "160px",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: { fontSize: "13px", color: "#6B7280", fontWeight: 500, lineHeight: 1.4 },
  iconWrap: {
    width: "34px", height: "34px", borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  valueRow: { display: "flex", alignItems: "baseline", gap: "2px" },
  prefix: { fontSize: "18px", fontWeight: 700, color: "#111827", lineHeight: 1 },
  value:  { fontSize: "30px", fontWeight: 700, color: "#111827", lineHeight: 1, letterSpacing: "-0.5px" },
  suffix: { fontSize: "14px", color: "#9CA3AF", fontWeight: 500, marginLeft: "1px" },
  trend:  { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600 },
};
