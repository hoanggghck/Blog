'use client'
import { useSidebar } from "@/provider/sidebarProvider";
import UserTable from "./user/UserTable";
import CategoryTable from "./category/CategoryTable";
import TagTable from "./tag/TagTable";

export default function DashBoardContent() {
  const { active } = useSidebar();
  return (
    <div className="p-4">
      {{
        user: <UserTable />,
        category: <CategoryTable />,
        tag: <TagTable />,
      }[active]}
    </div>
  );
}