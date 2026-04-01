import { useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

import Sidebar from "../components/ui/shared/sidebar"
import Topbar from "../components/ui/shared/topbar"

import { ChartColumn, MessageSquare } from "lucide-react"

// Roles that are allowed into the Sales section
const SALES_ROLES = ["MANAGER", "EXECUTIVE", "ACCOUNTS"]

const salesMenuItems = [
  { label: "Reports", path: "/sales/reports", icon: ChartColumn },
  { label: "Queries", path: "/sales/queries", icon: MessageSquare },
]

export default function SalesLayout() {
  const { user, profile, loading, isAdmin } = useAuth()
  const location = useLocation()

  const [searchQuery, setSearchQuery] = useState("")
  const showSearch = !location.pathname.includes("/reports")

  // Wait for profile to load before making any redirect decision
  if (loading || (user && !profile)) return null // or a spinner

  if (!user) return <Navigate to="/login" replace />

  // Admin can access everything, sales roles get their own layout
  const hasAccess = isAdmin || SALES_ROLES.includes(profile?.role)
  if (!hasAccess) return <Navigate to="/unauthorized" replace />

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar menuItems={salesMenuItems} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar searchQuery={searchQuery} onSearchChange={setSearchQuery} showSearch={showSearch} />

        <main className="flex-1 overflow-hidden">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  )
}