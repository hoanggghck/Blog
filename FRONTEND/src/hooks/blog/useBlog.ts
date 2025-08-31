import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { BlogApi } from "@/apis/blog";
import { BlogType } from "@/types";

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

            return await BlogApi.createBlog(formData);
        },
        onSuccess: (res) => {
            const { message } = res.data;
            toast.success(message ?? "Tạo blog thành công");
            router.push("/"); // chuyển hướng sau khi tạo
        },
        onError: (err: any) => {
            toast.error(err.message || "Tạo blog thất bại");
        },
    });
}
