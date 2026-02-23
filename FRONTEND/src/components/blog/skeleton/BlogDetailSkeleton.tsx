import { Skeleton } from "@/components/ui/skeleton"

export const BlogDetailSkeleton = () => {
  return (
    <div className="md:p-5 p-3">
      <article className="max-w-4xl mx-auto animate-pulse">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-10 w-3/4 mb-6" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>
          </div>
        </header>
        <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="space-y-4 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-5 ${i === 5 ? "w-2/3" : "w-full"}`}
            />
          ))}
        </div>
        <div className="bg-card border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
      </article>
    </div>
  )
}
