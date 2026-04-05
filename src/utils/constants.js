/**
 * src/utils/constants.js
 *
 * Single source of truth for all static dropdown data used across the app.
 * Independent — no imports required.
 *
 * Used by:
 *   - Dashboard/Filterbar.jsx      (states, countries, types, months)
 *   - Customers/Index.jsx          (same)
 *   - Customers/AddCustomerModal   (destinations, statuses, types)
 *   - CRM pages                    (lead sources)
 */

// ── Tour Type ─────────────────────────────────────────────────────────
export const TOUR_TYPES = ["National", "International"]

// ── Tour Status ───────────────────────────────────────────────────────
export const TOUR_STATUSES = ["Upcoming", "Ongoing", "Completed", "Cancelled"]

// ── Package Types ─────────────────────────────────────────────────────
export const PACKAGE_TYPES = [
  "Honeymoon",
  "Family",
  "Adventure",
  "Custom",
  "Pilgrimage",
  "Corporate",
  "Solo",
]

// ── Lead / Follow-up Statuses ─────────────────────────────────────────
export const FOLLOW_UP_STATUSES = [
  "New",
  "Contacted",
  "Interested",
  "Not Interested",
  "Converted",
  "Lost",
]

// ── Lead Sources ──────────────────────────────────────────────────────
export const LEAD_SOURCES = [
  "Walk-in",
  "Phone",
  "WhatsApp",
  "Email",
  "Instagram",
  "Facebook",
  "Google",
  "Referral",
  "Other",
]

// ── Indian States ─────────────────────────────────────────────────────
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // UTs
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]

// ── Countries (common travel destinations) ────────────────────────────
export const COUNTRIES = [
  "Australia",
  "Bali (Indonesia)",
  "Bhutan",
  "Canada",
  "Dubai (UAE)",
  "Egypt",
  "France",
  "Greece",
  "Indonesia",
  "Italy",
  "Japan",
  "Kenya",
  "Maldives",
  "Malaysia",
  "Nepal",
  "New Zealand",
  "Singapore",
  "South Africa",
  "Spain",
  "Sri Lanka",
  "Switzerland",
  "Thailand",
  "Turkey",
  "United Kingdom",
  "United States",
  "Vietnam",
]

// ── Popular Destinations (from tours.csv — used in Add/Edit dropdowns) ─
export const DESTINATIONS = [
  "Andaman",
  "Bali",
  "Coorg",
  "Darjeeling",
  "Dubai",
  "Europe",
  "Goa",
  "Himachal Pradesh",
  "Kashmir",
  "Kerala",
  "Kullu Manali",
  "Leh Ladakh",
  "Maldives",
  "Manali",
  "Mussoorie",
  "Nepal",
  "Ooty",
  "Paris",
  "Rajasthan",
  "Shimla",
  "Singapore",
  "Sri Lanka",
  "Switzerland",
  "Thailand",
  "Varanasi",
]

// ── Calendar Months ───────────────────────────────────────────────────
export const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
]

// ── Year range helper (last 3 years + next 2) ─────────────────────────
export function getYearRange() {
  const current = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => String(current - 2 + i))
}
