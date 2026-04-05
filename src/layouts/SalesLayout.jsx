import { useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { ChartColumn, MessageSquare } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import Sidebar from "../components/ui/shared/sidebar"
import Topbar from "../components/ui/shared/topbar"

const salesMenuItems = [
  { label: "Reports", path: "/sales/reports", icon: ChartColumn },
  { label: "Queries", path: "/sales/queries", icon: MessageSquare },
]

export default function AdminLayout() {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  const [searchQuery, setSearchQuery] = useState("")
  // Hide search bar on reports and customers pages
  const showSearch =
    !location.pathname.includes("/reports") &&
    !location.pathname.includes("/customers")

  if (loading || (user && !profile)) return null
  if (!user) return <Navigate to="/login" replace />
  if (profile?.role !== "ADMIN" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/unauthorized" replace />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar menuItems={salesMenuItems} />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSearch={showSearch}
          roleLabel="MANAGER"
          avatarInitials="MG"
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  )
}