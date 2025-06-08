"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, TableIcon, Wifi, Smartphone, Bell, Activity, Clock, Plus, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useNotifications } from "@/hooks/use-notifications"

export default function DashboardPage() {
  const { user } = useAuth()
  const { notifications } = useNotifications()
  const [stats, setStats] = useState({
    shops: 0,
    tables: 0,
    gateways: 0,
    devices: 0,
    reminders: 0,
    activeDevices: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      // In a real app, you would fetch this data from your API
      setTimeout(() => {
        setStats({
          shops: 2,
          tables: 24,
          gateways: 3,
          devices: 28,
          reminders: 5,
          activeDevices: 22,
        })
        setIsLoading(false)
      }, 1000)
    }

    fetchData()
  }, [])

  const recentActivities = [
    {
      id: 1,
      type: "call",
      message: "Bàn 5 gọi nhân viên",
      time: "2 phút trước",
      status: "pending",
    },
    {
      id: 2,
      type: "reminder",
      message: "Nhắc nhở bàn 3 đã được gửi",
      time: "15 phút trước",
      status: "completed",
    },
    {
      id: 3,
      type: "system",
      message: "Gateway 2 đã kết nối lại",
      time: "1 giờ trước",
      status: "completed",
    },
    {
      id: 4,
      type: "call",
      message: "Bàn 12 gọi nhân viên",
      time: "2 giờ trước",
      status: "completed",
    },
  ]

  const displayName = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim()
    : user?.email?.split("@")[0] || "Người dùng"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Xin chào, {displayName}!</h1>
        <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cửa hàng</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.shops}</div>
            <p className="text-xs text-muted-foreground">
              {stats.shops > 0 ? "Đang hoạt động" : "Chưa có cửa hàng nào"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bàn</CardTitle>
            <TableIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.tables}</div>
            <p className="text-xs text-muted-foreground">Tổng số bàn đã thiết lập</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thiết bị</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.devices}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{stats.activeDevices}</span> thiết bị đang hoạt động
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các hoạt động và sự kiện trong 24 giờ qua</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center ${
                      activity.type === "call"
                        ? "bg-red-100 text-red-600"
                        : activity.type === "reminder"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {activity.type === "call" ? (
                      <Bell className="h-5 w-5" />
                    ) : activity.type === "reminder" ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <Activity className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div>
                    {activity.status === "pending" ? (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                        Đang chờ
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        Hoàn thành
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Thông báo</CardTitle>
            <CardDescription>Thông báo và cảnh báo từ hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-4">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center ${
                        notification.type === "call"
                          ? "bg-red-100 text-red-600"
                          : notification.type === "reminder"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {notification.type === "call" ? (
                        <Bell className="h-5 w-5" />
                      ) : notification.type === "reminder" ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <Activity className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Không có thông báo mới</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Tabs defaultValue="shops">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="shops">Cửa hàng</TabsTrigger>
              <TabsTrigger value="tables">Bàn</TabsTrigger>
              <TabsTrigger value="gateways">Gateway</TabsTrigger>
              <TabsTrigger value="devices">Thiết bị</TabsTrigger>
            </TabsList>
            <Button size="sm" className="hidden md:flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Thêm mới
            </Button>
          </div>

          <TabsContent value="shops" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cửa hàng của bạn</CardTitle>
                <CardDescription>Quản lý thông tin cửa hàng</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.shops > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <Store className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">Cà phê Khách Tui Vui</h3>
                              <p className="text-sm text-gray-500">123 Nguyễn Huệ, Quận 1, TP.HCM</p>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Số bàn:</span> 12
                            </div>
                            <div>
                              <span className="text-gray-500">Thiết bị:</span> 15
                            </div>
                            <div>
                              <span className="text-gray-500">Gateway:</span> 2
                            </div>
                            <div>
                              <span className="text-gray-500">Nhắc nhở:</span> 30 phút
                            </div>
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <Button variant="outline" size="sm">
                              Chi tiết
                            </Button>
                            <Button variant="outline" size="sm">
                              Chỉnh sửa
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                              <Store className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">Nhà hàng Khách Vui</h3>
                              <p className="text-sm text-gray-500">456 Lê Lợi, Quận 3, TP.HCM</p>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Số bàn:</span> 12
                            </div>
                            <div>
                              <span className="text-gray-500">Thiết bị:</span> 13
                            </div>
                            <div>
                              <span className="text-gray-500">Gateway:</span> 1
                            </div>
                            <div>
                              <span className="text-gray-500">Nhắc nhở:</span> 45 phút
                            </div>
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <Button variant="outline" size="sm">
                              Chi tiết
                            </Button>
                            <Button variant="outline" size="sm">
                              Chỉnh sửa
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Chưa có cửa hàng nào</h3>
                    <p className="text-gray-500 mb-4">Bắt đầu bằng cách thêm cửa hàng đầu tiên của bạn</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm cửa hàng
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý bàn</CardTitle>
                <CardDescription>Xem và quản lý các bàn trong cửa hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TableIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Xem chi tiết tại trang quản lý bàn</h3>
                  <p className="text-gray-500 mb-4">Quản lý bàn và thiết lập nhắc nhở</p>
                  <Button asChild>
                    <a href="/dashboard/tables">Đi đến quản lý bàn</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gateways" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý Gateway</CardTitle>
                <CardDescription>Xem và quản lý các gateway trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Wifi className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Xem chi tiết tại trang quản lý gateway</h3>
                  <p className="text-gray-500 mb-4">Quản lý kết nối và cấu hình gateway</p>
                  <Button asChild>
                    <a href="/dashboard/gateways">Đi đến quản lý gateway</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý thiết bị</CardTitle>
                <CardDescription>Xem và quản lý các thiết bị trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Smartphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Xem chi tiết tại trang quản lý thiết bị</h3>
                  <p className="text-gray-500 mb-4">Quản lý thiết bị và liên kết với bàn</p>
                  <Button asChild>
                    <a href="/dashboard/devices">Đi đến quản lý thiết bị</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
