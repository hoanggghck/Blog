import type { ApiResponseCreatedType } from "@/types/common"
import type { CategoryFormType, CategoryType } from "@/types/category"
import { apiServicePublic } from "@/lib/base-api.public"
import { apiServicePrivate } from "@/lib/base-api.private"

export const categoryApi = {
  getList: async () => await apiServicePublic.get<CategoryType[]>("/category"),
  getDetail: async (id: number) => await apiServicePrivate.get<CategoryType>(`/category/${id}`),
  create: async (p: CategoryFormType) => await apiServicePrivate.post<CategoryFormType, ApiResponseCreatedType>("/category", p),
  update: async (p: CategoryFormType, id: number) => await apiServicePrivate.put<CategoryFormType, string>(`/category/${id}`, p),
  delete: async (id: number) => await apiServicePrivate.delete<string>(`/category/${id}`),
}
