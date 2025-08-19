"use client"
import { authApi } from "@/apis/auth";
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
    const result = await authApi.login(loginData)
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <input
        type="text"
        value={loginData.username}
        onChange={(e) =>
          setLoginData((prev) => ({ ...prev, username: e.target.value }))
        }
        placeholder="UserName"
        className="border p-2 rounded w-full"
      />
      <input
        type="password"
        value={loginData.password}
        onChange={(e) =>
          setLoginData((prev) => ({ ...prev, password: e.target.value }))
        }
        placeholder="Password"
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Login
      </button>
    </form>
  );
}
