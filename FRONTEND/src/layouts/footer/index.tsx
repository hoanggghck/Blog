"use client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-10 ">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-12 container mx-auto max-w-[1440px] px-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-full flex items-center justify-center">
            <Image
              src={logo}
              alt="BlogTechnology Logo"
              width={32}
              height={32}
              className="rounded"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg text-purple-600">
              BlogTechnology
            </h2>
            <p className="text-sm text-gray-600">Học • Lập trình • Sáng tạo</p>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <h2 className="font-semibold mb-3">Đăng ký nhận tin</h2>
          <div className="flex gap-2">
            <Input type="email" placeholder="Nhập email của bạn" className="bg-white" />
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Đăng ký
            </Button>
          </div>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="text-center text-gray-500 text-sm pb-6 w-full">
        © 2025 BlogTechnology. Giữ mọi quyền.
      </div>
    </footer>
  );
}
