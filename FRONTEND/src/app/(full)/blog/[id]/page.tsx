import BlogDetailCommentFeature from "@/features/blog-detail/BlogDetailCommentFeature";
import BlogDetailContentFeature from "@/features/blog-detail/BlogDetailContentFeature";
import { getBlogDetail } from "@/services/blog";
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
    <div className="md:p-5 p-3">
      <article className="max-w-4xl mx-auto">
        <BlogDetailContentFeature blog={blog} />
        <BlogDetailCommentFeature
          blogId={blog.id ?? 0}
        />
      </article>
    </div>
  );
}
