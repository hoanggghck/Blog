import { authApi } from "@/apis";
import { UserInfoType } from "@/types/user";

export const getUserInfo = async (): Promise<UserInfoType| null> => {
  try {
    const res = await authApi.getInfo();
    if (!res) return null;
    if (res.data?.result) return res.data.result;
    
    return {} as UserInfoType;
  } catch (error) {
    return null
  }
}
