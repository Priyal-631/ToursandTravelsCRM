import { NavLink } from "react-router-dom"
import { useState } from "react"
import {
  Home,
  Users,
  ChartColumn,
  MessageSquare,
  Plane,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

function Logo({ isCollapsed }) {
  return (
    <div className={`flex items-center gap-2 py-3 ${
      isCollapsed ? "justify-center px-2" : "px-4"
    }`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
        <Plane className="h-5 w-5 text-white font-semibold" />
      </div>
      {!isCollapsed && (
        <span className="font-bold text-lg tracking-tight text-white">Sukhi Travels</span>
      )}
    </div>
  )
}

// Admin menu
const adminMenuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: Home },
  { label: "Reports",   path: "/admin/reports",   icon: ChartColumn },
  { label: "Customers", path: "/admin/customers", icon: Users },
  { label: "Queries",   path: "/admin/queries",   icon: MessageSquare },
]

// Manager menu - Query module only
const managerMenuItems = [
  { label: "Queries", path: "/manager/queries", icon: MessageSquare },
]

// Sales menu (EXECUTIVE, ACCOUNTS)
const salesMenuItems = [
  { label: "Reports", path: "/sales/reports", icon: ChartColumn },
  { label: "Queries", path: "/sales/queries", icon: MessageSquare },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { isAdmin, profile } = useAuth()

  // Choose menu based on role
  let menuItems = []
  if (isAdmin) {
    menuItems = adminMenuItems
  } else if (profile?.role === 'MANAGER') {
    menuItems = managerMenuItems
  } else {
    menuItems = salesMenuItems
  }

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-[#1e2a38] transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      style={{ backgroundColor: '#2F4156' }}
    >
      <div className="relative border-b border-white/10">
        <Logo isCollapsed={isCollapsed} />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white shadow-lg transition-all z-50"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.path} to={item.path}>
                {({ isActive }) => (
                  <div
                    className={`flex items-center rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    } ${
                      isCollapsed
                        ? "justify-center py-3 px-2"
                        : "gap-3 px-3 py-2.5"
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}