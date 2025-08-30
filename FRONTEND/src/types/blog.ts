export type BlogRequestType = {
    title: string;
    slug: string;
    content: string;
    categoryId: string | number;
    tagId: string | number;
    status: string;
    thumbnail?: File;
};
