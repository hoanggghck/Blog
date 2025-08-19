// Core
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';

// 
import { authApi } from "@/apis/auth";
import { LoginType } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (p: LoginType) => await authApi.login(p),
    onSuccess: (res) => {
      const { data, status } = res;
      toast.success(data.message);
      if (data.result.accessToken) localStorage.setItem("accessToken", data.result.accessToken);
      if (data.result.refreshToken) localStorage.setItem("refreshToken", data.result.refreshToken);
      router.push('/');
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });
}