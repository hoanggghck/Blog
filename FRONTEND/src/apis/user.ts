import { apiService } from "./core"
import type { UserType } from "@/types/user"
import type { ApiResponseListType } from "@/types/common"

export const userApi = {
  getList: async (page = 1, limit = 10) => await apiService.get<ApiResponseListType<UserType>>(`/user?page=${page}&limit=${limit}`)
}
