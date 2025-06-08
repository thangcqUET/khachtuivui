import { supabase } from "./supabase"

// Database types based on our schema
export type Shop = {
  id: string
  user_id: string
  name: string
  address?: string
  phone?: string
  email?: string
  reminder_time: number
  reminder_unit: "seconds" | "minutes" | "hours"
  created_at: string
  updated_at: string
}

export type Gateway = {
  id: string
  shop_id: string
  name: string
  server_ip: string
  web_server_port: number
  websocket_port: number
  status: "online" | "offline" | "error"
  connected_devices: number
  last_seen?: string
  version: string
  created_at: string
  updated_at: string
}

export type Table = {
  id: string
  shop_id: string
  number: string
  details?: string
  status: "empty" | "occupied" | "reserved"
  last_reminder?: string
  created_at: string
  updated_at: string
}

export type Device = {
  id: string
  shop_id: string
  gateway_id: string
  table_id?: string
  code: string
  name: string
  status: "online" | "offline" | "low_battery"
  battery_level: number
  last_seen?: string
  version: string
  created_at: string
  updated_at: string
}

export type DeviceMessage = {
  id: string
  device_id: string
  content: string
  type: "greeting" | "reminder" | "promotion" | "farewell" | "custom"
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Reminder = {
  id: string
  table_id: string
  device_id: string
  scheduled_time: string
  sent_time?: string
  status: "scheduled" | "sent" | "failed" | "cancelled"
  message: string
  type: "auto" | "manual"
  created_at: string
  updated_at: string
}

// Shop operations
export const shopOperations = {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from("shops")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as Shop[]
  },

  async create(shop: Omit<Shop, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("shops").insert([shop]).select().single()

    if (error) throw error
    return data as Shop
  },

  async update(id: string, updates: Partial<Shop>) {
    const { data, error } = await supabase
      .from("shops")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Shop
  },

  async delete(id: string) {
    const { error } = await supabase.from("shops").delete().eq("id", id)

    if (error) throw error
  },
}

// Gateway operations
export const gatewayOperations = {
  async getByShop(shopId: string) {
    const { data, error } = await supabase
      .from("gateways")
      .select("*")
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as Gateway[]
  },

  async create(gateway: Omit<Gateway, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("gateways").insert([gateway]).select().single()

    if (error) throw error
    return data as Gateway
  },

  async update(id: string, updates: Partial<Gateway>) {
    const { data, error } = await supabase
      .from("gateways")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Gateway
  },

  async delete(id: string) {
    const { error } = await supabase.from("gateways").delete().eq("id", id)

    if (error) throw error
  },
}

// Table operations
export const tableOperations = {
  async getByShop(shopId: string) {
    const { data, error } = await supabase
      .from("tables")
      .select("*")
      .eq("shop_id", shopId)
      .order("number", { ascending: true })

    if (error) throw error
    return data as Table[]
  },

  async create(table: Omit<Table, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("tables").insert([table]).select().single()

    if (error) throw error
    return data as Table
  },

  async update(id: string, updates: Partial<Table>) {
    const { data, error } = await supabase
      .from("tables")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Table
  },

  async delete(id: string) {
    const { error } = await supabase.from("tables").delete().eq("id", id)

    if (error) throw error
  },
}

// Device operations
export const deviceOperations = {
  async getByShop(shopId: string) {
    const { data, error } = await supabase
      .from("devices")
      .select(`
        *,
        gateway:gateways(name),
        table:tables(number)
      `)
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async create(device: Omit<Device, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("devices").insert([device]).select().single()

    if (error) throw error
    return data as Device
  },

  async update(id: string, updates: Partial<Device>) {
    const { data, error } = await supabase
      .from("devices")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Device
  },

  async delete(id: string) {
    const { error } = await supabase.from("devices").delete().eq("id", id)

    if (error) throw error
  },
}

// Device message operations
export const messageOperations = {
  async getByDevice(deviceId: string) {
    const { data, error } = await supabase
      .from("device_messages")
      .select("*")
      .eq("device_id", deviceId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as DeviceMessage[]
  },

  async create(message: Omit<DeviceMessage, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("device_messages").insert([message]).select().single()

    if (error) throw error
    return data as DeviceMessage
  },

  async update(id: string, updates: Partial<DeviceMessage>) {
    const { data, error } = await supabase
      .from("device_messages")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as DeviceMessage
  },

  async delete(id: string) {
    const { error } = await supabase.from("device_messages").delete().eq("id", id)

    if (error) throw error
  },
}

// Reminder operations
export const reminderOperations = {
  async getByShop(shopId: string) {
    const { data, error } = await supabase
      .from("reminders")
      .select(`
        *,
        table:tables(number, shop_id),
        device:devices(code, name)
      `)
      .eq("table.shop_id", shopId)
      .order("scheduled_time", { ascending: false })

    if (error) throw error
    return data
  },

  async create(reminder: Omit<Reminder, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("reminders").insert([reminder]).select().single()

    if (error) throw error
    return data as Reminder
  },

  async update(id: string, updates: Partial<Reminder>) {
    const { data, error } = await supabase
      .from("reminders")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Reminder
  },

  async delete(id: string) {
    const { error } = await supabase.from("reminders").delete().eq("id", id)

    if (error) throw error
  },
}
