import { userApi } from "@/apis/user";
import { UserType } from "@/types/user";

export const getUserInfo = async (): Promise<UserType| null> => {
  try {
    const res = await userApi.getInfo();
    if (!res) return null;
    if (res.data?.result) return res.data.result;
    return {} as UserType;
  } catch (error) {
    return null
  }
}
