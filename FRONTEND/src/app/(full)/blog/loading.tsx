import { SkeletonListBlog } from "@/components/blog/skeleton/BlogListSkeleton";
import { FilterBlockSkeleton } from "@/components/filter/FilterBlockSkeleton";

export default function Loading() {
  return (
    <>
      <FilterBlockSkeleton />
      <SkeletonListBlog />
    </>
  )
}