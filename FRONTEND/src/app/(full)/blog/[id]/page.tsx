import { blogApi } from "@/apis";
import BlogDetail from "@/features/blog/BLogDetail";

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Blog({ params }: PageProps) {
  const { id } = await params
  const postId = id ? parseInt(id.split('-').pop() || '', 10) : 0;
  const { data, status } = await blogApi.getDetail(postId);
      
  return (
    <div className="p-5">
      <BlogDetail blog={data.result} />
    </div>
  );
}