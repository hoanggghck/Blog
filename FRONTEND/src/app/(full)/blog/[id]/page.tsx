import { BlogDetailSkeleton } from "@/components/blog/blog-detail/BlogDetailSkeleton";
import BlogDetailWrapper from "@/features/blog-detail/BlogDetailWrapper";
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
