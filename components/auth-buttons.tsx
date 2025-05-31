"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Building } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

export function AuthButtons() {
  const { user, loading, signOut, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    )
  }

  if (isAuthenticated && user) {
    const displayName = user.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim()
      : user.email?.split("@")[0] || "Người dùng"

    return (
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">{displayName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm text-gray-500">
              <div className="font-medium text-gray-900">{displayName}</div>
              <div className="text-xs">{user.email}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt tài khoản
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="flex items-center text-red-600 focus:text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/dang-nhap">
        <Button variant="outline" className="hidden md:flex">
          Đăng nhập
        </Button>
      </Link>
      <Link href="/dang-ky">
        <Button className="bg-blue-600 hover:bg-blue-700 hidden md:flex">Đăng ký</Button>
      </Link>
    </div>
  )
}
