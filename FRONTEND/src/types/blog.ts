import { BLOG_STATUS } from "@/const/status";

export type BlogType = {
  title: string;
  slug: string;
  content: string;
  categoryId: number;
  tagId: number;
  status: BLOG_STATUS;
  thumbnail?: File | null;
};
