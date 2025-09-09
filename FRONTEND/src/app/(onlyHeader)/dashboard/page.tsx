import DashBoardContent from "@/features/dashboard/DashBoardContent";
import Sidebar from "@/features/dashboard/Sidebar";
import { SidebarProvider } from "@/provider/sidebarProvider";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <DashBoardContent />
        </main>
      </div>
    </SidebarProvider>
  );
}
