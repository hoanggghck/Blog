// Core
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { setCookie } from "cookies-next";
//
import { authApi } from "@/apis/auth";
import { LoginType, RegisterType } from "@/types/auth";
import { apiService } from "@/lib/api-service";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useGoogleLogin } from "@react-oauth/google";

export function handleAuthSuccess(
  data: { accessToken: string; refreshToken: string }
) {
  const daySet = 24 * 7 * 60 * 60 * 1000; // 7 ngày

  const { accessToken, refreshToken } = data;
  if (accessToken && refreshToken) {
    setCookie("accessToken", accessToken, { maxAge: daySet, path: "/" });
    setCookie("refreshToken", refreshToken, { maxAge: daySet, path: "/" });
    apiService.setToken(accessToken, refreshToken);
  } else {
    toast.error("Token không hợp lệ");
  }
}

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (p: LoginType) => await authApi.login(p),
    onSuccess: async (res) => {
      const { data, status } = res;
      toast.success(data.message);
      handleAuthSuccess(data.result);
      router.push('/');
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: RegisterType) => await authApi.register(payload),
    onSuccess: async (res) => {
      const { data } = res;
      toast.success(data.message);
      handleAuthSuccess(data.result);
      router.push('/');
    },
    onError: (err: any) => {
      toast.error(err.message || "Đăng ký thất bại");
    },
  });
}

export function useAuthGoogle() {
  const router = useRouter();

  return useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("http://localhost:3088/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: tokenResponse.access_token }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Google login thất bại");
        }
        handleAuthSuccess(data.result);
        router.push('/')
      } catch (err: any) {
        toast.error(err.message || "Đăng nhập Google thất bại");
      }
    },
    onError: () => toast.error("Login Google Failed"),
  });
}

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => await authApi.logout(),
    onSuccess: async (res) => {
      toast.success(res.data?.message);
      apiService.setToken('', '');
      router.push('/login');
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

}
