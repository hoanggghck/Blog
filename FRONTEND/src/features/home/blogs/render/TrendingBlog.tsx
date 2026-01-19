import { Suspense } from "react";
import { TrendingUp } from "lucide-react";
// Dev
import BlogListSkeleton from "@/features/home/blogs/SkeletonBlog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { blogApi } from "@/apis";
import ListBlog from "../ListBlog";
// Type
import { BlogType } from "@/types";

const TrendingBlogsContent = async () => {
  const { data } = await blogApi.getList();
  const blogs: BlogType[] = data.result;

  return <ListBlog blogs={blogs} />;
};

const TrendingBlogs = () => {
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
      <Suspense fallback={<BlogListSkeleton />}>
        <TrendingBlogsContent />
      </Suspense>
    </>
  )
}

export default TrendingBlogs;