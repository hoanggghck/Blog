import { categoryApi } from "@/apis";
import { CategoryFormType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoryApi.getList();
      if (res.data.result.length) {
        return res.data.result;
      } else return [];
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

export function useCreateCategory(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: CategoryFormType) => await categoryApi.create(p),
    onSuccess: async (res) => {
      const { result, message } = res.data;
      toast.success(message ?? '');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: any) => {
    },
  });
}

export function useUpdateCategory(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({p, id}: {p: CategoryFormType, id: number}) => await categoryApi.update(p, id),
    onSuccess: async (res) => {
      const { result, message } = res.data;
      toast.success(message ?? '');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: any) => {
    },
  });
}

export function useRemoveCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: number) => await categoryApi.delete(p),
    onSuccess: async (res) => {
      const { result, message } = res.data;
      toast.success(message ?? '');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: any) => {
    },
  });
}

export function useGetCategory(id: number) {
  return useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      if (id) {
        const res = await categoryApi.getDetail(id);
        if (res.data.result) {
          return res.data.result;
        } else return null;
      } return null
    },
    staleTime: 0,
  });
}
