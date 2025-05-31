"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWebSocket } from "@/hooks/use-websocket"

export type Notification = {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "call" | "reminder" | "system"
  tableId?: string
  deviceId?: string
}

type NotificationsContextType = {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "time" | "read">) => void
  markAsRead: (id: string) => void
  clearNotifications: () => void
}

export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { lastMessage } = useWebSocket()

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data)
        if (data.type === "call" || data.type === "reminder") {
          addNotification({
            title: data.type === "call" ? "Khách gọi nhân viên" : "Nhắc nhở",
            message:
              data.message ||
              `Bàn ${data.tableNumber} ${data.type === "call" ? "đang gọi nhân viên" : "cần được nhắc nhở"}`,
            type: data.type,
            tableId: data.tableId,
            deviceId: data.deviceId,
          })
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }
  }, [lastMessage])

  const addNotification = (notification: Omit<Notification, "id" | "time" | "read">) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString(),
      read: false,
    }

    // Play sound for call notifications
    if (notification.type === "call") {
      const audio = new Audio("/sounds/notification.mp3")
      audio.play().catch((e) => console.error("Error playing notification sound:", e))
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, markAsRead, clearNotifications }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
