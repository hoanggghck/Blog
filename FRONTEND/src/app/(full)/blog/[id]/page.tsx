import { blogApi } from "@/apis";
import BlogDetail from "@/features/blog/BLogDetail";

export default async function ViewPostPage({ params }: { params: { id: string } }) {
  const slug = params.id;
  const postId = slug ? parseInt(slug.split('-').pop() || '', 10) : 0;
  const { data, status } = await blogApi.getDetail(postId);
      
  return (
    <div>
      <BlogDetail blog={data.result} />
    </div>
  );
}