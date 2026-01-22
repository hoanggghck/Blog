import { Suspense } from "react";
import SuspendWrapper from "@/features/category/SuspendWrapper";
import SkeletonListCard from "@/components/category/category-card/SkeletonListCard";

export default async function Category () {
  
  return (
    <Suspense fallback={<SkeletonListCard />}>
      <SuspendWrapper />
    </Suspense>
  )
}