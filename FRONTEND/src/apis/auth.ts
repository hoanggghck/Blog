import { LoginType, LoginResponseType } from "@/types/auth";
import { apiService } from "@/lib/api-service";

export const authApi = {
  login: async (p: LoginType) => await apiService.post<LoginType, LoginResponseType>('/login', p),
}
