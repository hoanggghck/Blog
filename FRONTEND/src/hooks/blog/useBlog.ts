import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { blogApi } from "@/apis/blog";
import { BlogType } from "@/types";
import { HTTP_STATUS } from "@/const/httpStatus";

export function useCreateBlog() {
  return useMutation({
    mutationFn: async (payload: BlogType) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("slug", payload.slug);
      formData.append("content", payload.content);
      formData.append("categoryId", payload.categoryId?.toString());
      formData.append("tagId", payload.tagId?.toString());
      formData.append("status", payload.status === 1 ? "published" : "draft");
      if (payload.thumbnail) {
        formData.append("thumbnail", payload.thumbnail);
      }

      return await blogApi.createBlog(formData);
    },
    onSuccess: (res) => {
      const { message } = res.data;
      toast.success(message ?? "Tạo blog thành công");
    },
    onError: (err: any) => {
      const res = err.response
      toast.error(res.data.message || "Tạo blog thất bại");
    },
  });
}

export const useGetBlogs = (p: any = {}) => {
  return useQuery<BlogType[], Error>({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, status } = await blogApi.getList({
        params: p
      });
      if (status === HTTP_STATUS.Success) {
        return data.result;
      }
      return [];  
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,  
  });
}

export const useGetBlog = (id: number, options?: { enabled?: boolean }) => {
  return useQuery<BlogType, Error>({
    queryKey: ["blogs", id],
    queryFn: async () => {
      const { data, status } = await blogApi.getDetail(id);
      if (status === HTTP_STATUS.Success) {
        return data.result;
      }
      throw new Error(data?.message || "Failed to fetch blog");
    },
    staleTime: Infinity,
    retry: false,
    ...options,
  });
};