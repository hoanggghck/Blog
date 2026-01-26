import { Suspense } from "react";
import SuspenseCategoryWrapper from "@/features/category/SuspenseCategoryWrapper";
import { CategoryListCardSkeleton } from "@/components/category/skeleton/CategoryListCardSkeleton";

export default async function Category () {
  
  return (
    <Suspense fallback={<CategoryListCardSkeleton />}>
      <SuspenseCategoryWrapper />
    </Suspense>
  )
}