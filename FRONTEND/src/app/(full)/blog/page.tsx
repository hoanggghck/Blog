import { Suspense } from "react";
import { FilterBlockSkeleton } from "@/components/filter/FilterBlockSkeleton";
import { SkeletonListBlog } from "@/components/blog/skeleton/BlogListSkeleton";
import SuspenseBlogWrapper from "@/features/blog/SuspenseBlogWrapper";

interface PageProps {
  searchParams: Promise<{
    keyword: string;
    category_id: number;
  }>
}

export default function PageList({searchParams}: PageProps) {
  return (
    <Suspense fallback={
      <>
        <FilterBlockSkeleton />
        <SkeletonListBlog />
      </>
    }>
      <SuspenseBlogWrapper searchParams={searchParams} />
    </Suspense>
  )
}
