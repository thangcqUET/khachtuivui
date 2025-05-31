"use server"

import { supabase } from "@/lib/supabase"
import type { FormSubmission } from "@/lib/supabase"

export async function submitForm(prevState: any, formData: FormData) {
  try {
    // Check if formData exists
    if (!formData) {
      return {
        success: false,
        error: "Không có dữ liệu form được gửi",
      }
    }

    const submission: Omit<FormSubmission, "id" | "created_at" | "updated_at"> = {
      name: formData.get("name")?.toString() || "",
      business: formData.get("business")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      message: formData.get("message")?.toString() || "",
    }

    // Validate required fields
    if (!submission.name || !submission.business || !submission.phone) {
      return {
        success: false,
        error: "Vui lòng điền đầy đủ thông tin bắt buộc",
      }
    }

    // Insert into Supabase
    const { data, error } = await supabase.from("form_submissions").insert([submission]).select()

    if (error) {
      console.error("Supabase error:", error)
      return {
        success: false,
        error: "Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại.",
      }
    }

    return {
      success: true,
      message: "Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
      data: data[0],
    }
  } catch (error) {
    console.error("Form submission error:", error)
    return {
      success: false,
      error: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    }
  }
}
