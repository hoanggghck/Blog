import { UserType } from "@/types/user";
import { ApiResponseListType } from "@/types/common";
import { apiService } from "@/lib/api-service";

export const userApi = {
  getList: async () => await apiService.get<ApiResponseListType<UserType>>('/user'),
  getInfo: async () => await apiService.get<UserType>('/user/info'),
}
