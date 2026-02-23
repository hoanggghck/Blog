import { apiServicePrivate } from "@/lib/base-api.private"
import { AxiosRequestConfig } from "axios"
// Type
import type { UserType } from "@/types/user"
import type { ApiResponseListType } from "@/types/common"

export const userApi = {
  getList: async (p: AxiosRequestConfig<unknown> | undefined = {}) => await apiServicePrivate.get<ApiResponseListType<UserType>>(`/user`, p)
}
