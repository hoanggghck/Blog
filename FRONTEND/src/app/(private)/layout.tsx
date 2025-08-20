import { userApi, userApiServer } from "@/apis";
import { apiService } from "@/apis/core";
import { ApiResponseType } from "@/types/common";
import { UserType } from "@/types/user";
import { cookies } from "next/headers";

async function getUserInfoFromServer() {
  try {
    const { data } = await userApiServer.getInfo();
    return data.result;
  } catch (error) {
    console.log(error);
    
  }
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserInfoFromServer();
  console.log(user);
  
  
  return (
    <>
      {children}
    </>
  );
}