import { cache } from "react";

import { blogApi } from "@/apis";

export const getBlogDetail = cache(async (postId: number) => {
  const { data } = await blogApi.getDetail(postId);
  return data.result;
});