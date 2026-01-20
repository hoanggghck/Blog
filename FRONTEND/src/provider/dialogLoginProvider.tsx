"use client";

import { ConfirmCallback, DialogContext } from "@/components/dialog/DialogContext";
import RequestLoginDialog from "@/components/dialog/DialogRequestLogin";
import { useRef, useState } from "react";

export default function DialogLoginProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const confirmRef = useRef<ConfirmCallback | undefined>(null);

  const openDialog = (callback: ConfirmCallback) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      confirmRef.current = undefined;
      callback();
      return;
    } else {
      confirmRef.current = callback;
      setIsOpen(true)
    }
  };

  const closeDialog = () => {
    confirmRef.current = undefined;
    setIsOpen(false);
  }

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <RequestLoginDialog isOpen={isOpen} onClose={closeDialog} />
    </DialogContext.Provider>
  );
}
