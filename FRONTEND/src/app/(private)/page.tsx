"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useGetBlogs } from "@/hooks/blog/useBlog";
import { useCategories } from "@/hooks/category/useCategory";
import { useTag } from "@/hooks/tag/useTag";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { data: categories } = useCategories();
  const { data: tags } = useTag();
  const { data: blogs } = useGetBlogs();
  console.log("blogs",`${process.env.NEXT_PUBLIC_BASE_API}/images/1756629581819-logoo.png`);
  
  
  return (
    <div className="px-6 py-4 space-y-6">
    {/* Search + Filter */}
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm tiêu đề, mô tả..."
          className="pl-8"
        />
      </div>
      <Button variant="outline" className="flex items-center gap-2">
        <Filter className="h-4 w-4" /> Bộ lọc
      </Button>
    </div>

    {/* Title */}
    <h2 className="text-xl font-semibold flex items-center gap-2">
      <span className="text-purple-600">🔥</span> Bài viết phổ biến
    </h2>

    {/* Blog grid */}
    <div className="grid md:grid-cols-3 gap-6">
      {blogs?.map((post) => (
        <Card key={post.id} className="overflow-hidden group">
          {/* Thumbnail */}
          {post.thumbnail?.url && (
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_API}${post.thumbnail.url}`}
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition"
            />
          )}

          <CardContent className="p-4 space-y-2">
            {/* Category + time */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Badge variant="outline">{post.category?.name}</Badge>
              <span>• 8 min</span>
            </div>

            {/* Title */}
            <Link
              href={`/post/${post.slug}`}
              className="block font-semibold text-lg hover:text-purple-600 line-clamp-2"
            >
              {post.title}
            </Link>

            {/* Description */}
            <p
              className="text-sm text-gray-600 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author + Like */}
            <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
              <div className="flex items-center gap-2">
                <img
                  src={post.author?.avatarUrl || "/default-avatar.png"}
                  alt={post.author?.name}
                  className="w-6 h-6 rounded-full"
                />
                <span>{post.author?.name}</span>
              </div>
              <span>❤️ 124</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
  );
}
