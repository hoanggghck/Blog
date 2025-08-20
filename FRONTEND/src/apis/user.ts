import { apiService } from "./core";
import { UserType } from "@/types/user";
import { ApiResponseListType } from "@/types/common";

export const userApi = {
  getList: async () => await apiService.get<ApiResponseListType<UserType>>('/user'),
  getInfo: async () => await apiService.get<UserType>('/user/info'),
}