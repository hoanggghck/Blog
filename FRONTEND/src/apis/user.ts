import { UserType } from "@/types/user"
import { ApiResponseListType } from "@/types/common"
import { apiService } from "@/lib/api-service"

export const userApi = {
  getList: async (page = 1, limit = 10) => await apiService.get<ApiResponseListType<UserType>>(`/user?page=${page}&limit=${limit}`)
}
