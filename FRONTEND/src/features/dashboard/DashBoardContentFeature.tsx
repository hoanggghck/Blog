'use client'
import UserTableFeature from "./user/UserTableFeature";
import CategoryTableFeature from "./category/CategoryTableFeature";
import BlogTableFeature from "./blog/BlogTableFeature";
import TagTableFeature from "./tag/TagTableFeature";
import { useDashboard } from "@/provider/dashboard-provider";
import { DASHBOARD_SIDEBAR } from "@/const/enum";

export default function DashBoardContentFeature() {
  const { active } = useDashboard();
  return (
    <div className="p-4">
      {{
        [DASHBOARD_SIDEBAR.USER]: <UserTableFeature />,
        [DASHBOARD_SIDEBAR.CATEGORY]: <CategoryTableFeature />,
        [DASHBOARD_SIDEBAR.TAG]: <TagTableFeature />,
        [DASHBOARD_SIDEBAR.BLOG]: <BlogTableFeature />
      }[active]}
    </div>
  );
}