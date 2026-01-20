import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import React from "react";

import { blogApi } from "@/apis/blog";
import { BlogType } from "@/types";
import { HTTP_STATUS } from "@/const/httpStatus";
import { ApiResponseListType } from "@/types/common";

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

// hooks/blog/useBlog.ts
export const useGetBlogs = (
  params: any,
  initialData?: ApiResponseListType<BlogType>,
  initialParams?: any // Thêm params ban đầu
) => {
  // Check xem params hiện tại có khớp với params ban đầu không
  const shouldUseInitialData = initialData && initialParams && 
    params.page === initialParams.page &&
    params.limit === initialParams.limit &&
    params.keyword === initialParams.keyword &&
    params.category_id === initialParams.category_id;

  return useSuspenseQuery({
    queryKey: [
      "blogs",
      params.page,
      params.limit,
      params.keyword,
      params.category_id,
    ],
    queryFn: async () => {
      const { data } = await blogApi.getList({ params });
      return data.result;
    },
    initialData: shouldUseInitialData ? initialData : undefined,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};

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