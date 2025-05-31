"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Store, MoreVertical, Plus, Edit, Trash2, MapPin, Phone, Mail, Clock } from "lucide-react"

type Shop = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  reminderTime: number
  reminderUnit: "seconds" | "minutes" | "hours"
  tables: number
  devices: number
  gateways: number
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([
    {
      id: "1",
      name: "Cà phê Khách Tui Vui",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      phone: "0901234567",
      email: "cafe@khachtuivui.com",
      reminderTime: 30,
      reminderUnit: "minutes",
      tables: 12,
      devices: 15,
      gateways: 2,
    },
    {
      id: "2",
      name: "Nhà hàng Khách Vui",
      address: "456 Lê Lợi, Quận 3, TP.HCM",
      phone: "0909876543",
      email: "restaurant@khachtuivui.com",
      reminderTime: 45,
      reminderUnit: "minutes",
      tables: 12,
      devices: 13,
      gateways: 1,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentShop, setCurrentShop] = useState<Shop | null>(null)
  const [newShop, setNewShop] = useState<Omit<Shop, "id" | "tables" | "devices" | "gateways">>({
    name: "",
    address: "",
    phone: "",
    email: "",
    reminderTime: 30,
    reminderUnit: "minutes",
  })

  const handleAddShop = () => {
    const shop: Shop = {
      id: Date.now().toString(),
      ...newShop,
      tables: 0,
      devices: 0,
      gateways: 0,
    }
    setShops([...shops, shop])
    setNewShop({
      name: "",
      address: "",
      phone: "",
      email: "",
      reminderTime: 30,
      reminderUnit: "minutes",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditShop = () => {
    if (!currentShop) return

    setShops(
      shops.map((shop) =>
        shop.id === currentShop.id
          ? {
              ...shop,
              name: currentShop.name,
              address: currentShop.address,
              phone: currentShop.phone,
              email: currentShop.email,
              reminderTime: currentShop.reminderTime,
              reminderUnit: currentShop.reminderUnit,
            }
          : shop,
      ),
    )
    setIsEditDialogOpen(false)
  }

  const handleDeleteShop = () => {
    if (!currentShop) return
    setShops(shops.filter((shop) => shop.id !== currentShop.id))
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý cửa hàng</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm cửa hàng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm cửa hàng mới</DialogTitle>
              <DialogDescription>Nhập thông tin cửa hàng của bạn</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên cửa hàng
                </Label>
                <Input
                  id="name"
                  value={newShop.name}
                  onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={newShop.address}
                  onChange={(e) => setNewShop({ ...newShop, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  value={newShop.phone}
                  onChange={(e) => setNewShop({ ...newShop, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newShop.email}
                  onChange={(e) => setNewShop({ ...newShop, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reminderTime" className="text-right">
                  Thời gian nhắc nhở
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="reminderTime"
                    type="number"
                    value={newShop.reminderTime}
                    onChange={(e) => setNewShop({ ...newShop, reminderTime: Number.parseInt(e.target.value) || 0 })}
                    className="w-24"
                  />
                  <select
                    value={newShop.reminderUnit}
                    onChange={(e) =>
                      setNewShop({
                        ...newShop,
                        reminderUnit: e.target.value as "seconds" | "minutes" | "hours",
                      })
                    }
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="seconds">Giây</option>
                    <option value="minutes">Phút</option>
                    <option value="hours">Giờ</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddShop}>Thêm cửa hàng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shops.map((shop) => (
          <Card key={shop.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Store className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>{shop.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {shop.address}
                    </CardDescription>
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
                        setCurrentShop(shop)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setCurrentShop(shop)
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
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{shop.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{shop.email}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    Nhắc nhở sau {shop.reminderTime}{" "}
                    {shop.reminderUnit === "seconds" ? "giây" : shop.reminderUnit === "minutes" ? "phút" : "giờ"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-blue-50 p-2 rounded-md text-center">
                  <div className="text-lg font-semibold text-blue-700">{shop.tables}</div>
                  <div className="text-xs text-blue-600">Bàn</div>
                </div>
                <div className="bg-green-50 p-2 rounded-md text-center">
                  <div className="text-lg font-semibold text-green-700">{shop.devices}</div>
                  <div className="text-xs text-green-600">Thiết bị</div>
                </div>
                <div className="bg-purple-50 p-2 rounded-md text-center">
                  <div className="text-lg font-semibold text-purple-700">{shop.gateways}</div>
                  <div className="text-xs text-purple-600">Gateway</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={`/dashboard/shops/${shop.id}`}>Xem chi tiết</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa cửa hàng</DialogTitle>
            <DialogDescription>Cập nhật thông tin cửa hàng</DialogDescription>
          </DialogHeader>
          {currentShop && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Tên cửa hàng
                </Label>
                <Input
                  id="edit-name"
                  value={currentShop.name}
                  onChange={(e) => setCurrentShop({ ...currentShop, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Địa chỉ
                </Label>
                <Input
                  id="edit-address"
                  value={currentShop.address}
                  onChange={(e) => setCurrentShop({ ...currentShop, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Số điện thoại
                </Label>
                <Input
                  id="edit-phone"
                  value={currentShop.phone}
                  onChange={(e) => setCurrentShop({ ...currentShop, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentShop.email}
                  onChange={(e) => setCurrentShop({ ...currentShop, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-reminderTime" className="text-right">
                  Thời gian nhắc nhở
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="edit-reminderTime"
                    type="number"
                    value={currentShop.reminderTime}
                    onChange={(e) =>
                      setCurrentShop({ ...currentShop, reminderTime: Number.parseInt(e.target.value) || 0 })
                    }
                    className="w-24"
                  />
                  <select
                    value={currentShop.reminderUnit}
                    onChange={(e) =>
                      setCurrentShop({
                        ...currentShop,
                        reminderUnit: e.target.value as "seconds" | "minutes" | "hours",
                      })
                    }
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="seconds">Giây</option>
                    <option value="minutes">Phút</option>
                    <option value="hours">Giờ</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditShop}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa cửa hàng "{currentShop?.name}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteShop}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
