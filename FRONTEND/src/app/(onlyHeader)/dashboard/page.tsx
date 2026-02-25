import DashBoardContentFeature from "@/features/dashboard/DashBoardContentFeature"
import SidebarFeature from "@/features/dashboard/SidebarFeature"
import { DashboardProvider } from "@/provider/dashboard-provider"

export default function Dashboard() {
  return (
    <DashboardProvider>
      <div className="flex bg-gray-50 h-full overflow-hidden">
        <SidebarFeature />
        <section className="flex-1 pt-10 h-full overflow-auto">
          <DashBoardContentFeature />
        </section>
      </div>
    </DashboardProvider>
  );
}
