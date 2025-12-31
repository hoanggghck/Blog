import { apiService } from "./core"
import type { CommentType, CommentWithUserType } from "@/types/comment"
import type { ApiResponseCreatedType } from "@/types/common"

export const commentApi = {
  createComment: async (p: CommentType) => await apiService.post<CommentType, ApiResponseCreatedType>(`/comment`, p),
  getCommentsByBlogId: async (blogId: number) => await apiService.get<CommentWithUserType[]>(`/comment/blog/${blogId}`),
}
