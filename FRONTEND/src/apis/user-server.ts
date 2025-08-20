
import { UserType } from "@/types/user";
import { serverApiService } from "./core-server";

export const userApiServer = {
  getInfo: async () => await serverApiService.get<UserType>('/user/info')
}