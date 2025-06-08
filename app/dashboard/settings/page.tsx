"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Shield, Database, Volume2, Moon, Sun, Save, Download, Upload, Trash2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    // General Settings
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "dd/mm/yyyy",
    theme: "light",

    // Notification Settings
    enableNotifications: true,
    enableSounds: true,
    notificationVolume: 80,
    emailNotifications: true,
    smsNotifications: false,

    // Reminder Settings
    defaultReminderTime: 30,
    defaultReminderUnit: "minutes",
    autoReminders: true,
    reminderMessages: [
      "Xin chào! Bạn đã ngồi khá lâu rồi, có muốn gọi thêm gì không?",
      "Chúng tôi có món mới hôm nay, bạn có muốn thử không?",
      "Cảm ơn bạn đã ghé thăm! Hẹn gặp lại lần sau.",
    ],

    // System Settings
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: 90,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordExpiry: 90,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSaveSettings = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Show success message
  }

  const handleExportData = () => {
    // Simulate data export
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      user: user?.email,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "khach-tui-vui-settings.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.settings) {
            setSettings(data.settings)
          }
        } catch (error) {
          console.error("Error importing settings:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cài đặt hệ thống</h1>
          <p className="text-gray-600">Quản lý cài đặt và tùy chỉnh hệ thống</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Đang lưu..." : "Lưu cài đặt"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="reminders">Nhắc nhở</TabsTrigger>
          <TabsTrigger value="system">Hệ thống</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Cài đặt chung</span>
              </CardTitle>
              <CardDescription>Cấu hình cơ bản của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Ngôn ngữ</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</SelectItem>
                      <SelectItem value="Asia/Bangkok">Bangkok (GMT+7)</SelectItem>
                      <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Định dạng ngày</Label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Giao diện</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center space-x-2">
                          <Sun className="h-4 w-4" />
                          <span>Sáng</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center space-x-2">
                          <Moon className="h-4 w-4" />
                          <span>Tối</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Cài đặt thông báo</span>
              </CardTitle>
              <CardDescription>Quản lý thông báo và âm thanh</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bật thông báo</Label>
                  <p className="text-sm text-gray-500">Nhận thông báo từ hệ thống</p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Âm thanh thông báo</Label>
                  <p className="text-sm text-gray-500">Phát âm thanh khi có thông báo</p>
                </div>
                <Switch
                  checked={settings.enableSounds}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableSounds: checked })}
                />
              </div>
              {settings.enableSounds && (
                <div className="space-y-2">
                  <Label>Âm lượng thông báo: {settings.notificationVolume}%</Label>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.notificationVolume}
                      onChange={(e) =>
                        setSettings({ ...settings, notificationVolume: Number.parseInt(e.target.value) })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo email</Label>
                  <p className="text-sm text-gray-500">Gửi thông báo qua email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo SMS</Label>
                  <p className="text-sm text-gray-500">Gửi thông báo qua SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Cài đặt nhắc nhở</span>
              </CardTitle>
              <CardDescription>Cấu hình nhắc nhở tự động</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nhắc nhở tự động</Label>
                  <p className="text-sm text-gray-500">Tự động gửi nhắc nhở theo thời gian cài đặt</p>
                </div>
                <Switch
                  checked={settings.autoReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoReminders: checked })}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Thời gian nhắc nhở mặc định</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={settings.defaultReminderTime}
                    onChange={(e) =>
                      setSettings({ ...settings, defaultReminderTime: Number.parseInt(e.target.value) || 0 })
                    }
                    className="w-24"
                  />
                  <Select
                    value={settings.defaultReminderUnit}
                    onValueChange={(value: "seconds" | "minutes" | "hours") =>
                      setSettings({ ...settings, defaultReminderUnit: value })
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
              <Separator />
              <div className="space-y-2">
                <Label>Tin nhắn nhắc nhở</Label>
                <p className="text-sm text-gray-500">Các tin nhắn mẫu để gửi nhắc nhở</p>
                <div className="space-y-2">
                  {settings.reminderMessages.map((message, index) => (
                    <div key={index} className="flex space-x-2">
                      <Textarea
                        value={message}
                        onChange={(e) => {
                          const newMessages = [...settings.reminderMessages]
                          newMessages[index] = e.target.value
                          setSettings({ ...settings, reminderMessages: newMessages })
                        }}
                        className="flex-1"
                        rows={2}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newMessages = settings.reminderMessages.filter((_, i) => i !== index)
                          setSettings({ ...settings, reminderMessages: newMessages })
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSettings({
                        ...settings,
                        reminderMessages: [...settings.reminderMessages, "Tin nhắn mới..."],
                      })
                    }}
                  >
                    Thêm tin nhắn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Cài đặt hệ thống</span>
              </CardTitle>
              <CardDescription>Sao lưu và quản lý dữ liệu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sao lưu tự động</Label>
                  <p className="text-sm text-gray-500">Tự động sao lưu dữ liệu định kỳ</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                />
              </div>
              {settings.autoBackup && (
                <div className="space-y-2">
                  <Label>Tần suất sao lưu</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Mỗi giờ</SelectItem>
                      <SelectItem value="daily">Hàng ngày</SelectItem>
                      <SelectItem value="weekly">Hàng tuần</SelectItem>
                      <SelectItem value="monthly">Hàng tháng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <Label>Thời gian lưu trữ dữ liệu (ngày)</Label>
                <Input
                  type="number"
                  value={settings.dataRetention}
                  onChange={(e) => setSettings({ ...settings, dataRetention: Number.parseInt(e.target.value) || 0 })}
                  className="w-32"
                />
                <p className="text-sm text-gray-500">Dữ liệu cũ hơn sẽ được xóa tự động</p>
              </div>
              <Separator />
              <div className="space-y-4">
                <Label>Xuất/Nhập dữ liệu</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Xuất cài đặt
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Nhập cài đặt
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Cài đặt bảo mật</span>
              </CardTitle>
              <CardDescription>Quản lý bảo mật tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Xác thực hai yếu tố</Label>
                  <p className="text-sm text-gray-500">Tăng cường bảo mật với xác thực 2FA</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Thời gian hết hạn phiên (phút)</Label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: Number.parseInt(e.target.value) || 0 })}
                  className="w-32"
                />
                <p className="text-sm text-gray-500">Tự động đăng xuất sau thời gian không hoạt động</p>
              </div>
              <div className="space-y-2">
                <Label>Thời gian hết hạn mật khẩu (ngày)</Label>
                <Input
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => setSettings({ ...settings, passwordExpiry: Number.parseInt(e.target.value) || 0 })}
                  className="w-32"
                />
                <p className="text-sm text-gray-500">Yêu cầu đổi mật khẩu định kỳ</p>
              </div>
              <Separator />
              <div className="space-y-4">
                <Label>Thao tác bảo mật</Label>
                <div className="flex space-x-2">
                  <Button variant="outline">Đổi mật khẩu</Button>
                  <Button variant="outline">Xem nhật ký đăng nhập</Button>
                  <Button variant="outline">Đăng xuất tất cả thiết bị</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
