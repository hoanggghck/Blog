'use client'
import UserTable from "./user/UserTable";
import CategoryTable from "./category/CategoryTable";
import BlogTable from "./blog/BLogTable";
import TagTable from "./tag/TagTable";
import { useSidebar } from "@/provider/sidebarProvider";
import { DASHBOARD_SIDEBAR } from "@/const/enum";

export default function DashBoardContent() {
  const { active } = useSidebar();
  return (
    <div className="p-4">
      {{
        [DASHBOARD_SIDEBAR.USER]: <UserTable />,
        [DASHBOARD_SIDEBAR.CATEGORY]: <CategoryTable />,
        [DASHBOARD_SIDEBAR.TAG]: <TagTable />,
        [DASHBOARD_SIDEBAR.BLOG]: <BlogTable />
      }[active]}
    </div>
  );
}