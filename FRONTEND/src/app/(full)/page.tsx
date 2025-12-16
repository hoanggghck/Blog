import { Flame, Search, Sparkles, TrendingUp } from "lucide-react"

import BtnFilter from "@/components/layout/blog/BtnFilter"
import { Input } from "@/components/ui/input"
import BlogCard from "@/features/blog/BlogCard"
import { blogApi, tagApi } from "@/apis"
import { BlogType, TagType } from "@/types"

export default async function Home() {
  // Fetch data from APIs
  const { data: tagData } = await tagApi.getList();
  const { data, status } = await blogApi.getList();
  if (!data && !tagData) return null;
  const blogs: BlogType[] = data.result;
  const displayedTags: TagType[] = tagData ? tagData?.result?.slice(0, 3) : []; 
  
  return (
    <div className="container mx-auto max-w-[1440px] px-4 py-8">
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {blogs.map((post) => (
            <BlogCard post={post} key={post.id} />
          ))}
        </div>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-foreground">Đang hot</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {blogs.map((post) => (
            <BlogCard post={post} key={post.id} />
          ))}
        </div>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold text-foreground">
            Phù hợp với bạn
          </h2>
          <div className="flex gap-2">
            {displayedTags.map((tag: any) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {blogs.map((post) => (
            <BlogCard post={post} key={post.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
