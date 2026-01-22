import type { UserType } from "@/types/user"
import type { ApiResponseListType } from "@/types/common"
import { apiServicePrivate } from "@/lib/base-api.private"

export const userApi = {
  getList: async (page = 1, limit = 10) => await apiServicePrivate.get<ApiResponseListType<UserType>>(`/user?page=${page}&limit=${limit}`)
}
