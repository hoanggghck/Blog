import { apiServicePrivate } from "@/lib/base-api.private"
import { apiServicePublic } from "@/lib/base-api.public"
import type { ApiResponseCreatedType } from "@/types/common"

export const reactionApi = {
  createReaction: async (id: number) => await apiServicePrivate.post<string, ApiResponseCreatedType>(`/blogs/${id}/reactions`),
  removeReaction: async (id: number) => await apiServicePrivate.delete<string, ApiResponseCreatedType>(`/blogs/${id}/reactions`),
  getReaction: async (id: number) => await apiServicePrivate.get<boolean>(`/blogs/${id}/reactions`),
  hasReaction: async (id: number) => await apiServicePrivate.get<boolean>(`/blogs/${id}/reactions/has-reaction`),
  getReactions: async (id: number) => await apiServicePublic.get<number>(`/blogs/${id}/reactions/count`),
}
