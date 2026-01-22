import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BlogCardSkeleton = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-5 w-5 rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const SkeletonListCard = () => {
  return (
    <div className="container mx-auto max-w-[1440px] px-4 py-8">
      <div className="flex gap-3 mb-8">
        <h2 className="text-2xl font-bold text-foreground">Các danh mục</h2>
        <Badge className="text-xs" variant={"secondary"}>
          danh mục
        </Badge>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
    </div>
    
  );
};

export default SkeletonListCard;