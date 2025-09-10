import { tagApi } from "@/apis";
import { TagFormType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export function useGetTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await tagApi.getList();
      if (res.data.result.length) {
        return res.data.result;
      } else return [];
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

export function useCreateTag(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: TagFormType) => await tagApi.create(p),
    onSuccess: async (res) => {
      const { result, message } = res.data;
      toast.success(message ?? '');
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: any) => {
    },
  });
}

export function useUpdateTag(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({p, id}: {p: TagFormType, id: number}) => await tagApi.update(p, id),
    onSuccess: async (res) => {
      const { result, message } = res.data;
      toast.success(message ?? '');
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: any) => {
    },
  });
}

export function useRemoveTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: number) => await tagApi.delete(p),
    onSuccess: async (res) => {
      const { result, message } = res.data;
      toast.success(message ?? '');
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (err: any) => {
    },
  });
}

export function useGetTag(id: number) {
  return useQuery({
    queryKey: ["tag"],
    queryFn: async () => {
      if (id) {
        const res = await tagApi.getDetail(id);
        if (res.data.result) {
          return res.data.result;
        } else return null;
      } return null
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
