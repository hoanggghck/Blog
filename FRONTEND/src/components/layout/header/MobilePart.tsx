"use client";
import Link from "next/link";
import { Menu, Search, PenSquare, LogOut } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import logo from "@/assets/logo.png";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function MobilePart({navItems = []}: {navItems: Record<string, string>[]}) {
  return (
    <div className="flex items-center justify-between gap-2 md:hidden px-2">
      <div className="flex items-center py-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-purple-600 p-1.5 rounded-full flex items-center justify-center">
            <Image
              src={logo}
              alt="BlogTechnology Logo"
              width={28}
              height={28}
              className="rounded"
            />
          </div>
          <span className="text-xl font-bold text-gray-800">
            BlogTechnology
          </span>
        </Link>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-74 p-0">
          <VisuallyHidden>
            <DialogTitle>Menu</DialogTitle>
            <p>Mobile navigation</p>
          </VisuallyHidden>
          <nav className="flex flex-col p-4 gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Search className="w-4 h-4" /> Tìm kiếm
            </Button>
            <div className="border-t my-3"></div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-purple-600"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t my-3"></div>
            <Button className="bg-purple-600 text-white flex items-center gap-2 hover:bg-purple-700">
              <PenSquare className="w-4 h-4" /> Viết bài
            </Button>
            <Button className="bg-purple-600 text-white flex items-center gap-2 hover:bg-purple-700">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
