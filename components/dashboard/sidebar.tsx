"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Store,
  Table,
  Wifi,
  Smartphone,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { signOut } = useAuth()

  const navItems = [
    {
      name: "Tổng quan",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Quản lý cửa hàng",
      href: "/dashboard/shops",
      icon: Store,
    },
    {
      name: "Quản lý bàn",
      href: "/dashboard/tables",
      icon: Table,
    },
    {
      name: "Quản lý gateway",
      href: "/dashboard/gateways",
      icon: Wifi,
    },
    {
      name: "Quản lý thiết bị",
      href: "/dashboard/devices",
      icon: Smartphone,
    },
    {
      name: "Nhắc nhở",
      href: "/dashboard/reminders",
      icon: Bell,
    },
    {
      name: "Cài đặt",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-blue-600" />
            {!collapsed && <span className="text-lg font-bold text-gray-800">Khách Tui Vui</span>}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-full", collapsed ? "hidden" : "")}
          onClick={() => setCollapsed(true)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Thu gọn</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-full", !collapsed ? "hidden" : "")}
          onClick={() => setCollapsed(false)}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Mở rộng</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                collapsed ? "justify-center" : "",
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", pathname === item.href ? "text-blue-700" : "")} />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            collapsed ? "justify-center px-2" : "",
          )}
          onClick={signOut}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Đăng xuất</span>}
        </Button>
      </div>
    </div>
  )
}
