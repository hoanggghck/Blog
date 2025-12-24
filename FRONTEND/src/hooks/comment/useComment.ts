import { commentApi } from "@/apis/comment";
import { queryClient } from "@/lib/react-query";
import { CommentType } from "@/types/comment";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCreateComment() {
  return useMutation({
    mutationFn: async (p: CommentType) => {
      return await commentApi.createComment(p)
    },
    onSuccess: (_res) => {
      toast.success(_res.data.message);
      queryClient.invalidateQueries({ queryKey: ['comment'] });
    },
    onError: (err: any) => {
      const res = err.response;
      toast.error(res.data.message);
    },
  });
}
export function useGetComment(blogId: number) {
  return useQuery({
    queryKey: ["comment"],
    queryFn: async () => {
      if (blogId) {
        const res = await commentApi.getCommentsByBlogId(blogId);
        if (res.data.result) {
          return res.data.result;
        } else return null;
      } return null
    },
    staleTime: 0,
  });
}