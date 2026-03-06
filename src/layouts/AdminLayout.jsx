import { useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

import Sidebar from "../components/ui/shared/Sidebar"
import Topbar from "../components/ui/shared/Topbar"

export default function AdminLayout() {
  const { user, profile, loading, isAdmin } = useAuth()

  // ── Search state lives here so it can be shared with all pages ───
  const [searchQuery, setSearchQuery] = useState("")

  if (loading || (user && !profile)) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/unauthorized" replace />

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Pass setter to Topbar so it can update the query */}
        <Topbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <main className="flex-1 overflow-y-auto p-4">
          {/* Pass query to any page via Outlet context */}
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  )
}