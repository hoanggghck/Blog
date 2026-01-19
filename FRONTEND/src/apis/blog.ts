import { AxiosRequestConfig } from "axios"
//
import type { BlogType, CategoryBlogType } from "@/types"
import type { ApiResponseCreatedType } from "@/types/common"
import { apiServicePublic } from "@/lib/base-api.public"
import { apiServicePrivateUploadFile } from "@/lib/base-api.private"

export const blogApi = {
  createBlog: async (p: FormData) => await apiServicePrivateUploadFile.post<FormData, ApiResponseCreatedType>('/blog', p),
  getList: async (p: AxiosRequestConfig<unknown> | undefined = {}) => await apiServicePublic.get<BlogType[]>('/blog', p),
  getDetail: async (id: number) => await apiServicePublic.get<BlogType>(`/blog/${id}`),
  countCategory: async () => await apiServicePublic.get<CategoryBlogType[]>(`/blog/count-category`),
}
