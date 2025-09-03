import { useMutation, useQuery } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { blogApi } from "@/apis/blog";
import { blogApi } from "@/apis/blog";
import { BlogType } from "@/types";
import { ApiResponseListType } from "@/types/common";
import { HTTP_STATUS } from "@/const/httpStatus";

export function useCreateBlog() {
    const router = useRouter();

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

export function useGetBlogs() {
    return useQuery({
        queryKey: ["blog"],
        queryFn: async () => {
          const res = await blogApi.getBlogs();
          if (res.data.result.length) {
            return res.data.result;
          } else return [];
        },
        staleTime: 1000 * 60 * 5, // Dữ liệu sẽ được coi là "tươi" trong 5 phút.
    });
}

const fetchBlogs = async (): Promise<BlogType[]> => {
  const { data, status } = await blogApi.getList();
  if (status === HTTP_STATUS.Success) {
    return data.result;
  }
  return [];  
};

export const useGetBlogs = () => {
  return useQuery<BlogType[], Error>({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
    staleTime: "static",
    retry: false,
  });
}
