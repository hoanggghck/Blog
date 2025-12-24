import { apiService } from "@/lib/api-service"
import { ApiResponseCreatedType } from "@/types/common"

export const reactionApi = {
  createReaction: async (id: number) => await apiService.post<string, ApiResponseCreatedType>(`/blogs/${id}/reactions`),
  removeReaction: async (id: number) => await apiService.delete<string, ApiResponseCreatedType>(`/blogs/${id}/reactions`),
  getReaction: async (id: number) => await apiService.get<boolean>(`/blogs/${id}/reactions`),
  hasReaction: async (id: number) => await apiService.get<boolean>(`/blogs/${id}/reactions/has-reaction`),
  getReactions: async (id: number) => await apiService.get<number>(`/blogs/${id}/reactions/count`),
}
