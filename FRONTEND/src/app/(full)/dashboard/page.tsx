import Sidebar from "@/features/dashboard/Sidebar";
import UserTable from "@/features/dashboard/UserTable";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <UserTable />
      </main>
    </div>
  );
}
