import { Suspense } from "react";
import SkeletonListBlog from "@/components/blog/blogs/SkeletonListBlog";
import SuspendWrapper from "@/features/blog/SuspendWrapper";
import { SkeletonFilter } from "@/components/filter/SkeletonFilter";

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
        <SkeletonFilter />
        <SkeletonListBlog />
      </>
    }>
      <SuspendWrapper searchParams={searchParams} />
    </Suspense>
  )
}