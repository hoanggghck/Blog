import { apiService, apiServiceUploadFile } from "@/lib/api-service";
import { BlogType } from "@/types";
import { ApiResponseCreatedType } from "@/types/common";
import { AxiosRequestConfig } from "axios";

export const blogApi = {
    createBlog: async (p: FormData) => await apiServiceUploadFile.post<FormData, ApiResponseCreatedType>('/blog', p),
    getList: async (p: AxiosRequestConfig<unknown> | undefined = {}) => await apiService.get<BlogType[]>('/blog', p),
    getDetail: async (id: number) => await apiService.get<BlogType>(`/blog/${id}`),
};
