"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { TableIcon, MoreVertical, Plus, Edit, Trash2, Bell, Users, Clock, Smartphone, AlertCircle } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"

type TableItem = {
  id: string
  number: string
  details: string
  shopId: string
  shopName: string
  devices: {
    id: string
    code: string
  }[]
  status: "empty" | "occupied" | "reserved"
  lastReminder: string | null
}

export default function TablesPage() {
  const { addNotification } = useNotifications()
  const [shops, setShops] = useState([
    { id: "1", name: "Cà phê Khách Tui Vui" },
    { id: "2", name: "Nhà hàng Khách Vui" },
  ])
  const [selectedShop, setSelectedShop] = useState(shops[0].id)
  const [tables, setTables] = useState<TableItem[]>([
    {
      id: "1",
      number: "1",
      details: "Bàn 2 người",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      devices: [{ id: "1", code: "KTV-D001" }],
      status: "occupied",
      lastReminder: "10:30 AM",
    },
    {
      id: "2",
      number: "2",
      details: "Bàn 4 người",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      devices: [{ id: "2", code: "KTV-D002" }],
      status: "empty",
      lastReminder: null,
    },
    {
      id: "3",
      number: "3",
      details: "Bàn 6 người",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      devices: [{ id: "3", code: "KTV-D003" }],
      status: "occupied",
      lastReminder: null,
    },
    {
      id: "4",
      number: "4",
      details: "Bàn 2 người",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      devices: [{ id: "4", code: "KTV-D004" }],
      status: "empty",
      lastReminder: null,
    },
    {
      id: "5",
      number: "5",
      details: "Bàn 4 người",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      devices: [{ id: "5", code: "KTV-D005" }],
      status: "reserved",
      lastReminder: null,
    },
    {
      id: "6",
      number: "6",
      details: "Bàn 8 người",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      devices: [{ id: "6", code: "KTV-D006" }],
      status: "occupied",
      lastReminder: "11:15 AM",
    },
    {
      id: "7",
      number: "7",
      details: "Bàn 2 người",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      devices: [],
      status: "empty",
      lastReminder: null,
    },
    {
      id: "8",
      number: "8",
      details: "Bàn 4 người",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      devices: [{ id: "8", code: "KTV-D008" }],
      status: "occupied",
      lastReminder: null,
    },
    {
      id: "9",
      number: "9",
      details: "Bàn 2 người",
      shopId: "2",
      shopName: "Nhà hàng Khách Vui",
      devices: [{ id: "9", code: "KTV-D009" }],
      status: "occupied",
      lastReminder: null,
    },
    {
      id: "10",
      number: "10",
      details: "Bàn 6 người",
      shopId: "2",
      shopName: "Nhà hàng Khách Vui",
      devices: [{ id: "10", code: "KTV-D010" }],
      status: "empty",
      lastReminder: null,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false)
  const [currentTable, setCurrentTable] = useState<TableItem | null>(null)
  const [newTable, setNewTable] = useState<Omit<TableItem, "id" | "shopName" | "lastReminder">>({
    number: "",
    details: "",
    shopId: selectedShop,
    devices: [],
    status: "empty",
  })

  const [reminderTime, setReminderTime] = useState(5)
  const [reminderUnit, setReminderUnit] = useState<"seconds" | "minutes" | "hours">("minutes")

  const filteredTables = tables.filter((table) => table.shopId === selectedShop)
  const selectedShopName = shops.find((shop) => shop.id === selectedShop)?.name || ""

  const handleAddTable = () => {
    const table: TableItem = {
      id: Date.now().toString(),
      ...newTable,
      shopName: selectedShopName,
      lastReminder: null,
    }
    setTables([...tables, table])
    setNewTable({
      number: "",
      details: "",
      shopId: selectedShop,
      devices: [],
      status: "empty",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditTable = () => {
    if (!currentTable) return

    setTables(
      tables.map((table) =>
        table.id === currentTable.id
          ? {
              ...table,
              number: currentTable.number,
              details: currentTable.details,
              status: currentTable.status,
            }
          : table,
      ),
    )
    setIsEditDialogOpen(false)
  }

  const handleDeleteTable = () => {
    if (!currentTable) return
    setTables(tables.filter((table) => table.id !== currentTable.id))
    setIsDeleteDialogOpen(false)
  }

  const handleSendReminder = () => {
    if (!currentTable) return

    // Simulate sending reminder to device
    const now = new Date()
    const reminderText = `${reminderTime} ${reminderUnit === "seconds" ? "giây" : reminderUnit === "minutes" ? "phút" : "giờ"}`

    // Update table with last reminder time
    setTables(
      tables.map((table) =>
        table.id === currentTable.id ? { ...table, lastReminder: now.toLocaleTimeString() } : table,
      ),
    )

    // Add notification
    addNotification({
      title: "Nhắc nhở đã gửi",
      message: `Đã gửi nhắc nhở đến bàn ${currentTable.number} sau ${reminderText}`,
      type: "reminder",
      tableId: currentTable.id,
    })

    setIsReminderDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-red-100 text-red-800 border-red-200"
      case "reserved":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "empty":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "occupied":
        return "Có khách"
      case "reserved":
        return "Đã đặt"
      case "empty":
        return "Trống"
      default:
        return "Không xác định"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý bàn</h1>
          <p className="text-gray-600">Quản lý bàn và gửi nhắc nhở cho khách hàng</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedShop} onValueChange={setSelectedShop}>
            <SelectTrigger className="w-48">
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm bàn
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm bàn mới</DialogTitle>
                <DialogDescription>Thêm bàn mới cho cửa hàng {selectedShopName}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="number" className="text-right">
                    Số bàn
                  </Label>
                  <Input
                    id="number"
                    value={newTable.number}
                    onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                    className="col-span-3"
                    placeholder="VD: 1, A1, VIP1"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="details" className="text-right">
                    Mô tả
                  </Label>
                  <Input
                    id="details"
                    value={newTable.details}
                    onChange={(e) => setNewTable({ ...newTable, details: e.target.value })}
                    className="col-span-3"
                    placeholder="VD: Bàn 4 người, Bàn VIP"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Trạng thái
                  </Label>
                  <Select
                    value={newTable.status}
                    onValueChange={(value: "empty" | "occupied" | "reserved") =>
                      setNewTable({ ...newTable, status: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">Trống</SelectItem>
                      <SelectItem value="occupied">Có khách</SelectItem>
                      <SelectItem value="reserved">Đã đặt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddTable}>Thêm bàn</Button>
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
              <TableIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng bàn</p>
                <p className="text-2xl font-bold">{filteredTables.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Có khách</p>
                <p className="text-2xl font-bold">{filteredTables.filter((t) => t.status === "occupied").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Đã đặt</p>
                <p className="text-2xl font-bold">{filteredTables.filter((t) => t.status === "reserved").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Có thiết bị</p>
                <p className="text-2xl font-bold">{filteredTables.filter((t) => t.devices.length > 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Table Layout */}
      <Card>
        <CardHeader>
          <CardTitle>Sơ đồ bàn - {selectedShopName}</CardTitle>
          <CardDescription>Nhấp vào bàn để xem chi tiết hoặc gửi nhắc nhở</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {filteredTables.map((table) => (
              <div
                key={table.id}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(
                  table.status,
                )}`}
                onClick={() => {
                  setCurrentTable(table)
                  setIsReminderDialogOpen(true)
                }}
              >
                <div className="text-center">
                  <div className="text-lg font-bold mb-1">Bàn {table.number}</div>
                  <div className="text-xs text-gray-600 mb-2">{table.details}</div>
                  <Badge variant="outline" className="text-xs">
                    {getStatusText(table.status)}
                  </Badge>
                  {table.devices.length === 0 && (
                    <div className="absolute top-1 right-1">
                      <AlertCircle className="h-4 w-4 text-orange-500" title="Chưa có thiết bị" />
                    </div>
                  )}
                  {table.lastReminder && <div className="text-xs text-gray-500 mt-1">Nhắc: {table.lastReminder}</div>}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 left-1 h-6 w-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentTable(table)
                        setIsReminderDialogOpen(true)
                      }}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Gửi nhắc nhở
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentTable(table)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentTable(table)
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bàn</DialogTitle>
            <DialogDescription>Cập nhật thông tin bàn</DialogDescription>
          </DialogHeader>
          {currentTable && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-number" className="text-right">
                  Số bàn
                </Label>
                <Input
                  id="edit-number"
                  value={currentTable.number}
                  onChange={(e) => setCurrentTable({ ...currentTable, number: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-details" className="text-right">
                  Mô tả
                </Label>
                <Input
                  id="edit-details"
                  value={currentTable.details}
                  onChange={(e) => setCurrentTable({ ...currentTable, details: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Trạng thái
                </Label>
                <Select
                  value={currentTable.status}
                  onValueChange={(value: "empty" | "occupied" | "reserved") =>
                    setCurrentTable({ ...currentTable, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empty">Trống</SelectItem>
                    <SelectItem value="occupied">Có khách</SelectItem>
                    <SelectItem value="reserved">Đã đặt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditTable}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bàn "{currentTable?.number}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteTable}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gửi nhắc nhở</DialogTitle>
            <DialogDescription>
              Gửi nhắc nhở đến bàn {currentTable?.number} - {currentTable?.details}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminderTime" className="text-right">
                Thời gian nhắc nhở
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="reminderTime"
                  type="number"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(Number.parseInt(e.target.value) || 0)}
                  className="w-24"
                />
                <Select
                  value={reminderUnit}
                  onValueChange={(value: "seconds" | "minutes" | "hours") => setReminderUnit(value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Giây</SelectItem>
                    <SelectItem value="minutes">Phút</SelectItem>
                    <SelectItem value="hours">Giờ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {currentTable?.devices.length === 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-sm text-orange-700">
                    Bàn này chưa có thiết bị. Vui lòng liên kết thiết bị trước khi gửi nhắc nhở.
                  </span>
                </div>
              </div>
            )}
            {currentTable?.devices.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="text-sm text-blue-700">
                  <strong>Thiết bị liên kết:</strong>
                  <ul className="mt-1">
                    {currentTable.devices.map((device) => (
                      <li key={device.id}>• {device.code}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSendReminder} disabled={currentTable?.devices.length === 0}>
              <Bell className="h-4 w-4 mr-2" />
              Gửi nhắc nhở
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
