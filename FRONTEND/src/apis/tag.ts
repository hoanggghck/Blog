import { apiService } from "@/lib/api-service";
import { TagType } from "@/types/tag";

export const tagApi = {
  getList: async () => await apiService.get<TagType[]>("/tag"),
};
