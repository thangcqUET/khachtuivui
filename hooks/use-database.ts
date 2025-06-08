"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./useAuth"
import {
  shopOperations,
  gatewayOperations,
  tableOperations,
  deviceOperations,
  messageOperations,
  type Shop,
  type Gateway,
  type Table,
  type Device,
  type DeviceMessage,
} from "@/lib/database"

export function useShops() {
  const { user } = useAuth()
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchShops = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await shopOperations.getAll(user.id)
      setShops(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch shops")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShops()
  }, [user])

  const createShop = async (shopData: Omit<Shop, "id" | "created_at" | "updated_at">) => {
    try {
      const newShop = await shopOperations.create(shopData)
      setShops((prev) => [newShop, ...prev])
      return newShop
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create shop")
    }
  }

  const updateShop = async (id: string, updates: Partial<Shop>) => {
    try {
      const updatedShop = await shopOperations.update(id, updates)
      setShops((prev) => prev.map((shop) => (shop.id === id ? updatedShop : shop)))
      return updatedShop
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update shop")
    }
  }

  const deleteShop = async (id: string) => {
    try {
      await shopOperations.delete(id)
      setShops((prev) => prev.filter((shop) => shop.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete shop")
    }
  }

  return {
    shops,
    loading,
    error,
    createShop,
    updateShop,
    deleteShop,
    refetch: fetchShops,
  }
}

export function useGateways(shopId: string) {
  const [gateways, setGateways] = useState<Gateway[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGateways = async () => {
    if (!shopId) return

    try {
      setLoading(true)
      const data = await gatewayOperations.getByShop(shopId)
      setGateways(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch gateways")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGateways()
  }, [shopId])

  const createGateway = async (gatewayData: Omit<Gateway, "id" | "created_at" | "updated_at">) => {
    try {
      const newGateway = await gatewayOperations.create(gatewayData)
      setGateways((prev) => [newGateway, ...prev])
      return newGateway
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create gateway")
    }
  }

  const updateGateway = async (id: string, updates: Partial<Gateway>) => {
    try {
      const updatedGateway = await gatewayOperations.update(id, updates)
      setGateways((prev) => prev.map((gateway) => (gateway.id === id ? updatedGateway : gateway)))
      return updatedGateway
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update gateway")
    }
  }

  const deleteGateway = async (id: string) => {
    try {
      await gatewayOperations.delete(id)
      setGateways((prev) => prev.filter((gateway) => gateway.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete gateway")
    }
  }

  return {
    gateways,
    loading,
    error,
    createGateway,
    updateGateway,
    deleteGateway,
    refetch: fetchGateways,
  }
}

export function useTables(shopId: string) {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTables = async () => {
    if (!shopId) return

    try {
      setLoading(true)
      const data = await tableOperations.getByShop(shopId)
      setTables(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tables")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [shopId])

  const createTable = async (tableData: Omit<Table, "id" | "created_at" | "updated_at">) => {
    try {
      const newTable = await tableOperations.create(tableData)
      setTables((prev) => [...prev, newTable])
      return newTable
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create table")
    }
  }

  const updateTable = async (id: string, updates: Partial<Table>) => {
    try {
      const updatedTable = await tableOperations.update(id, updates)
      setTables((prev) => prev.map((table) => (table.id === id ? updatedTable : table)))
      return updatedTable
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update table")
    }
  }

  const deleteTable = async (id: string) => {
    try {
      await tableOperations.delete(id)
      setTables((prev) => prev.filter((table) => table.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete table")
    }
  }

  return {
    tables,
    loading,
    error,
    createTable,
    updateTable,
    deleteTable,
    refetch: fetchTables,
  }
}

export function useDevices(shopId: string) {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDevices = async () => {
    if (!shopId) return

    try {
      setLoading(true)
      const data = await deviceOperations.getByShop(shopId)
      setDevices(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch devices")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [shopId])

  const createDevice = async (deviceData: Omit<Device, "id" | "created_at" | "updated_at">) => {
    try {
      const newDevice = await deviceOperations.create(deviceData)
      await fetchDevices() // Refetch to get joined data
      return newDevice
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create device")
    }
  }

  const updateDevice = async (id: string, updates: Partial<Device>) => {
    try {
      const updatedDevice = await deviceOperations.update(id, updates)
      await fetchDevices() // Refetch to get joined data
      return updatedDevice
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update device")
    }
  }

  const deleteDevice = async (id: string) => {
    try {
      await deviceOperations.delete(id)
      setDevices((prev) => prev.filter((device) => device.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete device")
    }
  }

  return {
    devices,
    loading,
    error,
    createDevice,
    updateDevice,
    deleteDevice,
    refetch: fetchDevices,
  }
}

export function useDeviceMessages(deviceId: string) {
  const [messages, setMessages] = useState<DeviceMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    if (!deviceId) return

    try {
      setLoading(true)
      const data = await messageOperations.getByDevice(deviceId)
      setMessages(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [deviceId])

  const createMessage = async (messageData: Omit<DeviceMessage, "id" | "created_at" | "updated_at">) => {
    try {
      const newMessage = await messageOperations.create(messageData)
      setMessages((prev) => [newMessage, ...prev])
      return newMessage
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create message")
    }
  }

  const updateMessage = async (id: string, updates: Partial<DeviceMessage>) => {
    try {
      const updatedMessage = await messageOperations.update(id, updates)
      setMessages((prev) => prev.map((message) => (message.id === id ? updatedMessage : message)))
      return updatedMessage
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update message")
    }
  }

  const deleteMessage = async (id: string) => {
    try {
      await messageOperations.delete(id)
      setMessages((prev) => prev.filter((message) => message.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete message")
    }
  }

  return {
    messages,
    loading,
    error,
    createMessage,
    updateMessage,
    deleteMessage,
    refetch: fetchMessages,
  }
}
