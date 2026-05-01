import { useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

import Sidebar from "../components/ui/shared/sidebar"
import Topbar from "../components/ui/shared/topbar"

export default function AdminLayout() {
  const { user, profile, loading, isAdmin } = useAuth()
  const location = useLocation()

  const [searchQuery, setSearchQuery] = useState("")
  const showSearch = !location.pathname.includes("/reports")

  if (loading || (user && !profile)) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/unauthorized" replace />

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar searchQuery={searchQuery} onSearchChange={setSearchQuery} showSearch={showSearch} />

        {/* No padding here — each page owns its own spacing and scroll */}
        <main className="flex-1 overflow-hidden">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  )
}
