export enum ActiveType {
  USER = 1,
  BLOG = 2,
  TAG = 3,
  CATEGORY = 4,
};
export interface SidebarContextType {
  active: ActiveType;
  setActive: (value: ActiveType) => void;
};

export interface ListRenderType {
  label: string;
  icon: React.ReactNode;
  code: ActiveType;
}