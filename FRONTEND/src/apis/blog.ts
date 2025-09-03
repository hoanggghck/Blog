import { apiService, apiServiceUploadFile } from "@/lib/api-service";
import { BlogType } from "@/types";
import { ApiResponseCreatedType } from "@/types/common";

export const blogApi = {
    createBlog: async (p: FormData) => await apiService.post<FormData, any>('/blog', p, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }),
    getList: async () => await apiService.get<BlogType[]>('/blog'),
};
