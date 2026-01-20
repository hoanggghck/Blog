"use client";

import { createContext, useContext } from "react";

export type ConfirmCallback = () => void | Promise<void>; 
type DialogContextType = {
  openDialog: (fn: ConfirmCallback) => void;
  closeDialog: () => void;
};

export const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used inside DialogProvider");
  return ctx;
};
