import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Khách tui vui - Giải pháp IoT giao tiếp khách hàng thông minh",
  description:
    "Trò chuyện với khách hàng của bạn cùng Khách tui vui. Lời nói chẳng mất tiền mua – Lựa lời mà nói cho vừa lòng nhau. Giải pháp IoT giúp doanh nghiệp giao tiếp tinh tế với khách hàng.",
  keywords: "IoT, giao tiếp khách hàng, tự động hóa, nhà hàng, quán cà phê, dịch vụ khách hàng, Việt Nam",
  authors: [{ name: "Khách tui vui Team" }],
  openGraph: {
    title: "Khách tui vui - Giải pháp IoT giao tiếp khách hàng thông minh",
    description:
      "Trò chuyện với khách hàng của bạn cùng Khách tui vui. Giải pháp IoT giúp doanh nghiệp giao tiếp tinh tế với khách hàng.",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khách tui vui - Giải pháp IoT giao tiếp khách hàng thông minh",
    description:
      "Trò chuyện với khách hàng của bạn cùng Khách tui vui. Giải pháp IoT giúp doanh nghiệp giao tiếp tinh tế với khách hàng.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
