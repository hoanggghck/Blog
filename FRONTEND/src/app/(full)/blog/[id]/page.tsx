import { SkeletonBlogDetail } from "@/components/blog/skeleton/SkeletonBlogDetail";
import { getBlogDetail } from "@/services/blog";
import { Suspense } from "react";
interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const postId = parseInt(id.split('-').pop()!, 10)
  const blog = await getBlogDetail(postId);

  if (!blog) return {};

  return {
    title: blog.title,
    description: blog.content.slice(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.content.slice(0, 160),
      type: "article"
    },
  };
}
export default async function Blog({ params }: PageProps) {
  const { id } = await params
  const postId = parseInt(id.split('-').pop()!, 10)
  const blog = await getBlogDetail(postId);

  if (!blog) return <p>Không có dữ liệu hiển thị</p>;
  return (
    <Suspense fallback={<SkeletonBlogDetail />}>
      <BlogDetailWrapper blogId={id} />
    </Suspense>
  );
}
