import { userApiServer } from "@/apis";
import { userApi } from "@/apis/user";
import { UserType } from "@/types/user";

export const getUserInfoServer = async (): Promise<UserType> => {
  const { data } = await userApi.getInfo();
  return data.result;
}

export async function getUserInfoFromServer() {
  try {
    const { data } = await userApiServer.getInfo();
    return data.result;
  } catch (error) {
  }
}