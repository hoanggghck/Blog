import { ApiResponseListType } from "@/types/common";
import { apiService } from "@/lib/api-service";
import { CategoryType } from "@/types/category";

export const categoryApi = {
    getList: async () =>
        await apiService.get<ApiResponseListType<CategoryType>>("/category"),
};
