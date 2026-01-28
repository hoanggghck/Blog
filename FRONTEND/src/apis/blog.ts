import { AxiosRequestConfig } from "axios"

import type { BlogType, CategoryBlogType } from "@/types"
import type { ApiResponseCreatedType, ApiResponseListType } from "@/types/common"

import { apiServicePublic } from "@/lib/base-api.public"
import { apiServicePrivate } from "@/lib/base-api.private"
import { apiServicePrivateUploadFile } from "@/lib/base-api.private"

export const blogApi = {
  createBlog: async (p: FormData) => await apiServicePrivateUploadFile.post<FormData, ApiResponseCreatedType>('/blog', p),
  getList: async (p: AxiosRequestConfig<unknown> | undefined = {}) => await apiServicePublic.get<ApiResponseListType<BlogType>>('/blog', p),
  getFullList: async (p: AxiosRequestConfig<unknown> | undefined = {}) => await apiServicePrivate.get<ApiResponseListType<BlogType>>('/blog/full', p),
  getDetail: async (id: number) => await apiServicePublic.get<BlogType>(`/blog/${id}`),
  countCategory: async () => await apiServicePublic.get<CategoryBlogType[]>(`/blog/count-category`)
}
