import { apiService } from "@/lib/api-service";

export const BlogApi = {
    createBlog: async (p: FormData) => await apiService.post<FormData, any>('/blog', p, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }),
};
