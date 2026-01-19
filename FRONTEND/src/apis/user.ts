import type { UserType } from "@/types/user"
import type { ApiResponseListType } from "@/types/common"
import { apiServicePublic } from "@/lib/base-api.public"

export const userApi = {
  getList: async (page = 1, limit = 10) => await apiServicePublic.get<ApiResponseListType<UserType>>(`/user?page=${page}&limit=${limit}`)
}
