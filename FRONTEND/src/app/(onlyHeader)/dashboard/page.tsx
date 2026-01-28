import DashBoardContentFeature from "@/features/dashboard/DashBoardContentFeature"
import SidebarFeature from "@/features/dashboard/SidebarFeature"
import { DashboardProvider } from "@/provider/sidebarProvider"

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
        <SidebarFeature />
        <section className="flex-1 flex items-center justify-between">
          <DashBoardContentFeature />
        </section>
      </div>
    </DashboardProvider>
  );
}
