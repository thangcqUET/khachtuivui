"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Smartphone,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Link,
  Unlink,
  Battery,
  CheckCircle,
  MessageSquare,
  Copy,
  Loader2,
} from "lucide-react"

import { useDevices, useShops, useGateways, useTables, useDeviceMessages } from "@/hooks/use-database"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/hooks/use-toast"

type Message = {
  id: string
  content: string
  type: "greeting" | "reminder" | "promotion" | "farewell" | "custom"
  isActive: boolean
  createdAt: string
}

type Device = {
  id: string
  code: string
  name: string
  gatewayId: string
  gatewayName: string
  tableId: string | null
  tableNumber: string | null
  shopId: string
  shopName: string
  status: "online" | "offline" | "low_battery"
  batteryLevel: number
  lastSeen: string
  version: string
  messages: Message[]
}

export default function DevicesPage() {
  const { user } = useAuth()
  const { shops, loading: shopsLoading } = useShops()
  const [selectedShop, setSelectedShop] = useState("")
  const { devices, loading: devicesLoading, createDevice, updateDevice, deleteDevice } = useDevices(selectedShop)
  const { gateways } = useGateways(selectedShop)
  const { tables } = useTables(selectedShop)

  // Set default shop when shops load
  useEffect(() => {
    if (shops.length > 0 && !selectedShop) {
      setSelectedShop(shops[0].id)
    }
  }, [shops, selectedShop])

  const [newDevice, setNewDevice] = useState({
    code: "",
    name: "",
    gateway_id: "",
    table_id: null as string | null,
    shop_id: "",
  })

  const [newMessage, setNewMessage] = useState<Omit<Message, "id" | "createdAt">>({
    content: "",
    type: "custom",
    isActive: true,
  })

  const [currentDevice, setCurrentDevice] = useState<Device | null>(null)

  const { messages, createMessage, updateMessage, deleteMessage } = useDeviceMessages(currentDevice?.id || "")

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isMessagesDialogOpen, setIsMessagesDialogOpen] = useState(false)

  const filteredDevices = selectedShop ? devices.filter((device) => device.shopId === selectedShop) : devices
  const availableTables = tables.filter(
    (table) =>
      table.shopId === (currentDevice?.shopId || newDevice.shop_id) &&
      !devices.some((device) => device.tableId === table.id && device.id !== currentDevice?.id),
  )

  const handleAddDevice = async () => {
    try {
      await createDevice({
        ...newDevice,
        shop_id: newDevice.shop_id,
      })
      setNewDevice({
        code: "",
        name: "",
        gateway_id: "",
        table_id: null,
        shop_id: "",
      })
      setIsAddDialogOpen(false)
      toast({
        title: "Thành công",
        description: "Đã thêm thiết bị mới",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm thiết bị",
        variant: "destructive",
      })
    }
  }

  const handleEditDevice = async () => {
    if (!currentDevice) return

    try {
      await updateDevice({
        id: currentDevice.id,
        code: currentDevice.code,
        name: currentDevice.name,
        gateway_id: currentDevice.gatewayId,
      })

      toast({
        title: "Thành công",
        description: "Đã cập nhật thiết bị",
      })
      setIsEditDialogOpen(false)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thiết bị",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDevice = async () => {
    if (!currentDevice) return

    try {
      await deleteDevice(currentDevice.id)
      toast({
        title: "Thành công",
        description: "Đã xóa thiết bị",
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa thiết bị",
        variant: "destructive",
      })
    }
  }

  const handleLinkToTable = async (tableId: string | null) => {
    if (!currentDevice) return

    try {
      await updateDevice({
        id: currentDevice.id,
        table_id: tableId,
      })

      toast({
        title: "Thành công",
        description: "Đã liên kết thiết bị với bàn",
      })
      setIsLinkDialogOpen(false)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể liên kết thiết bị với bàn",
        variant: "destructive",
      })
    }
  }

  const handleAddMessage = () => {
    if (!currentDevice || !newMessage.content.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      ...newMessage,
      createdAt: new Date().toISOString(),
    }

    setDevices(
      devices.map((device) =>
        device.id === currentDevice.id
          ? {
              ...device,
              messages: [...device.messages, message],
            }
          : device,
      ),
    )

    // Update current device state
    setCurrentDevice({
      ...currentDevice,
      messages: [...currentDevice.messages, message],
    })

    setNewMessage({
      content: "",
      type: "custom",
      isActive: true,
    })
  }

  const handleDeleteMessage = (messageId: string) => {
    if (!currentDevice) return

    setDevices(
      devices.map((device) =>
        device.id === currentDevice.id
          ? {
              ...device,
              messages: device.messages.filter((msg) => msg.id !== messageId),
            }
          : device,
      ),
    )

    // Update current device state
    setCurrentDevice({
      ...currentDevice,
      messages: currentDevice.messages.filter((msg) => msg.id !== messageId),
    })
  }

  const handleToggleMessage = (messageId: string) => {
    if (!currentDevice) return

    setDevices(
      devices.map((device) =>
        device.id === currentDevice.id
          ? {
              ...device,
              messages: device.messages.map((msg) =>
                msg.id === messageId ? { ...msg, isActive: !msg.isActive } : msg,
              ),
            }
          : device,
      ),
    )

    // Update current device state
    setCurrentDevice({
      ...currentDevice,
      messages: currentDevice.messages.map((msg) => (msg.id === messageId ? { ...msg, isActive: !msg.isActive } : msg)),
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 border-green-200"
      case "offline":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "low_battery":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Trực tuyến"
      case "offline":
        return "Ngoại tuyến"
      case "low_battery":
        return "Pin yếu"
      default:
        return "Không xác định"
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-600"
    if (level > 20) return "text-yellow-600"
    return "text-red-600"
  }

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case "greeting":
        return "bg-blue-100 text-blue-800"
      case "reminder":
        return "bg-yellow-100 text-yellow-800"
      case "promotion":
        return "bg-green-100 text-green-800"
      case "farewell":
        return "bg-purple-100 text-purple-800"
      case "custom":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMessageTypeText = (type: string) => {
    switch (type) {
      case "greeting":
        return "Chào hỏi"
      case "reminder":
        return "Nhắc nhở"
      case "promotion":
        return "Khuyến mãi"
      case "farewell":
        return "Tạm biệt"
      case "custom":
        return "Tùy chỉnh"
      default:
        return "Khác"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý thiết bị</h1>
          <p className="text-gray-600">Quản lý thiết bị IoT, liên kết với bàn và tin nhắn</p>
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm thiết bị
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm thiết bị mới</DialogTitle>
                <DialogDescription>Thêm thiết bị IoT mới vào hệ thống</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Mã thiết bị
                  </Label>
                  <Input
                    id="code"
                    value={newDevice.code}
                    onChange={(e) => setNewDevice({ ...newDevice, code: e.target.value })}
                    className="col-span-3"
                    placeholder="KTV-D001"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên thiết bị
                  </Label>
                  <Input
                    id="name"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Thiết bị bàn 1"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shop" className="text-right">
                    Cửa hàng
                  </Label>
                  <Select
                    value={newDevice.shop_id}
                    onValueChange={(value) =>
                      setNewDevice({ ...newDevice, shop_id: value, gateway_id: "", table_id: null })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn cửa hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      {shops.map((shop) => (
                        <SelectItem key={shop.id} value={shop.id}>
                          {shop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gateway" className="text-right">
                    Gateway
                  </Label>
                  <Select
                    value={newDevice.gateway_id}
                    onValueChange={(value) => setNewDevice({ ...newDevice, gateway_id: value })}
                    disabled={!newDevice.shop_id}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      {gateways
                        .filter((gateway) => gateway.shopId === newDevice.shop_id)
                        .map((gateway) => (
                          <SelectItem key={gateway.id} value={gateway.id}>
                            {gateway.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table" className="text-right">
                    Bàn (tùy chọn)
                  </Label>
                  <Select
                    value={newDevice.table_id || "__not_linked__"}
                    onValueChange={(value) =>
                      setNewDevice({ ...newDevice, table_id: value === "__not_linked__" ? null : value })
                    }
                    disabled={!newDevice.shop_id}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn bàn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__not_linked__">Không liên kết</SelectItem>
                      {tables
                        .filter(
                          (table) =>
                            table.shopId === newDevice.shop_id &&
                            !devices.some((device) => device.tableId === table.id),
                        )
                        .map((table) => (
                          <SelectItem key={table.id} value={table.id}>
                            Bàn {table.number}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddDevice}>Thêm thiết bị</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng thiết bị</p>
                <p className="text-2xl font-bold">
                  {devicesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : filteredDevices.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Trực tuyến</p>
                <p className="text-2xl font-bold">
                  {devicesLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    filteredDevices.filter((d) => d.status === "online").length
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Link className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Đã liên kết bàn</p>
                <p className="text-2xl font-bold">
                  {devicesLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    filteredDevices.filter((d) => d.tableId).length
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng tin nhắn</p>
                <p className="text-2xl font-bold">
                  {devicesLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    filteredDevices.reduce((sum, d) => sum + d.messages.length, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device) => (
          <Card key={device.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    <CardDescription className="font-mono">{device.code}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setCurrentDevice(device)
                        setIsMessagesDialogOpen(true)
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Quản lý tin nhắn ({device.messages.length})
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setCurrentDevice(device)
                        setIsLinkDialogOpen(true)
                      }}
                    >
                      {device.tableId ? <Unlink className="h-4 w-4 mr-2" /> : <Link className="h-4 w-4 mr-2" />}
                      {device.tableId ? "Hủy liên kết" : "Liên kết bàn"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setCurrentDevice(device)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setCurrentDevice(device)
                        setIsDeleteDialogOpen(true)
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trạng thái:</span>
                  <Badge variant="outline" className={getStatusColor(device.status)}>
                    {getStatusText(device.status)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gateway:</span>
                  <span className="text-sm">{device.gatewayName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bàn:</span>
                  <span className="text-sm">{device.tableNumber ? `Bàn ${device.tableNumber}` : "Chưa liên kết"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pin:</span>
                  <div className="flex items-center space-x-1">
                    <Battery className={`h-4 w-4 ${getBatteryColor(device.batteryLevel)}`} />
                    <span className={`text-sm font-medium ${getBatteryColor(device.batteryLevel)}`}>
                      {device.batteryLevel}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tin nhắn:</span>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">{device.messages.length}</span>
                    <span className="text-xs text-gray-500">
                      ({device.messages.filter((m) => m.isActive).length} hoạt động)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lần cuối:</span>
                  <span className="text-sm">{device.lastSeen}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Messages Management Dialog */}
      <Dialog open={isMessagesDialogOpen} onOpenChange={setIsMessagesDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quản lý tin nhắn - {currentDevice?.name}</DialogTitle>
            <DialogDescription>Quản lý các tin nhắn cho thiết bị {currentDevice?.code}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="messages" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="messages">Danh sách tin nhắn</TabsTrigger>
              <TabsTrigger value="add">Thêm tin nhắn mới</TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="space-y-4">
              {currentDevice?.messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Chưa có tin nhắn nào</h3>
                  <p className="text-gray-500 mb-4">Thêm tin nhắn đầu tiên cho thiết bị này</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentDevice?.messages.map((message) => (
                    <Card key={message.id} className={`${!message.isActive ? "opacity-50" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className={getMessageTypeColor(message.type)}>
                                {getMessageTypeText(message.type)}
                              </Badge>
                              <Badge variant={message.isActive ? "default" : "secondary"}>
                                {message.isActive ? "Hoạt động" : "Tạm dừng"}
                              </Badge>
                            </div>
                            <p className="text-sm mb-2">{message.content}</p>
                            <p className="text-xs text-gray-500">
                              Tạo lúc: {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigator.clipboard.writeText(message.content)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={message.isActive ? "secondary" : "default"}
                              onClick={() => handleToggleMessage(message.id)}
                            >
                              {message.isActive ? "Tạm dừng" : "Kích hoạt"}
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteMessage(message.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="add" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="messageType">Loại tin nhắn</Label>
                  <Select
                    value={newMessage.type}
                    onValueChange={(value: "greeting" | "reminder" | "promotion" | "farewell" | "custom") =>
                      setNewMessage({ ...newMessage, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="greeting">Chào hỏi</SelectItem>
                      <SelectItem value="reminder">Nhắc nhở</SelectItem>
                      <SelectItem value="promotion">Khuyến mãi</SelectItem>
                      <SelectItem value="farewell">Tạm biệt</SelectItem>
                      <SelectItem value="custom">Tùy chỉnh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messageContent">Nội dung tin nhắn</Label>
                  <Textarea
                    id="messageContent"
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                    placeholder="Nhập nội dung tin nhắn..."
                    rows={4}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="messageActive"
                    checked={newMessage.isActive}
                    onChange={(e) => setNewMessage({ ...newMessage, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="messageActive">Kích hoạt ngay</Label>
                </div>
                <Button onClick={handleAddMessage} disabled={!newMessage.content.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm tin nhắn
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessagesDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thiết bị</DialogTitle>
            <DialogDescription>Cập nhật thông tin thiết bị</DialogDescription>
          </DialogHeader>
          {currentDevice && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-code" className="text-right">
                  Mã thiết bị
                </Label>
                <Input
                  id="edit-code"
                  value={currentDevice.code}
                  onChange={(e) => setCurrentDevice({ ...currentDevice, code: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Tên thiết bị
                </Label>
                <Input
                  id="edit-name"
                  value={currentDevice.name}
                  onChange={(e) => setCurrentDevice({ ...currentDevice, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-gateway" className="text-right">
                  Gateway
                </Label>
                <Select
                  value={currentDevice.gatewayId}
                  onValueChange={(value) => setCurrentDevice({ ...currentDevice, gatewayId: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gateways
                      .filter((gateway) => gateway.shopId === currentDevice.shopId)
                      .map((gateway) => (
                        <SelectItem key={gateway.id} value={gateway.id}>
                          {gateway.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditDevice}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Liên kết thiết bị với bàn</DialogTitle>
            <DialogDescription>Chọn bàn để liên kết với thiết bị "{currentDevice?.name}"</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select
              value={currentDevice?.tableId || "__not_linked__"}
              onValueChange={(value) => handleLinkToTable(value === "__not_linked__" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn bàn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__not_linked__">Không liên kết</SelectItem>
                {availableTables.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    Bàn {table.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thiết bị "{currentDevice?.name}"? Hành động này không thể hoàn tác và sẽ xóa tất
              cả tin nhắn liên quan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteDevice}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
