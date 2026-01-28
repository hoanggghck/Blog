import { Suspense } from "react";
import { Flame } from "lucide-react";

import type { BlogType } from "@/types";

import { blogApi } from "@/apis";
import { BlogList } from "@/components/blog/BlogList";
import { SkeletonListBlog } from "@/components/blog/skeleton/BlogListSkeleton";

const HotBlogsContent = async () => {
  const { data } = await blogApi.getList();
  const blogs: BlogType[] = data.result.items;

  return (
    <BlogList blogs={blogs} />
  )
}

const HotBlogs = () => {
  
  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <Flame className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-foreground">Bài viết phổ biến</h2>
      </div>
      <Suspense fallback={<SkeletonListBlog />}>
        <HotBlogsContent />
      </Suspense>
    </>
  )
}

export default HotBlogs;