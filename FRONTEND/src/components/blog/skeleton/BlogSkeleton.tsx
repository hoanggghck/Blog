export function BlogCardSkeleton() {
  return (
    <div className="animate-pulse">
      <article className="bg-card rounded-lg overflow-hidden shadow-sm border h-full">
        <div className="relative aspect-[4/3] bg-muted" />
        <div className="p-4 space-y-3">
          <div className="h-5 w-20 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
        </div>
      </article>
    </div>
  )
}
