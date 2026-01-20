import { blogApi } from "@/apis";
import ListBlogRender from "@/features/blog/ListBlog";

interface PageProps {
  searchParams: Promise<{ 
    keyword: string;
    category_id: number;
  }>
}

export default async function PageList({searchParams}: PageProps) {
  const { keyword, category_id } = await searchParams;
  const { data } = await blogApi.getList({params: {keyword, category_id}});
  
  return (
    <div>
      <ListBlogRender data={data.result} />
    </div>
  )
}