"use client";
import { Github, Twitter, Mail, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import logo from "@/assets/logo.png"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthGoogle, useRegister } from "@/hooks/auth/useAuth";

// schema validate
const registerSchema = z.object({
  username: z.string().min(1, "Tên tài khoản không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type RegisterType = z.infer<typeof registerSchema>;

export default function Register() {
    const registerMutation = useRegister();
    const googleLogin = useAuthGoogle();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterType>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterType) => {
        registerMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Card className="w-full max-w-md shadow-xl rounded-2xl px-4">
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
                    <CardTitle className="text-2xl font-bold">Tạo tài khoản mới</CardTitle>
                    <p className="text-gray-500 text-sm mt-1">
                        Đăng ký ngay để bắt đầu viết và đọc nội dung tuyệt vời
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
                {/* Username */}
                <div className="grid gap-2">
                    <Label>Tài khoản</Label>
                    <Input
                        placeholder="Nhập tên tài khoản"
                        type="text"
                        {...register("username")}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-xs">{errors.username.message}</p>
                    )}
                </div>

                {/* Email */}
                <div className="grid gap-2">
                    <Label>Email</Label>
                        <Input
                        placeholder="Nhập email của bạn"
                        type="email"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs">{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div className="grid gap-2">
                    <Label>Mật khẩu</Label>
                    <Input
                        placeholder="Nhập mật khẩu"
                        type="password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs">{errors.password.message}</p>
                    )}
                </div>

                {/* Nút submit */}
                <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer"
                >
                    <UserPlus className="w-4 h-4 mr-2" /> Đăng ký
                </Button>
                </form>

                {/* Social login thay thế "quên mật khẩu" */}
                <div className="flex items-center my-6">
                    <Separator className="flex-1" />
                        <span className="mx-3 text-xs text-gray-500">HOẶC ĐĂNG KÝ BẰNG</span>
                    <Separator className="flex-1" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="w-full sm:flex-1 cursor-pointer" onClick={() => googleLogin()}>
                        <Mail className="w-4 h-4 mr-2" /> Google
                    </Button>
                    <Button variant="outline" className="w-full sm:flex-1 cursor-pointer">
                        <Github className="w-4 h-4 mr-2" /> GitHub
                    </Button>
                    <Button variant="outline" className="w-full sm:flex-1 cursor-pointer">
                        <Twitter className="w-4 h-4 mr-2" /> Twitter
                    </Button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Đã có tài khoản?{" "}
                    <a href="/login" className="text-purple-600 hover:underline">
                        Đăng nhập
                    </a>
                </p>
            </Card>
        </div>
    );
}
