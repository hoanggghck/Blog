// Core
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { setCookie } from "cookies-next";
//
import { authApi } from "@/apis/auth";
import { LoginType, RegisterType } from "@/types/auth";
import { apiService } from "@/lib/api-service";

export  function useLogin() {
  const router = useRouter();
  const daySet = 24 * 7 * 60 * 60 * 1000;
  return useMutation({
    mutationFn: async (p: LoginType) => await authApi.login(p),
    onSuccess: async (res) => {
      const { data, status } = res;
      toast.success(data.message);
      const {accessToken, refreshToken} = data.result;
      if (accessToken && refreshToken) {
        setCookie("accessToken", data.result.accessToken, {
          maxAge: daySet,
          path: "/",
        });
        setCookie("refreshToken", data.result.refreshToken, {
          maxAge: daySet,
          path: "/",
        });
        apiService.setToken(data.result.accessToken, data.result.refreshToken);
        router.push('/');
      }
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });
}

export function useRegister() {
    const router = useRouter();
    const daySet = 24 * 7 * 60 * 60 * 1000;

    return useMutation({
      mutationFn: async (payload: RegisterType) => await authApi.register(payload),
      onSuccess: async (res) => {
        const { data } = res;
        toast.success(data.message);
        const {accessToken, refreshToken} = data.result;
        if (accessToken && refreshToken) {
          setCookie("accessToken", data.result.accessToken, {
            maxAge: daySet,
            path: "/",
          });
          setCookie("refreshToken", data.result.refreshToken, {
            maxAge: daySet,
            path: "/",
          });
          apiService.setToken(data.result.accessToken, data.result.refreshToken);
          router.push('/');
        }
      },
      onError: (err: any) => {
        toast.error(err.message || "Đăng ký thất bại");
      },
    });
  }
