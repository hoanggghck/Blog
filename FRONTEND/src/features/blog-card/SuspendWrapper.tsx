import { blogApi } from "@/apis";
import SearchBlogRender from "./SearchBlogs";

interface PageProps {
  searchParams: Promise<{
    keyword: string;
    category_id: number;
  }>
}

export default async function SuspendWrapper({searchParams}: PageProps) {
  const { keyword, category_id } = await searchParams;
  const { data } = await blogApi.getList({params: {keyword, category_id}});

  return (
    <SearchBlogRender data={data.result} />
  )
}
