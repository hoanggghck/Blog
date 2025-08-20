
import { UserType } from "@/types/user";
import { serverApiService } from "./server-service";

export const userApiServer = {
  getInfo: async () => await serverApiService.get<UserType>('/user/info')
}