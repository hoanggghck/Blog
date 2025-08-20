import { LoginType, LoginResponseType } from "@/types/auth";
import { clientApiService } from "./client-service";

export const authApi = {
  login: async (p: LoginType) => await clientApiService.post<LoginType, LoginResponseType>('/login', p),
}