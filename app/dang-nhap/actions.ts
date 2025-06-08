"use server"

import { supabase } from "@/lib/supabase"

export async function loginUser(prevState: any, formData: FormData) {
  try {
    if (!formData) {
      return {
        success: false,
        error: "Không có dữ liệu đăng nhập được gửi",
      }
    }

    const email = formData.get("email")?.toString() || ""
    const password = formData.get("password")?.toString() || ""
    const remember = formData.get("remember") === "on"

    // Validate required fields
    if (!email || !password) {
      return {
        success: false,
        error: "Vui lòng nhập đầy đủ email và mật khẩu",
      }
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error)
      if (error.message.includes("Invalid login credentials")) {
        return {
          success: false,
          error: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
        }
      }
      return {
        success: false,
        error: "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.",
      }
    }

    return {
      success: true,
      message: "Đăng nhập thành công! Đang chuyển hướng...",
      data: data.user,
    }
  } catch (error) {
    console.error("Login submission error:", error)
    return {
      success: false,
      error: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    }
  }
}
