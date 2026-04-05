import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ── searchQuery + onSearchChange are now controlled from AdminLayout ─
export default function Topbar({
  searchQuery = "",
  onSearchChange,
  showSearch = true,
  roleLabel,
  avatarInitials,
}) {
  const { logout, profile } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayRole = roleLabel ?? profile?.role ?? "USER";
  const displayInitials = avatarInitials ?? displayRole.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error?.message || error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className={`h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 ${
      showSearch ? "justify-between" : "justify-end"
    }`}>

      {/* Search Bar */}
      {showSearch && (
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9 h-9 bg-gray-50 border-gray-200 text-sm rounded-lg focus:bg-white transition-colors"
            />
          </div>
        </div>
      )}

      {/* Right: Bell + Avatar */}
      <div className="flex items-center gap-3">

        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500 hover:bg-red-500 border-white border-2">
            3
          </Badge>
        </Button>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-9 px-2 hover:bg-gray-100 rounded-lg"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">{displayRole}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-gray-500">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}