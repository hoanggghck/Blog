import { apiService } from "@/lib/api-service"
import { ApiResponseCreatedType } from "@/types/common"
import { TagFormType, TagType } from "@/types/tag"

export const tagApi = {
  getList: async () => await apiService.get<TagType[]>("/tag"),
  getDetail: async (id: number) => await apiService.get<TagType>(`/tag/${id}`),
  create: async (p: TagFormType) => await apiService.post<TagFormType, ApiResponseCreatedType>("/tag", p),
  update: async (p: TagFormType, id: number) => await apiService.put<TagFormType, string>(`/tag/${id}`, p),
  delete: async (id: number) => await apiService.delete<string>(`/tag/${id}`),
}
