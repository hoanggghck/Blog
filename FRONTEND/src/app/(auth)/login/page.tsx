"use client";
import { FcGoogle } from "react-icons/fc";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import logo from "@/assets/logo.png";
import { useAuthGoogle, useLogin } from "@/hooks/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  username: z.string().min(1, "Tài khoản không được để trống"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const loginMutation = useLogin();
  const googleLogin = useAuthGoogle();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-10">
      <Card className="w-full max-w-md shadow-xl rounded-2xl px-3 sm:px-5">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 p-2 rounded-full flex items-center justify-center">
              <Image
                src={logo}
                alt="BlogTechnology Logo"
                width={32}
                height={32}
                className="rounded"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Chào mừng trở lại
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">
            Đăng nhập vào tài khoản của bạn để tiếp tục viết và đọc nội dung
            tuyệt vời
          </p>
        </div>

        <div>
          {/* Google Login */}
          <Button
            variant="outline"
            className="w-full cursor-pointer mb-3"
            onClick={() => googleLogin()}
          >
            <FcGoogle className="w-4 h-4 mr-2" /> Tiếp tục với Google
          </Button>
          <div className="flex items-center my-6">
            <Separator className="flex-1" />
            <span className="mx-3 text-xs text-gray-500">
              HOẶC TIẾP TỤC VỚI TÀI KHOẢN
            </span>
            <Separator className="flex-1" />
          </div>

          {/* ✅ Form có validate */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Tài khoản</Label>
              <Input
                id="username"
                placeholder="Nhập tài khoản của bạn"
                type="text"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-xs">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                placeholder="Nhập mật khẩu"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <a href="#" className="text-sm text-purple-600 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer"
              disabled={isSubmitting}
            >
              <LogIn className="w-4 h-4 mr-2" />{" "}
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Không có tài khoản?{" "}
            <a href="/register" className="text-purple-600 hover:underline">
              Đăng ký
            </a>
          </p>
        </div>
        <p className="mt-5 text-xs text-gray-400">
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <a href="#" className="underline">
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a href="#" className="underline">
            Chính sách bảo mật của chúng tôi
          </a>
        </p>
      </Card>
    </div>
  );
}
