import { LoginType, LoginResponseType } from "@/types/auth";
import { apiService } from "./core";

export const authApi = {
  login: async (p: LoginType) => await apiService.post<LoginType, LoginResponseType>('/login', p),
}