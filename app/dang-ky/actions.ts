"use server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function registerUser(prevState: any, formData: FormData) {
  try {
    if (!formData) {
      return {
        success: false,
        error: "Không có dữ liệu đăng ký được gửi",
      }
    }

    const userData = {
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      business: formData.get("business")?.toString() || "",
      businessType: formData.get("businessType")?.toString() || "",
      password: formData.get("password")?.toString() || "",
      confirmPassword: formData.get("confirmPassword")?.toString() || "",
      notes: formData.get("notes")?.toString() || "",
      terms: formData.get("terms") === "on",
      newsletter: formData.get("newsletter") === "on",
    }

    // Validate required fields
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.phone ||
      !userData.business ||
      !userData.password
    ) {
      return {
        success: false,
        error: "Vui lòng điền đầy đủ thông tin bắt buộc",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      return {
        success: false,
        error: "Email không đúng định dạng",
      }
    }

    // Validate password length
    if (userData.password.length < 8) {
      return {
        success: false,
        error: "Mật khẩu phải có ít nhất 8 ký tự",
      }
    }

    // Validate password confirmation
    if (userData.password !== userData.confirmPassword) {
      return {
        success: false,
        error: "Mật khẩu xác nhận không khớp",
      }
    }

    // Check terms acceptance
    if (!userData.terms) {
      return {
        success: false,
        error: "Vui lòng đồng ý với điều khoản sử dụng",
      }
    }

    // Register with Supabase Auth using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email for demo purposes
      user_metadata: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        business: userData.business,
        business_type: userData.businessType,
      },
    })

    if (authError) {
      console.error("Registration error:", authError)
      if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
        return {
          success: false,
          error: "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.",
        }
      }
      return {
        success: false,
        error: "Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.",
      }
    }

    // Create user profile using admin client (bypasses RLS)
    if (authData.user?.id) {
      try {
        const { error: profileError } = await supabaseAdmin.from("user_profiles").insert([
          {
            user_id: authData.user.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            business_name: userData.business,
            business_type: userData.businessType,
            notes: userData.notes,
            newsletter_subscribed: userData.newsletter,
          },
        ])

        if (profileError) {
          console.error("Profile creation error:", profileError)
          // Even if profile creation fails, the user account was created successfully
          return {
            success: true,
            message: "Tài khoản đã được tạo thành công! Bạn có thể đăng nhập ngay.",
            data: authData.user,
          }
        }
      } catch (profileErr) {
        console.error("Profile creation exception:", profileErr)
        // Don't fail the registration if profile creation fails
      }
    }

    return {
      success: true,
      message: "Tài khoản đã được tạo thành công! Bạn có thể đăng nhập ngay.",
      data: authData.user,
    }
  } catch (error) {
    console.error("Registration submission error:", error)
    return {
      success: false,
      error: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    }
  }
}
