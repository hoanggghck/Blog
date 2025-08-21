"use client"
import { useLogin } from "@/hooks/auth/useLogin";
import { LoginType } from "@/types/auth";
import { useState } from "react";

export default function Login() {
  const [loginData, setLoginData] = useState<LoginType>({
    username: '',
    password: ''
  });
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-900 rounded-2xl shadow-lg p-10 w-full max-w-sm border border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Super Blog</h2>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 mb-2">Tài khoản</label>
            <input
              type="text"
              placeholder="Nhập tài khoản"
              className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              value={loginData.username}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, username: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-gray-400 mt-5 text-sm">
          Chưa có tài khoản? <a href="#" className="text-red-400 hover:underline">Đăng ký</a>
        </p>
      </div>
    </div>
  );
}
