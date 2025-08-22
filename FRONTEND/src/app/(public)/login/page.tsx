"use client"
import { useState } from "react";
import { Github, Twitter, Mail, LogIn } from "lucide-react";

import { useLogin } from "@/hooks/auth/useLogin";
import { LoginType } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const [loginData, setLoginData] = useState<LoginType>({
    username: "",
    password: "",
  });
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <Card className="w-full max-w-md shadow-xl rounded-2xl px-4">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">B</span>
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Chào mừng trở lại</CardTitle>
                <p className="text-gray-500 text-sm mt-1">
                    Đăng nhập vào tài khoản của bạn để tiếp tục viết và đọc nội dung tuyệt vời
                </p>
            </div>

            <div>
                <Button variant="outline" className="w-full cursor-pointer">
                    <Mail className="w-4 h-4" /> Tiếp tục với Google
                </Button>
                <div className="flex flex-col sm:flex-row mt-4 gap-4">
                    <Button variant="outline" className="w-full sm:flex-1 cursor-pointer">
                        <Github className="w-4 h-4 mr-2" /> GitHub
                    </Button>
                    <Button variant="outline" className="w-full sm:flex-1 cursor-pointer">
                        <Twitter className="w-4 h-4 mr-2" /> Twitter
                    </Button>
                </div>

                <div className="flex items-center my-6">
                    <Separator className="flex-1" />
                    <span className="mx-3 text-xs text-gray-500">HOẶC TIẾP TỤC VỚI TÀI KHOẢN</span>
                    <Separator className="flex-1" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Tài khoản</Label>
                    <Input
                        placeholder="Nhập tài khoản của bạn"
                        type="text"
                        value={loginData.username}
                        onChange={(e: { target: { value: any; }; }) =>
                        setLoginData((prev) => ({ ...prev, username: e.target.value }))
                        }
                    />
                    </div>

                    <div className="grid gap-2">
                        <Label>Mật khẩu</Label>
                        <Input
                            placeholder="Nhập mật khẩu"
                            type="password"
                            value={loginData.password}
                            onChange={(e: { target: { value: any; }; }) =>
                            setLoginData((prev) => ({ ...prev, password: e.target.value }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-end">
                        <a href="#" className="text-sm text-purple-600 hover:underline">
                            Quên mật khẩu?
                        </a>
                    </div>

                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer">
                        <LogIn className="w-4 h-4 mr-2" /> Đăng nhập
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Không có tài khoản?{" "}
                    <a href="#" className="text-purple-600 hover:underline">
                    Đăng ký
                    </a>
                </p>
            </div>
        </Card>

        <p className="absolute bottom-4 text-xs text-gray-400">
            Bằng cách đăng nhập, bạn đồng ý với{" "}
            <a href="#" className="underline">Điều khoản dịch vụ</a> và{" "}
            <a href="#" className="underline">Chính sách bảo mật của chúng tôi</a>
        </p>
    </div>
  );
}
