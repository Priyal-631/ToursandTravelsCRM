import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Sidebar from "../components/ui/shared/Sidebar"
import Topbar from "../components/ui/shared/Topbar"

export default function AdminLayout() {
  const { user, profile, loading, isAdmin } = useAuth()

  if (loading || (user && !profile)) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/unauthorized" replace />

  return (
    <div className="flex h-screen">
      <Sidebar />
 
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
