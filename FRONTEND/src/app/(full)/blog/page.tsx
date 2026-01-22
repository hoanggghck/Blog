import { Suspense } from "react";
import { SkeletonFilter } from "@/components/filter/SkeletonFilter";
import SkeletonListBlog from "@/components/blog/blogs/SkeletonListBlog";
import SuspendWrapper from "@/features/blog/SuspendWrapper";

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