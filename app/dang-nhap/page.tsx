"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useActionState } from "react"
import { loginUser } from "./actions"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginUser, null)
  const [showPassword, setShowPassword] = useState(false)
  const { isAuthenticated, loading } = useAuth()

  // Redirect if already logged in
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Bạn đã đăng nhập</h1>
          <p className="text-gray-600 mb-6">Bạn đã đăng nhập thành công vào hệ thống.</p>
          <div className="space-x-4">
            <Link href="/">
              <Button variant="outline">Về trang chủ</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">Đi tới Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về trang chủ
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">Khách Tui Vui</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
          <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-center text-xl text-gray-800">Đăng nhập tài khoản</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-4">
              <div>
                <Label htmlFor="email">Email hoặc số điện thoại *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="email@example.com hoặc 0901234567"
                  disabled={isPending}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Mật khẩu *</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Nhập mật khẩu"
                    disabled={isPending}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link href="/quen-mat-khau" className="text-sm text-blue-600 hover:text-blue-700">
                  Quên mật khẩu?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            {/* Success/Error Messages */}
            {state && (
              <div
                className={`mt-4 p-3 rounded-md text-center ${
                  state.success
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {state.success ? state.message : state.error}
              </div>
            )}

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc</span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6 space-y-3">
              <Button variant="outline" className="w-full" disabled={isPending}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.কিন্তা6.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Đăng nhập với Google
              </Button>
              <Button variant="outline" className="w-full" disabled={isPending}>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Đăng nhập với Facebook
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link href="/dang-ky" className="text-blue-600 hover:text-blue-700 font-medium">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <Link href="/dieu-khoan" className="text-blue-600 hover:text-blue-700">
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link href="/chinh-sach" className="text-blue-600 hover:text-blue-700">
              Chính sách bảo mật
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
