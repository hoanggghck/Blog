import { blogApi } from "@/apis";
import BlogFeatureRender from "./BlogFeatureRender";

interface PageProps {
  searchParams: Promise<{
    keyword: string;
    category_id: number;
  }>
}

export default async function SuspenseBlogWrapper({searchParams}: PageProps) {
  const { keyword, category_id } = await searchParams;
  const { data } = await blogApi.getList({params: {keyword, category_id}});

  return (
    <BlogFeatureRender data={data.result} />
  )
}
