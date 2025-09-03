export type BlogType = {
  id: number;
  title: string;
  content: string;
  slug: string;
  author: {
    avatar: string;
    id: number;
    name: string;
  };
  categoryId: number;
  tagId: number;
  category: {
    id: number;
    name: string;
  };
  tag: {
    id: number;
    name: string;
  };
  createdAt: string;
  status: number;
  thumbnail?: File | null;
  thumbnailUrl: string;
};
