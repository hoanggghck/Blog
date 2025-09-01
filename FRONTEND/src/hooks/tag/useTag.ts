import { categoryApi, tagApi } from "@/apis";
import { useQuery } from "@tanstack/react-query";

export function useTag() {
  return useQuery({
    queryKey: ["tag"],
    queryFn: async () => {
      const res = await tagApi.getList();
      if (res.data.result.length) {
        return res.data.result;
      } else return [];
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu sẽ được coi là "tươi" trong 5 phút.
  });
}
