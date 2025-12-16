import { reactionApi } from "@/apis/reaction";
import { HTTP_STATUS } from "@/const/httpStatus";
import { queryClient } from "@/lib/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCreateReaction() {
  return useMutation({
    mutationFn: async (blogId: number) => {
      return await reactionApi.createReaction(blogId)
    },
    onSuccess: (_res, blogId) => {
      queryClient.invalidateQueries({ queryKey: ['reactionsLiked', blogId] });
      queryClient.invalidateQueries({ queryKey: ['hasReaction', blogId] });
    },
    onError: (err: any) => {
      const res = err.response;
      toast.error(res.data.message);
    },
  });
}

export const useGetUserHasReactionBlog = (id: number) => {
  return useQuery<boolean, Error>({
    queryKey: ["hasReaction", id],
    queryFn: async () => {
      const { data, status } = await reactionApi.hasReaction(id);
      if (status === HTTP_STATUS.Success) {
        return data.result;
      }
      return false;  
    },
    retry: false,
    staleTime: Infinity,
  });
}

export const useGetReactionsByBlog = (id: number) => {
  return useQuery<number, Error>({
    queryKey: ["reactionsLiked", id],
    queryFn: async () => {
      const { data, status } = await reactionApi.getReactions(id);
      if (status === HTTP_STATUS.Success) {
        return data.result;
      }
      return 0;  
    },
    retry: false,
    staleTime: Infinity,
  });
}
