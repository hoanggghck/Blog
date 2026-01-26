import { BlogDetailSkeleton } from "@/components/blog/skeleton/BlogDetailSkeleton";
import BlogDetailWrapper from "@/features/blog-detail/BlogDetailRender";
import { Suspense } from "react";
interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Blog({ params }: PageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<BlogDetailSkeleton />}>
      <BlogDetailWrapper blogId={id} />
    </Suspense>
  );
}
