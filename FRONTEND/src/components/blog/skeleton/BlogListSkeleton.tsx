import { BlogCardSkeleton } from "./BlogSkeleton";

export function SkeletonListBlog() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
};
