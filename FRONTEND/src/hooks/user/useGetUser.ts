import { userApi } from "@/apis/user";
import { ApiResponseListType } from "@/types/common";
import { UserType } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

const fetchUsers = async (): Promise<ApiResponseListType<UserType>> => {
  const { data } = await userApi.getList();
  return data.result;
};

export function useUsers() {
  return useQuery<ApiResponseListType<UserType>, Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: "static",
    retry: false,
  });
}