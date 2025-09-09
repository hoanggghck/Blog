import { apiService, apiServiceUploadFile } from "@/lib/api-service";
import { BlogType } from "@/types";
import { ApiResponseCreatedType } from "@/types/common";

export const blogApi = {
    createBlog: async (p: FormData) => await apiServiceUploadFile.post<FormData, ApiResponseCreatedType>('/blog', p),
    getList: async () => await apiService.get<BlogType[]>('/blog'),
    getDetail: async (id: number) => await apiService.get<BlogType>(`/blog/${id}`),
};
