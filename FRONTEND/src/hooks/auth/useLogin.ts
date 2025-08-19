// src/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/apis/auth";
import { LoginType } from "@/types/auth";

export function useLogin() {
  // return useMutation({
  //   mutationFn: async (p: LoginType) => await authApi.login(p),
  //   onSuccess: (data) => {
  //     console.log("✅ Login success:", data);
  //   },
  //   onError: (err: any) => {
  //     console.error("❌ Login failed:", err.message);
  //   },
  // });
}