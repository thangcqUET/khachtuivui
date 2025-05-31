"use client"

import { useState } from "react"
import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { useNotifications } from "@/hooks/use-notifications"

export function DashboardHeader() {
  const { user } = useAuth()
  const { notifications, markAsRead } = useNotifications()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const displayName = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim()
    : user?.email?.split("@")[0] || "Người dùng"

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>

        <div className="hidden md:flex md:flex-1 md:items-center md:justify-start">
          <div className="max-w-md w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500">Không có thông báo mới</div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`p-3 cursor-pointer ${notification.read ? "opacity-70" : "font-medium"}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <p className="text-sm">{notification.title}</p>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-sm text-blue-600 cursor-pointer">
                    Xem tất cả thông báo
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline-block text-sm font-medium">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
              <DropdownMenuItem>Cài đặt</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {}}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
