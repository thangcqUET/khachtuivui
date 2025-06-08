"use client"

import { useState, useEffect } from "react"
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
import { Wifi, MoreVertical, Plus, Edit, Trash2, Activity, AlertCircle, CheckCircle } from "lucide-react"
import { useGateways, useShops } from "@/hooks/use-database"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/hooks/use-toast"

type Gateway = {
  id: string
  name: string
  shopId: string
  shopName: string
  serverIp: string
  webServerPort: number
  webSocketPort: number
  status: "online" | "offline" | "error"
  connectedDevices: number
  lastSeen: string
  version: string
}

export default function GatewaysPage() {
  const { user } = useAuth()
  const { shops, loading: shopsLoading } = useShops()
  const [selectedShop, setSelectedShop] = useState("")
  const { gateways, loading: gatewaysLoading, createGateway, updateGateway, deleteGateway } = useGateways(selectedShop)

  // Set default shop when shops load
  useEffect(() => {
    if (shops.length > 0 && !selectedShop) {
      setSelectedShop(shops[0].id)
    }
  }, [shops, selectedShop])

  const [shopsLocal] = useState([
    { id: "1", name: "Cà phê Khách Tui Vui" },
    { id: "2", name: "Nhà hàng Khách Vui" },
  ])

  const [gatewaysLocal, setGateways] = useState<Gateway[]>([
    {
      id: "1",
      name: "Gateway Tầng 1",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      serverIp: "192.168.1.100",
      webServerPort: 8080,
      webSocketPort: 8081,
      status: "online",
      connectedDevices: 8,
      lastSeen: "2 phút trước",
      version: "v1.2.3",
    },
    {
      id: "2",
      name: "Gateway Tầng 2",
      shopId: "1",
      shopName: "Cà phê Khách Tui Vui",
      serverIp: "192.168.1.101",
      webServerPort: 8080,
      webSocketPort: 8081,
      status: "online",
      connectedDevices: 7,
      lastSeen: "1 phút trước",
      version: "v1.2.3",
    },
    {
      id: "3",
      name: "Gateway Chính",
      shopId: "2",
      shopName: "Nhà hàng Khách Vui",
      serverIp: "192.168.2.100",
      webServerPort: 8080,
      webSocketPort: 8081,
      status: "offline",
      connectedDevices: 0,
      lastSeen: "30 phút trước",
      version: "v1.2.1",
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentGateway, setCurrentGateway] = useState<Gateway | null>(null)
  const [newGateway, setNewGateway] = useState({
    name: "",
    shop_id: "",
    server_ip: "",
    web_server_port: 8080,
    websocket_port: 8081,
  })

  const handleAddGateway = async () => {
    try {
      await createGateway({
        ...newGateway,
        shop_id: newGateway.shop_id,
      })
      setNewGateway({
        name: "",
        shop_id: "",
        server_ip: "",
        web_server_port: 8080,
        websocket_port: 8081,
      })
      setIsAddDialogOpen(false)
      toast({
        title: "Thành công",
        description: "Đã thêm gateway mới",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm gateway",
        variant: "destructive",
      })
    }
  }

  const handleEditGateway = () => {
    if (!currentGateway) return

    setGateways(
      gatewaysLocal.map((gateway) =>
        gateway.id === currentGateway.id
          ? {
              ...gateway,
              name: currentGateway.name,
              serverIp: currentGateway.serverIp,
              webServerPort: currentGateway.webServerPort,
              webSocketPort: currentGateway.webSocketPort,
            }
          : gateway,
      ),
    )
    setIsEditDialogOpen(false)
  }

  const handleDeleteGateway = () => {
    if (!currentGateway) return
    setGateways(gatewaysLocal.filter((gateway) => gateway.id !== currentGateway.id))
    setIsDeleteDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 border-green-200"
      case "offline":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
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
      case "error":
        return "Lỗi"
      default:
        return "Không xác định"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "offline":
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Gateway</h1>
          <p className="text-gray-600">Quản lý các gateway kết nối thiết bị IoT</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm Gateway
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm Gateway mới</DialogTitle>
              <DialogDescription>Thêm gateway mới để kết nối thiết bị</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên Gateway
                </Label>
                <Input
                  id="name"
                  value={newGateway.name}
                  onChange={(e) => setNewGateway({ ...newGateway, name: e.target.value })}
                  className="col-span-3"
                  placeholder="VD: Gateway Tầng 1"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shop" className="text-right">
                  Cửa hàng
                </Label>
                <Select
                  value={newGateway.shop_id}
                  onValueChange={(value) => setNewGateway({ ...newGateway, shop_id: value })}
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
                <Label htmlFor="serverIp" className="text-right">
                  IP Server
                </Label>
                <Input
                  id="serverIp"
                  value={newGateway.server_ip}
                  onChange={(e) => setNewGateway({ ...newGateway, server_ip: e.target.value })}
                  className="col-span-3"
                  placeholder="192.168.1.100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="webServerPort" className="text-right">
                  Port Web Server
                </Label>
                <Input
                  id="webServerPort"
                  type="number"
                  value={newGateway.web_server_port}
                  onChange={(e) =>
                    setNewGateway({ ...newGateway, web_server_port: Number.parseInt(e.target.value) || 8080 })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="webSocketPort" className="text-right">
                  Port WebSocket
                </Label>
                <Input
                  id="webSocketPort"
                  type="number"
                  value={newGateway.websocket_port}
                  onChange={(e) =>
                    setNewGateway({ ...newGateway, websocket_port: Number.parseInt(e.target.value) || 8081 })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddGateway}>Thêm Gateway</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wifi className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Gateway</p>
                <p className="text-2xl font-bold">{gatewaysLocal.length}</p>
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
                <p className="text-2xl font-bold">{gatewaysLocal.filter((g) => g.status === "online").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Ngoại tuyến</p>
                <p className="text-2xl font-bold">{gatewaysLocal.filter((g) => g.status === "offline").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Thiết bị kết nối</p>
                <p className="text-2xl font-bold">{gatewaysLocal.reduce((sum, g) => sum + g.connectedDevices, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gateways List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gatewaysLocal.map((gateway) => (
          <Card key={gateway.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Wifi className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{gateway.name}</CardTitle>
                    <CardDescription>{gateway.shopName}</CardDescription>
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
                        setCurrentGateway(gateway)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setCurrentGateway(gateway)
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
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(gateway.status)}
                    <Badge variant="outline" className={getStatusColor(gateway.status)}>
                      {getStatusText(gateway.status)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">IP Server:</span>
                  <span className="text-sm font-mono">{gateway.serverIp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Port Web:</span>
                  <span className="text-sm font-mono">{gateway.webServerPort}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Port WebSocket:</span>
                  <span className="text-sm font-mono">{gateway.webSocketPort}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Thiết bị kết nối:</span>
                  <span className="text-sm font-semibold">{gateway.connectedDevices}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lần cuối:</span>
                  <span className="text-sm">{gateway.lastSeen}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phiên bản:</span>
                  <span className="text-sm font-mono">{gateway.version}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Gateway</DialogTitle>
            <DialogDescription>Cập nhật thông tin gateway</DialogDescription>
          </DialogHeader>
          {currentGateway && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Tên Gateway
                </Label>
                <Input
                  id="edit-name"
                  value={currentGateway.name}
                  onChange={(e) => setCurrentGateway({ ...currentGateway, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-serverIp" className="text-right">
                  IP Server
                </Label>
                <Input
                  id="edit-serverIp"
                  value={currentGateway.serverIp}
                  onChange={(e) => setCurrentGateway({ ...currentGateway, serverIp: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-webServerPort" className="text-right">
                  Port Web Server
                </Label>
                <Input
                  id="edit-webServerPort"
                  type="number"
                  value={currentGateway.webServerPort}
                  onChange={(e) =>
                    setCurrentGateway({ ...currentGateway, webServerPort: Number.parseInt(e.target.value) || 8080 })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-webSocketPort" className="text-right">
                  Port WebSocket
                </Label>
                <Input
                  id="edit-webSocketPort"
                  type="number"
                  value={currentGateway.webSocketPort}
                  onChange={(e) =>
                    setCurrentGateway({ ...currentGateway, webSocketPort: Number.parseInt(e.target.value) || 8081 })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditGateway}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa gateway "{currentGateway?.name}"? Hành động này không thể hoàn tác và sẽ ngắt
              kết nối tất cả thiết bị.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteGateway}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
