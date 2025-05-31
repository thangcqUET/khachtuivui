import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { NotificationsProvider } from "@/components/dashboard/notifications-provider"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationsProvider>
        <div className="flex h-screen overflow-hidden">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      </NotificationsProvider>
    </div>
  )
}
