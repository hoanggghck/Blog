export type BlogType = {
    id: number;
    title: string;
    content: string;
    slug: string;
    author: {
        id: number;
        name: string;
    }
    tag: {
        id: number;
        name: string;
    }
    category: {
        id: number;
        name: string;
    }
    thumbnailUrl: string | null;
}