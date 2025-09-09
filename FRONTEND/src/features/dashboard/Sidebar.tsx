"use client";

import { useSidebar } from "@/provider/sidebarProvider";
import { ListRenderType } from "@/types/sidebar";
import { Users, Folder, Tag } from "lucide-react";

const listRender: ListRenderType[] = [
  { label: "Người dùng", icon: <Users className="w-4 h-4" />, code: 'user' },
  { label: "Danh mục", icon: <Folder className="w-4 h-4" />, code: 'category' },
  { label: "Thẻ", icon: <Tag className="w-4 h-4" />, code: 'tag' },
]

const Sidebar = () => {
  const { active, setActive } = useSidebar();
  return (
    <aside className="w-64 border-r bg-white p-4">
      <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
      <nav className="space-y-2">
        {
          listRender.map((ele) => (
            <button 
              key={ele.label} 
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 cursor-pointer"
              onClick={() => setActive(ele.code)}
            >
              {ele.icon} {ele.label}
            </button>
          ))
        }
      </nav>
    </aside>
  );
};

export default Sidebar;
