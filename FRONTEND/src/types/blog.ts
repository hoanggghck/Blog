import { BLOG_STATUS } from "@/const/status";
import { AuthResponseType } from "./user";
import { TagType } from "./tag";
import { CategoryType } from "./category";

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

export interface FileBuffer {
  type: 'Buffer';
  data: number[];
}

export interface ThumbnailType {
  id: number;
  filename: string;
  mimetype: string;
  url: string;
  data?: FileBuffer;    
  createdAt: string;      
  updatedAt: string;   
}

export type BlogResponse = {
  id: number;
  author: AuthResponseType;
  authorId: number;
  category: CategoryType;
  categoryId: number;
  tag: TagType;
  tagId: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: ThumbnailType;
  thumbnailId?: number;
};
  