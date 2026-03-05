// src/components/charts/MostVisitedGrid.jsx
// Status: [I] Independent — receives data as props, no DB calls.
// Plain CSS grid (no Recharts needed) matching Image 2's 3-column tile layout.

const DUMMY = [
  { place: "Goa",       count: 342 },
  { place: "Dubai",     count: 312 },
  { place: "Kerala",    count: 287 },
  { place: "Manali",    count: 256 },
  { place: "Bali",      count: 203 },
  { place: "Rajasthan", count: 198 },
  { place: "Bangkok",   count: 189 },
  { place: "Kashmir",   count: 178 },
  { place: "Maldives",  count: 176 },
];

/**
 * @param {Array}   data     [{ place, count }] — from getMostVisitedPlaces()
 * @param {boolean} loading
 * @param {string}  period   "monthly" | "yearly"
 */
export default function MostVisitedGrid({ data, loading, period }) {
  const tiles = (data && data.length > 0 ? data : DUMMY).slice(0, 9);

  if (loading) {
    return (
      <div style={s.grid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={s.skeleton} />
        ))}
      </div>
    );
  }

  return (
    <div style={s.grid}>
      {tiles.map((item, i) => (
        <div key={i} style={s.tile}>
          <span style={s.placeName}>{item.place}</span>
          <span style={s.count}>{item.count.toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
}

const s = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    width: "100%",
  },
  tile: {
    background: "#DBEAFE",          // light blue matching Image 2
    borderRadius: "10px",
    padding: "14px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    cursor: "default",
    transition: "background 0.15s",
  },
  placeName: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#1E40AF",
    textAlign: "center",
  },
  count: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#2563EB",
    lineHeight: 1,
  },
  skeleton: {
    background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
    borderRadius: "10px",
    height: "68px",
  },
};
