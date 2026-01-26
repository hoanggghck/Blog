import DashBoardContent from "@/features/dashboard/DashBoardContent"
import Sidebar from "@/features/dashboard/Sidebar"
import { SidebarProvider } from "@/provider/sidebarProvider"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
        <Sidebar />
        <section className="flex-1 flex items-center justify-between">
          <DashBoardContent />
        </section>
      </div>
    </SidebarProvider>
  );
}
