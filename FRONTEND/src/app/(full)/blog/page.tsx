import { blogApi } from "@/apis";
import BlogFeature from "@/features/blog/BlogFeature";

interface PageProps {
  searchParams: Promise<{
    keyword: string;
    category_id: number;
  }>
}

export async function generateMetadata() {
  return {
    title: 'Danh sách bài viết',
    description: 'Mô tả danh sách bài viết',
   
  };
}
export default async function Blogs({searchParams}: PageProps) {
  const { keyword, category_id } = await searchParams;
  const { data } = await blogApi.getList({params: {keyword, category_id}});
  return (
    <BlogFeature data={data.result} />
  )
}
