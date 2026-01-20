"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

export default function RequestLoginDialog({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Yêu cầu đăng nhập!
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Bạn cần đăng nhập để sử dụng tính năng này.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm hover:bg-muted cursor-pointer"
          >
            Đóng
          </button>
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            onClick={handleLogin}
          >
            Đăng nhập
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
