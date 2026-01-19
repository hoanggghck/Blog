export interface TagType {
    id: number;
    name: string;
    slug: string;
    description?: string;
};
  
export type TagFormType = Omit<TagType, 'id'>;