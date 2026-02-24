import DashBoardContentFeature from "@/features/dashboard/DashBoardContentFeature"
import SidebarFeature from "@/features/dashboard/SidebarFeature"
import { DashboardProvider } from "@/provider/dashboard-provider"

export default function Dashboard() {
  return (
    <DashboardProvider>
      <div className="flex bg-gray-50" style={{ minHeight: "max(calc(100vh - 64px), 500px)" }}>
        <SidebarFeature />
        <section className="flex-1 pt-10">
          <DashBoardContentFeature />
        </section>
      </div>
    </DashboardProvider>
  );
}
