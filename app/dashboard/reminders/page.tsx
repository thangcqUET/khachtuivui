"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Clock, CheckCircle, AlertCircle, Play, Pause, RotateCcw, Calendar } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"

type Reminder = {
  id: string
  tableId: string
  tableNumber: string
  shopId: string
  shopName: string
  deviceCode: string
  scheduledTime: string
  sentTime: string | null
  status: "scheduled" | "sent" | "failed" | "cancelled"
  message: string
  type: "auto" | "manual"
}

export default function RemindersPage() {
  const { addNotification } = useNotifications()
  const [selectedShop, setSelectedShop] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

  const [shops] = useState([
    { id: "1", name: "Cà phê Khách Tui Vui" },
    { id: "2", name: "Nhà hàng Khách Vui" },
  ])

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      tableId: "1",
      tableNumber: "1",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      deviceCode: "KTV-D001",
      scheduledTime: "2024-01-15 14:30:00",
      sentTime: "2024-01-15 14:30:15",
      status: "sent",
      message: "Xin chào! Bạn đã ngồi khá lâu rồi, có muốn gọi thêm gì không?",
      type: "auto",
    },
    {
      id: "2",
      tableId: "3",
      tableNumber: "3",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      deviceCode: "KTV-D003",
      scheduledTime: "2024-01-15 15:00:00",
      sentTime: null,
      status: "scheduled",
      message: "Chúng tôi có món mới hôm nay, bạn có muốn thử không?",
      type: "manual",
    },
    {
      id: "3",
      tableId: "5",
      tableNumber: "5",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      deviceCode: "KTV-D005",
      scheduledTime: "2024-01-15 14:45:00",
      sentTime: null,
      status: "failed",
      message: "Cảm ơn bạn đã ghé thăm! Hẹn gặp lại lần sau.",
      type: "auto",
    },
    {
      id: "4",
      tableId: "9",
      tableNumber: "9",
      shopId: "2",
      shopName: "Nhà hàng Khách Vui",
      deviceCode: "KTV-D009",
      scheduledTime: "2024-01-15 15:15:00",
      sentTime: null,
      status: "scheduled",
      message: "Món ăn của bạn sẽ được phục vụ trong 5 phút nữa.",
      type: "manual",
    },
  ])

  const filteredReminders = reminders.filter((reminder) => {
    if (selectedShop && reminder.shopId !== selectedShop) return false
    if (selectedStatus && reminder.status !== selectedStatus) return false
    return true
  })

  const handleSendReminder = (reminderId: string) => {
    const reminder = reminders.find((r) => r.id === reminderId)
    if (!reminder) return

    setReminders(
      reminders.map((r) =>
        r.id === reminderId ? { ...r, status: "sent" as const, sentTime: new Date().toISOString() } : r,
      ),
    )

    addNotification({
      title: "Nhắc nhở đã gửi",
      message: `Đã gửi nhắc nhở đến bàn ${reminder.tableNumber}`,
      type: "reminder",
      tableId: reminder.tableId,
    })
  }

  const handleCancelReminder = (reminderId: string) => {
    setReminders(reminders.map((r) => (r.id === reminderId ? { ...r, status: "cancelled" as const } : r)))
  }

  const handleRetryReminder = (reminderId: string) => {
    setReminders(
      reminders.map((r) =>
        r.id === reminderId ? { ...r, status: "scheduled" as const, scheduledTime: new Date().toISOString() } : r,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800 border-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "sent":
        return "Đã gửi"
      case "scheduled":
        return "Đã lên lịch"
      case "failed":
        return "Thất bại"
      case "cancelled":
        return "Đã hủy"
      default:
        return "Không xác định"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "cancelled":
        return <Pause className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const stats = {
    total: reminders.length,
    sent: reminders.filter((r) => r.status === "sent").length,
    scheduled: reminders.filter((r) => r.status === "scheduled").length,
    failed: reminders.filter((r) => r.status === "failed").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý nhắc nhở</h1>
          <p className="text-gray-600">Theo dõi và quản lý các nhắc nhở gửi đến khách hàng</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedShop} onValueChange={setSelectedShop}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tất cả cửa hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả cửa hàng</SelectItem>
              {shops.map((shop) => (
                <SelectItem key={shop.id} value={shop.id}>
                  {shop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="scheduled">Đã lên lịch</SelectItem>
              <SelectItem value="sent">Đã gửi</SelectItem>
              <SelectItem value="failed">Thất bại</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng nhắc nhở</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Đã gửi</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Đã lên lịch</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Thất bại</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="scheduled">Đã lên lịch</TabsTrigger>
          <TabsTrigger value="sent">Đã gửi</TabsTrigger>
          <TabsTrigger value="failed">Thất bại</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {filteredReminders.map((reminder) => (
              <Card key={reminder.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {getStatusIcon(reminder.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">Bàn {reminder.tableNumber}</h3>
                          <Badge variant="outline" className={getStatusColor(reminder.status)}>
                            {getStatusText(reminder.status)}
                          </Badge>
                          <Badge variant="secondary">{reminder.type === "auto" ? "Tự động" : "Thủ công"}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{reminder.shopName}</p>
                        <p className="text-sm mb-2">{reminder.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Lên lịch: {new Date(reminder.scheduledTime).toLocaleString()}</span>
                          </div>
                          {reminder.sentTime && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>Đã gửi: {new Date(reminder.sentTime).toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <span>Thiết bị: {reminder.deviceCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {reminder.status === "scheduled" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSendReminder(reminder.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Gửi ngay
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleCancelReminder(reminder.id)}>
                            <Pause className="h-4 w-4 mr-1" />
                            Hủy
                          </Button>
                        </>
                      )}
                      {reminder.status === "failed" && (
                        <Button size="sm" variant="outline" onClick={() => handleRetryReminder(reminder.id)}>
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Thử lại
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="space-y-4">
            {filteredReminders
              .filter((r) => r.status === "scheduled")
              .map((reminder) => (
                <Card key={reminder.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">Bàn {reminder.tableNumber}</h3>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                              Đã lên lịch
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{reminder.shopName}</p>
                          <p className="text-sm mb-2">{reminder.message}</p>
                          <div className="text-xs text-gray-500">
                            Lên lịch: {new Date(reminder.scheduledTime).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleSendReminder(reminder.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Gửi ngay
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCancelReminder(reminder.id)}>
                          <Pause className="h-4 w-4 mr-1" />
                          Hủy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <div className="space-y-4">
            {filteredReminders
              .filter((r) => r.status === "sent")
              .map((reminder) => (
                <Card key={reminder.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">Bàn {reminder.tableNumber}</h3>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Đã gửi
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{reminder.shopName}</p>
                        <p className="text-sm mb-2">{reminder.message}</p>
                        <div className="text-xs text-gray-500">
                          Đã gửi: {reminder.sentTime && new Date(reminder.sentTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="failed" className="space-y-4">
          <div className="space-y-4">
            {filteredReminders
              .filter((r) => r.status === "failed")
              .map((reminder) => (
                <Card key={reminder.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">Bàn {reminder.tableNumber}</h3>
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                              Thất bại
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{reminder.shopName}</p>
                          <p className="text-sm mb-2">{reminder.message}</p>
                          <div className="text-xs text-gray-500">
                            Lên lịch: {new Date(reminder.scheduledTime).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleRetryReminder(reminder.id)}>
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Thử lại
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
