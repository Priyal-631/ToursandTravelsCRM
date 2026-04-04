// src/pages/Dashboard/DashboardStats.jsx
// Derives all 5 stats purely from the customers array already fetched by Index.jsx.
// NO extra DB call needed — customers already include nested tours[].
//
// HOW TO USE IN Dashboard/Index.jsx:
//   import DashboardStats from "./DashboardStats";
//   <DashboardStats customers={customers} />

import { Users, Plane, PlayCircle, CheckCircle2, MessageSquare } from "lucide-react";

/**
 * Derives the 5 dashboard counts from the customers array.
 *
 * customers schema:
 *   - follow_up_status: 'New' | 'Contacted' | 'Interested' | 'Not Interested' | 'Converted' | 'Lost'
 *   - tours[0].status:  'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'
 */
function deriveStats(customers = []) {
  return {
    totalCustomers: customers.length,

    upcomingTours: customers.filter(
      (c) => c.tours?.[0]?.status === "Upcoming"
    ).length,

    ongoingTours: customers.filter(
      (c) => c.tours?.[0]?.status === "Ongoing"
    ).length,

    completedTours: customers.filter(
      (c) => c.tours?.[0]?.status === "Completed"
    ).length,

    // Open queries = leads not yet acted on
    openQueries: customers.filter(
      (c) => c.follow_up_status === "New"
    ).length,
  };
}

// ── StatCard ──────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, iconBg, iconColor, borderColor }) {
  return (
    <div style={{
      flex: "1 1 160px",
      minWidth: 150,
      background: "#fff",
      borderRadius: 12,
      padding: "18px 20px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      border: "1.5px solid #f1f5f9",
      borderTop: `3px solid ${borderColor}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      {/* Icon bubble */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={18} color={iconColor} />
      </div>

      {/* Text */}
      <div>
        <div style={{
          fontSize: 22, fontWeight: 700, color: "#111827",
          lineHeight: 1.2,
        }}>
          {value}
        </div>
        <div style={{
          fontSize: 12, color: "#6b7280", marginTop: 2,
          fontWeight: 500,
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ── DashboardStats ────────────────────────────────────────────────────
export default function DashboardStats({ customers = [] }) {
  const stats = deriveStats(customers);

  const CARDS = [
    {
      label:       "Total Customers",
      value:       stats.totalCustomers,
      icon:        Users,
      iconBg:      "#EFF6FF",
      iconColor:   "#2563EB",
      borderColor: "#2563EB",
    },
    {
      label:       "Upcoming Tours",
      value:       stats.upcomingTours,
      icon:        Plane,
      iconBg:      "#F0F9FF",
      iconColor:   "#0284C7",
      borderColor: "#0284C7",
    },
    {
      label:       "Ongoing Tours",
      value:       stats.ongoingTours,
      icon:        PlayCircle,
      iconBg:      "#FFFBEB",
      iconColor:   "#D97706",
      borderColor: "#D97706",
    },
    {
      label:       "Completed Tours",
      value:       stats.completedTours,
      icon:        CheckCircle2,
      iconBg:      "#F0FDF4",
      iconColor:   "#16A34A",
      borderColor: "#16A34A",
    },
    {
      label:       "Open Queries",
      value:       stats.openQueries,
      icon:        MessageSquare,
      iconBg:      "#FEF2F2",
      iconColor:   "#DC2626",
      borderColor: "#DC2626",
    },
  ];

  return (
    <div style={{
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
      marginBottom: 24,
      fontFamily: "inherit",
    }}>
      {CARDS.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}