import { userApi } from "@/apis/user";
import { UserType } from "@/types/user";

export const getUserInfoServer = async (): Promise<UserType> => {
  const { data } = await userApi.getInfo();
  return data.result;
}
