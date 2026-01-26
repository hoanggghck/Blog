import { userApi } from "@/apis/user";
import { ApiResponseListType } from "@/types/common";
import { UserType } from "@/types/user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const fetchUsers = async (page: number): Promise<ApiResponseListType<UserType>> => {
  const { data } = await userApi.getList({ params: { page }});
  if (data.result)
  return data.result;
  return {} as ApiResponseListType<UserType>;
};

export const useGetUsers = (page: number) => {
  return useQuery<ApiResponseListType<UserType>, Error>({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
    placeholderData: keepPreviousData, 
    staleTime: 5 * 60 * 1000,
  });
};
