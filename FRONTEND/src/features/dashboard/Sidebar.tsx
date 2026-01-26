"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/provider/sidebarProvider";
import { ActiveType, ListRenderType } from "@/types/sidebar";
import { Users, Folder, Tag, Newspaper } from "lucide-react";

const listRender: ListRenderType[] = [
  { label: "Người dùng", icon: <Users className="w-4 h-4" />, code: ActiveType.USER },
  { label: "Bài viết", icon: <Newspaper className="w-4 h-4" />, code: ActiveType.BLOG },
  { label: "Danh mục", icon: <Folder className="w-4 h-4" />, code: ActiveType.CATEGORY },
  { label: "Thẻ", icon: <Tag className="w-4 h-4" />, code: ActiveType.TAG },
]

const Sidebar = () => {
  const { active, setActive } = useSidebar();
  return (
    <aside className="w-64 border-r h-screen bg-white p-4">
      <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
      <nav className="space-y-2">
        {
          listRender.map((ele) => (
            <Button
              key={ele.label}
              size="lg"
              className={`${ele.code === active
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-700'
              } w-full flex justify-start items-center gap-2 rounded-md hover:bg-gray-700 hover:text-white`}
              onClick={() => setActive(ele.code)}
            >
              {ele.icon}
              <span>{ele.label}</span>
            </Button>
          ))
        }
      </nav>
    </aside>
  );
};

export default Sidebar;
