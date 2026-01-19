import { apiServicePrivate } from "@/lib/base-api.private"
import { apiServicePublic } from "@/lib/base-api.public"
import type { CommentType, CommentWithUserType } from "@/types/comment"
import type { ApiResponseCreatedType } from "@/types/common"

export const commentApi = {
  createComment: async (p: CommentType) => await apiServicePrivate.post<CommentType, ApiResponseCreatedType>(`/comment`, p),
  getCommentsByBlogId: async (blogId: number) => await apiServicePublic.get<CommentWithUserType[]>(`/comment/blog/${blogId}`),
}
