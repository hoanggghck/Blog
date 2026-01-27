import type { ApiResponseCreatedType } from "@/types/common"
import type { TagFormType, TagType } from "@/types/tag"

import { apiServicePublic } from "@/lib/base-api.public"
import { apiServicePrivate } from "@/lib/base-api.private"

export const tagApi = {
  getList: async () => await apiServicePublic.get<TagType[]>("/tag"),
  getDetail: async (id: number) => await apiServicePrivate.get<TagType>(`/tag/${id}`),
  create: async (p: TagFormType) => await apiServicePrivate.post<TagFormType, ApiResponseCreatedType>("/tag", p),
  update: async (p: TagFormType, id: number) => await apiServicePrivate.put<TagFormType, string>(`/tag/${id}`, p),
  delete: async (id: number) => await apiServicePrivate.delete<string>(`/tag/${id}`),
}
