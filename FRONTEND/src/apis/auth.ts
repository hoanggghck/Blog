import { LoginType, LoginResponseType, RegisterType, GoogleLoginType } from "@/types/auth";
import { apiService } from "@/lib/api-service";

export const authApi = {
    login: async (p: LoginType) => await apiService.post<LoginType, LoginResponseType>('/login', p),
    loginGoogle: async (p: GoogleLoginType) => await apiService.post<GoogleLoginType, LoginResponseType>('/google-login', p),
    register: async (p: RegisterType) => await apiService.post<RegisterType, LoginResponseType>('/register', p),
    logout: async () => await apiService.get<any>('/logout'),
    refresh: async () => await apiService.get<LoginResponseType>('/refresh'),
}
