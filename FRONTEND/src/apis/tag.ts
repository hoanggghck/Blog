import { ApiResponseListType } from "@/types/common";
import { apiService } from "@/lib/api-service";
import { TagType } from "@/types/tag";

export const tagApi = {
    getList: async () =>
        await apiService.get<ApiResponseListType<TagType>>("/tag"),
};
