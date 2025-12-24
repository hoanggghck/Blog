export type CommentType = {
  content: string;
  blogId: number;
  createdAt?: string;
}
export type CommentWithUserType = CommentType & {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}