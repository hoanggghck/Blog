// Core
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { setCookie, deleteCookie } from "cookies-next";
//
import { authApi } from "@/apis/auth";
import { LoginType, RegisterType } from "@/types/auth";
import { apiService } from "@/lib/api-service";
import { useGoogleLogin } from "@react-oauth/google";
import { setAuthCookies } from "@/lib/set-cookies";


export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (p: LoginType) => await authApi.login(p),
    onSuccess: async (res) => {
      const { data, status } = res;
      toast.success(data.message);
      await setAuthCookies(data.result.accessToken, data.result.refreshToken);
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
      deleteCookie("accessToken", { path: "/" });
      deleteCookie("refreshToken", { path: "/" });
      apiService.setToken('', '');
      router.push('/login');
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

}
