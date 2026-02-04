import { Suspense } from "react";
import { TrendingUp } from "lucide-react";

import type { BlogType } from "@/types";

import { blogApi } from "@/apis";
import { SkeletonListBlog } from "@/components/blog/skeleton/BlogListSkeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogList } from "@/components/blog/BlogList";


const TrendingBlogsContent = async () => {
  const { data } = await blogApi.getList();
  const blogs: BlogType[] = data.result.items;

  return <BlogList blogs={blogs} />;
};

export default function TrendingBlogsFeature() {
  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-foreground">Đang hot</h2>
        <Tabs defaultValue="week">
          <TabsList>
            <TabsTrigger value="week">Tuần</TabsTrigger>
            <TabsTrigger value="month">Tháng</TabsTrigger>
            <TabsTrigger value="year">Năm</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Suspense fallback={<SkeletonListBlog />}>
        <TrendingBlogsContent />
      </Suspense>
    </>
  )
}
