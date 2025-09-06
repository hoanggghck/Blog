import { userApi } from "@/apis/user";
import { ApiResponseListType } from "@/types/common";
import { UserType } from "@/types/user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const fetchUsers = async (page: number, limit: number): Promise<ApiResponseListType<UserType>> => {
  const { data } = await userApi.getList(page, limit);
  return data.result;
};

export const useGetUsers = (page: number, limit: number) => {
  return useQuery<ApiResponseListType<UserType>, Error>({
    queryKey: ["users", page, limit],
    queryFn: () => fetchUsers(page, limit),
    placeholderData: keepPreviousData, 
    staleTime: 1000 * 30,
    retry: false,
  });
};
