import { blogApi } from "@/apis";
import BlogDetail from "@/features/blog/BLogDetail";

interface ViewPostPageProps {
  params: { id: string };
}

export default async function ViewPostPage({ params }: ViewPostPageProps) {
  const { id } = await params
  const postId = id ? parseInt(id.split('-').pop() || '', 10) : 0;
  const { data, status } = await blogApi.getDetail(postId);
      
  return (
    <div>
      <BlogDetail blog={data.result} />
    </div>
  );
}