import { DASHBOARD_SIDEBAR } from "@/const/enum";

export interface SidebarContextType {
  active: DASHBOARD_SIDEBAR;
  setActive: (value: DASHBOARD_SIDEBAR) => void;
};

export interface ListRenderType {
  label: string;
  icon: React.ReactNode;
  code: DASHBOARD_SIDEBAR;
}