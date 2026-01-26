'use client'
import { useSidebar } from "@/provider/sidebarProvider";
import UserTable from "./user/UserTable";
import CategoryTable from "./category/CategoryTable";
import BlogTable from "./blog/BLogTable";
import TagTable from "./tag/TagTable";
// Type
import { ActiveType } from "@/types/sidebar";

export default function DashBoardContent() {
  const { active } = useSidebar();
  return (
    <div className="p-4">
      {{
        [ActiveType.USER]: <UserTable />,
        [ActiveType.CATEGORY]: <CategoryTable />,
        [ActiveType.TAG]: <TagTable />,
        [ActiveType.BLOG]: <BlogTable />
      }[active]}
    </div>
  );
}