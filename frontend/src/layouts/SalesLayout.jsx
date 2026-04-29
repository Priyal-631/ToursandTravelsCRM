import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

import Sidebar from '../components/ui/shared/sidebar'
import Topbar from '../components/ui/shared/topbar'

// Roles that are allowed into the Sales section
const SALES_ROLES = ['MANAGER', 'EXECUTIVE', 'ACCOUNTS']

export default function SalesLayout() {
  const { user, profile, loading, isAdmin } = useAuth()
  const location = useLocation()

  const [searchQuery, setSearchQuery] = useState('')
  // Hide search on reports page
  const showSearch = !location.pathname.includes('/sales/reports')

  if (loading || (user && !profile)) return null

  if (!user) return <Navigate to="/login" replace />

  // Admin can access everything, sales roles get their own layout
  const hasAccess = isAdmin || SALES_ROLES.includes(profile?.role)
  if (!hasAccess) return <Navigate to="/unauthorized" replace />

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