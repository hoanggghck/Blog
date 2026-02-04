"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { RequestLoginDialog } from "@/components/dialog/DialogRequestLogin";

type ConfirmCallback = () => void | Promise<void>; 
type DialogContextType = {
  openDialog: (fn: ConfirmCallback) => void;
  closeDialog: () => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used inside DialogProvider");
  return ctx;
};

export default function DialogLoginProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const confirmRef = useRef<ConfirmCallback | null>(null);

  const openDialog = (callback: ConfirmCallback) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      confirmRef.current = null;
      callback();
      return;
    } else {
      confirmRef.current = callback;
      setIsOpen(true)
    }
  };

  const closeDialog = () => {
    confirmRef.current = null;
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) {
      confirmRef.current = null;
    }
  }, [isOpen])

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <RequestLoginDialog isOpen={isOpen} onClose={closeDialog} />
    </DialogContext.Provider>
  );
}
