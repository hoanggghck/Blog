import { AxiosRequestConfig } from "axios";

import { apiService, apiServiceUploadFile } from "@/lib/api-service";
import { BlogType, CategoryBlogType } from "@/types";
import { ApiResponseCreatedType } from "@/types/common";

export const reactionApi = {
  createReaction: async (id: number) => await apiService.post<string, ApiResponseCreatedType>(`/posts/${id}/reactions`),
  getReaction: async (id: number) => await apiService.get<boolean>(`/posts/${id}/reactions`),
  hasReaction: async (id: number) => await apiService.get<boolean>(`/posts/${id}/reactions/has-reaction`),
  getReactions: async (id: number) => await apiService.get<number>(`/posts/${id}/reactions/count`),
};
