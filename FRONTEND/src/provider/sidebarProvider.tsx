"use client";
import { createContext, useContext, useState, ReactNode } from "react";

import { DASHBOARD_SIDEBAR, SidebarContextType } from "@/types/sidebar";

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<DASHBOARD_SIDEBAR>(DASHBOARD_SIDEBAR.USER);

  return (
    <SidebarContext.Provider value={{ active, setActive }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}