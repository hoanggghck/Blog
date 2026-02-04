import { AxiosRequestConfig } from "axios"
import { apiServicePublic } from "@/lib/base-api.public"
import { apiServicePrivateUploadFile } from "@/lib/base-api.private"
// Type
import type { BlogType, CategoryBlogType } from "@/types"
import type { ApiResponseCreatedType, ApiResponseListType } from "@/types/common"

export const blogApi = {
  createBlog: async (p: FormData) => await apiServicePrivateUploadFile.post<FormData, ApiResponseCreatedType>('/blog', p),
  getList: async (p: AxiosRequestConfig<unknown> | undefined = {}) => await apiServicePublic.get<ApiResponseListType<BlogType>>('/blog', p),
  getDetail: async (id: number) => await apiServicePublic.get<BlogType>(`/blog/${id}`),
  countCategory: async () => await apiServicePublic.get<CategoryBlogType[]>(`/blog/count-category`),
}
