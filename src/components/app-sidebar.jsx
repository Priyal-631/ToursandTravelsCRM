import { ChevronDown, Home, Users, BarChart3, FileText, Map, Zap } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible,CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

// Logo component - You can replace this with your own logo
function LogoComponent() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-blue-700">
        <Map className="h-5 w-5 text-white" />
      </div>
      <span className="font-semibold text-lg">Tours & Travels</span>
    </div>
  )
}

// Menu items with custom icons and grouping
const menuItems = {
  admin: [
    {
      label: "Dashboard",
      icon: Home,
      url: "/admin/dashboard",
    },
    {
      label: "Users",
      icon: Users,
      url: "/admin/users",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      url: "/admin/analytics",
    },
    {
      label: "Reports",
      icon: FileText,
      url: "/admin/reports",
    },
  ],
  sales: [
    {
      label: "CRM",
      icon: Zap,
      url: "/sales/crm",
    },
    {
      label: "Dashboard",
      icon: Home,
      url: "/sales/dashboard",
    },
  ],
}

export function AppSidebar() {
  const { profile, logout } = useAuth()
  const role = profile?.role || "GUEST"

  // Determine which menu items to show based on role
  const getVisibleItems = () => {
    if (role === "ADMIN") {
      return menuItems.admin
    }
    return menuItems.sales
  }

  const visibleItems = getVisibleItems()

  return (
    <Sidebar className="border-r border-gray-200">
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-gray-200 py-4">
        <LogoComponent />
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="px-0">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Menu
          </SidebarGroupLabel>
          <SidebarMenu>
            {visibleItems.map((item) => {
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    className="px-4 py-2 hover:bg-gray-100 rounded-md"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Additional Groups Example - Uncomment to use */}
        {role === "ADMIN" && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Settings
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="px-4 py-2 hover:bg-gray-100 rounded-md"
                >
                  <a href="#" className="flex items-center gap-3">
                    <Zap className="h-4 w-4" />
                    <span>Configuration</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter className="border-t border-gray-200 py-4 px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-between px-3 py-2 hover:bg-gray-100 rounded-md">
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                      {profile?.full_name || "User"}
                    </span>
                    <span className="text-xs text-gray-500">{role}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled>
                  <span className="text-sm">{profile?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
