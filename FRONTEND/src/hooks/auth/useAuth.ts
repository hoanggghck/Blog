// Core
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
//
import { authApi } from "@/apis/auth";
import { LoginType, RegisterType } from "@/types/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { removeCookies, setCookies } from "@/lib/cookies";
import { HTTP_STATUS } from "@/const/httpStatus";
import { UserInfoType } from "@/types";


export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (p: LoginType) => await authApi.login(p),
    onSuccess: async (res) => {
    const { result, message } = res.data;
    toast.success(message ?? '');
    if (result) {
      const {accessToken, refreshToken} = result;
      await setCookies(accessToken, refreshToken);
      router.push('/')
    }
    },
    onError: (err: any) => {
    },
  });
}

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (payload: RegisterType) => await authApi.register(payload),
        onSuccess: async (res) => {
            const { result, message } = res.data;
            toast.success(message ?? '');
            if (result) {
                const {accessToken, refreshToken} = result;
                await setCookies(accessToken, refreshToken);
                router.push('/');
            }
        },
        onError: (err: any) => {
            const res = err.response
            toast.error(res.data.message || "Đăng ký thất bại");
        },
    });
}

export function useAuthGoogle() {
  const router = useRouter();

  return useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
        try {
            const {status, data} = await authApi.loginGoogle({accessToken: tokenResponse.access_token});
            if (status !== HTTP_STATUS.Created) {
                throw new Error(data.message || "Google login thất bại");
            }
            if (data.result) {
                const {accessToken, refreshToken} = data.result;
                await setCookies(accessToken, refreshToken);
                router.push('/');
            }
            
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
            removeCookies();
            toast.success(res.data?.message);
            router.push('/login');
        },
        onError: (err: any) => {
            toast.error(err.response.data.message ?? 'Logout thất bại');
        },
    });
}

export const useGetUser = () => {
  return useQuery<UserInfoType | null, Error>({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const { data, status } = await authApi.getInfo();
      if (status === HTTP_STATUS.Success) {
        return data.result;
      }
      return null;  
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,  
  });
}