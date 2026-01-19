export interface CategoryType {
    id: number;
    name: string;
    slug: string;
    description?: string;
};

export type CategoryFormType = Omit<CategoryType, 'id'>;