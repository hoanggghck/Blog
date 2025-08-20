
import { UserType } from "@/types/user";
import { apiService } from "@/lib/api-service";

export const userApiServer = {
  getInfo: async () => await apiService.get<UserType>('/user/info')
}
