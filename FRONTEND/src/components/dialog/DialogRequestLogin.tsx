"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

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
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Yêu cầu đăng nhập!
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Bạn cần đăng nhập để sử dụng tính năng này.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            onClick={onClose}
            variant={"outline"}
          >
            Đóng
          </Button>
          <Button
            variant={"primary"}
            onClick={handleLogin}
          >
            Đăng nhập
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
