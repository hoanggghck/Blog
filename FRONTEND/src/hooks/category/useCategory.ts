import { categoryApi } from "@/apis";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoryApi.getList();
      if (res.data.result.length) {
        return res.data.result;
      } else return [];
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu sẽ được coi là "tươi" trong 5 phút.
  });
}
