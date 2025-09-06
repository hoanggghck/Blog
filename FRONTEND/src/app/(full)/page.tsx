import { Flame, Search, TrendingUp } from "lucide-react";

import BtnFilter from "@/components/layout/blog/BtnFilter";
import { Input } from "@/components/ui/input";
import BlogFeature from "@/features/blog/BLogData";
import HotBlogFeature from "@/features/blog/HotBlog";
import RecommendedBlogFeature from "@/features/blog/RecommendedBlog";

export default function Home() {
  return (
    <div className="container mx-auto max-w-[1440px] px-4 py-8">
      <section>
          <div className="flex items-center gap-2 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm tiêu đề, mô tả..."
                className="pl-10 w-full focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500"
              />
            </div>
            <BtnFilter />
          </div>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-8">
              <Flame className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-foreground">Bài viết phổ biến</h2>
            </div>
            <BlogFeature />
          </div>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-foreground">Đang hot</h2>
            </div>
            <HotBlogFeature />
          </div>
          <RecommendedBlogFeature />
        </section>
    </div>
  );
}
