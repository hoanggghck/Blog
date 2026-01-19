export interface CommentType {
  content: string;
  blogId: number;
  createdAt?: string;
}
export interface CommentWithUserType extends CommentType {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}