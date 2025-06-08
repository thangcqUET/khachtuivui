"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, Plus, Edit, Trash2, MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react"
import { useShops } from "@/hooks/use-database"
import { useAuth } from "@/hooks/useAuth"
import type { Shop } from "@/lib/database"

export default function DatabaseShopsPage() {
  const { user } = useAuth()
  const { shops, loading, error, createShop, updateShop, deleteShop } = useShops()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentShop, setCurrentShop] = useState<Shop | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newShop, setNewShop] = useState<Omit<Shop, "id" | "created_at" | "updated_at">>({
    user_id: user?.id || "",
    name: "",
    address: "",
    phone: "",
    email: "",
    reminder_time: 30,
    reminder_unit: "minutes",
  })

  const handleAddShop = async () => {
    if (!user) return

    try {
      setIsSubmitting(true)
      await createShop({
        ...newShop,
        user_id: user.id,
      })

      setNewShop({
        user_id: user.id,
        name: "",
        address: "",
        phone: "",
        email: "",
        reminder_time: 30,
        reminder_unit: "minutes",
      })
      setIsAddDialogOpen(false)
    } catch (err) {
      console.error("Error creating shop:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditShop = async () => {
    if (!currentShop) return

    try {
      setIsSubmitting(true)
      await updateShop(currentShop.id, {
        name: currentShop.name,
        address: currentShop.address,
        phone: currentShop.phone,
        email: currentShop.email,
        reminder_time: currentShop.reminder_time,
        reminder_unit: currentShop.reminder_unit,
      })
      setIsEditDialogOpen(false)
    } catch (err) {
      console.error("Error updating shop:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteShop = async () => {
    if (!currentShop) return

    try {
      setIsSubmitting(true)
      await deleteShop(currentShop.id)
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error("Error deleting shop:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải cửa hàng...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Lỗi: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Thử lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý cửa hàng (Database)</h1>
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
                    value={newShop.reminder_time}
                    onChange={(e) => setNewShop({ ...newShop, reminder_time: Number.parseInt(e.target.value) || 0 })}
                    className="w-24"
                  />
                  <Select
                    value={newShop.reminder_unit}
                    onValueChange={(value: "seconds" | "minutes" | "hours") =>
                      setNewShop({ ...newShop, reminder_unit: value })
                    }
                  >
                    <SelectTrigger className="w-32">
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddShop} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Thêm cửa hàng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {shops.length === 0 ? (
        <div className="text-center py-12">
          <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Chưa có cửa hàng nào</h3>
          <p className="text-gray-500 mb-4">Bắt đầu bằng cách thêm cửa hàng đầu tiên của bạn</p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm cửa hàng
          </Button>
        </div>
      ) : (
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
                        {shop.address || "Chưa có địa chỉ"}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2 text-sm">
                  {shop.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{shop.phone}</span>
                    </div>
                  )}
                  {shop.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{shop.email}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      Nhắc nhở sau {shop.reminder_time}{" "}
                      {shop.reminder_unit === "seconds" ? "giây" : shop.reminder_unit === "minutes" ? "phút" : "giờ"}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentShop(shop)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentShop(shop)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
                  value={currentShop.address || ""}
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
                  value={currentShop.phone || ""}
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
                  value={currentShop.email || ""}
                  onChange={(e) => setCurrentShop({ ...currentShop, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditShop} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Lưu thay đổi
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
              Bạn có chắc chắn muốn xóa cửa hàng "{currentShop?.name}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteShop} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
