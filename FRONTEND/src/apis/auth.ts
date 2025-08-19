import { LoginType } from "@/types/auth";
import { apiService } from "./core";

export const authApi = {
  login: async (p: LoginType) => {
    await apiService.post('/login', p)
  },
  getStuff: async () => await apiService.get('https://mpb0a41ffe2e307a5c18.free.beeceptor.com/')
}