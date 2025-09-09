import { userApi } from "@/apis/user";
import { ApiResponseListType } from "@/types/common";
import { UserType } from "@/types/user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const fetchUsers = async (page: number, limit: number): Promise<ApiResponseListType<UserType>> => {
  const { data } = await userApi.getList(page, limit);
  if (data.result)
  return data.result;
  return {} as ApiResponseListType<UserType>;
};

export const useGetUsers = (page: number, limit: number) => {
  return useQuery<ApiResponseListType<UserType>, Error>({
    queryKey: ["users", page, limit],
    queryFn: () => fetchUsers(page, limit),
    placeholderData: keepPreviousData, 
    staleTime: 0,
    retry: false,
  });
};
