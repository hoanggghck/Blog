export type ActiveType = 'user' | 'category' | 'tag';
export interface SidebarContextType {
  active: ActiveType;
  setActive: (value: ActiveType) => void;
};

export interface ListRenderType {
  label: string;
  icon: React.ReactNode;
  code: ActiveType;
}