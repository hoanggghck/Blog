export type ActiveType = 'user' | 'category' | 'tag';
export type SidebarContextType = {
  active: ActiveType;
  setActive: (value: ActiveType) => void;
};

export type ListRenderType = {
  label: string;
  icon: React.ReactNode;
  code: ActiveType;
}