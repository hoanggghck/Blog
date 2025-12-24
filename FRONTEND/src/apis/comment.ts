import { apiService } from "@/lib/api-service"
import { CommentType, CommentWithUserType } from "@/types/comment"
import { ApiResponseCreatedType } from "@/types/common"

export const commentApi = {
  createComment: async (p: CommentType) => await apiService.post<CommentType, ApiResponseCreatedType>(`/comment`, p),
  getCommentsByBlogId: async (blogId: number) => await apiService.get<CommentWithUserType[]>(`/comment/blog/${blogId}`),
}
