import { AxiosRequestConfig } from "axios"
//
import { apiService, apiServiceUploadFile } from "./core"
import type { BlogType, CategoryBlogType } from "@/types"
import type { ApiResponseCreatedType } from "@/types/common"

export const blogApi = {
  createBlog: async (p: FormData) => await apiServiceUploadFile.post<FormData, ApiResponseCreatedType>('/blog', p),
  getList: async (p: AxiosRequestConfig<unknown> | undefined = {}) => await apiService.get<BlogType[]>('/blog', p),
  getDetail: async (id: number) => await apiService.get<BlogType>(`/blog/${id}`),
  countCategory: async () => await apiService.get<CategoryBlogType[]>(`/blog/count-category`),
}
