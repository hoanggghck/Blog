import { UserType } from "@/types/user";
import { ApiResponseListType } from "@/types/common";
import { clientApiService } from "./client-service";

export const userApi = {
  getList: async () => await clientApiService.get<ApiResponseListType<UserType>>('/user'),
  getInfo: async () => await clientApiService.get<UserType>('/user/info'),
}