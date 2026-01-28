export enum DASHBOARD_SIDEBAR {
  USER = 1,
  BLOG = 2,
  TAG = 3,
  CATEGORY = 4,
};
export interface SidebarContextType {
  active: DASHBOARD_SIDEBAR;
  setActive: (value: DASHBOARD_SIDEBAR) => void;
};

export interface ListRenderType {
  label: string;
  icon: React.ReactNode;
  code: DASHBOARD_SIDEBAR;
}