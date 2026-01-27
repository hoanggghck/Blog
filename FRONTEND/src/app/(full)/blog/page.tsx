import { blogApi } from "@/apis";
import BlogFeatureRender from "@/features/blog/BlogFeatureRender";

interface PageProps {
  searchParams: Promise<{
    keyword: string;
    category_id: number;
  }>
}

export async function generateMetadata() {
  return {
    title: 'Danh sách blogs',
    description: 'Mô tả danh sách Blogs',
   
  };
}
export default async function PageList({searchParams}: PageProps) {
  const { keyword, category_id } = await searchParams;
  const { data } = await blogApi.getList({params: {keyword, category_id}});
  return (
    <BlogFeatureRender data={data.result} />
  )
}
