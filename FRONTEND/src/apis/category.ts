import { ApiResponseCreatedType } from "@/types/common"
import { apiService } from "@/lib/api-service"
import { CategoryFormType, CategoryType } from "@/types/category"

export const categoryApi = {
  getList: async () => await apiService.get<CategoryType[]>("/category"),
  getDetail: async (id: number) => await apiService.get<CategoryType>(`/category/${id}`),
  create: async (p: CategoryFormType) => await apiService.post<CategoryFormType, ApiResponseCreatedType>("/category", p),
  update: async (p: CategoryFormType, id: number) => await apiService.put<CategoryFormType, string>(`/category/${id}`, p),
  delete: async (id: number) => await apiService.delete<string>(`/category/${id}`),
}
