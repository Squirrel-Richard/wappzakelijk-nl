import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { OrganicBackground } from '@/components/OrganicBackground'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <OrganicBackground />
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
