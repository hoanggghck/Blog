"use client";
import { Users, Folder, Tag, Newspaper } from "lucide-react";

import type { ListRenderType } from "@/types/sidebar";

import { Button } from "@/components/ui/button";
import { useDashboard } from "@/provider/dashboard-provider";
import { DASHBOARD_SIDEBAR } from "@/const/enum";

const listRender: ListRenderType[] = [
  { label: "Người dùng", icon: <Users className="w-4 h-4" />, code: DASHBOARD_SIDEBAR.USER },
  { label: "Bài viết", icon: <Newspaper className="w-4 h-4" />, code: DASHBOARD_SIDEBAR.BLOG },
  { label: "Danh mục", icon: <Folder className="w-4 h-4" />, code: DASHBOARD_SIDEBAR.CATEGORY },
  { label: "Thẻ", icon: <Tag className="w-4 h-4" />, code: DASHBOARD_SIDEBAR.TAG },
]

export default function SidebarFeature() {
  const { active, setActive } = useDashboard();
  return (
    <aside className="w-64 border-r h-screen bg-white p-4">
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
