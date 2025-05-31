import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type FormSubmission = {
  id?: string
  name: string
  business: string
  phone: string
  email?: string
  message?: string
  created_at?: string
  updated_at?: string
}
