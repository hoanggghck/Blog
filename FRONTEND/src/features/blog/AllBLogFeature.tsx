"use client";
import { useState } from "react";
import { Filter, Sparkles } from "lucide-react";

import { useGetBlogs } from "@/hooks/blog/useBlog";
import { useTag } from "@/hooks/tag/useTag";
import { useCategories } from "@/hooks/category/useCategory";
import BlogCard from "./BlogCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const FilterBlogFeature = () => {
  const { data: blogs, isLoading, isError, error } = useGetBlogs();
  const { data: tags } = useTag();
  const { data: categories } = useCategories();

  const [category, setCategory] = useState<number>(0);
  const [tag, setTag] = useState<number>(0);
  const [sort, setSort] = useState<string>("Mới nhất"); 

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const handleReset = () => {
    setCategory(0);
    setTag(0);
    setSort("Mới nhất");
  };

  let result = blogs || [];

  if (category !== 0) {
    result = result.filter((b) => b.category?.id === category);
  }

  if (tag !== 0) {
    result = result.filter((b) => b.tag?.id === tag);
  }

  if (sort === "Mới nhất") {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === "Cũ nhất") {
    result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">
          <Filter className="inline-block w-6 h-6 text-purple-500 mr-2" />
          Tất cả bài viết
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
        <div className="flex-1 w-full sm:w-auto">
          <label className="block text-sm font-medium mb-1">Danh mục</label>
          <Select onValueChange={(val) => setCategory(Number(val))} value={String(category)}>
            <SelectTrigger className="w-full focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {categories?.map((c: any) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 w-full sm:w-auto">
          <label className="block text-sm font-medium mb-1">Thẻ</label>
          <Select onValueChange={(val) => setTag(Number(val))} value={String(tag)}>
            <SelectTrigger className="w-full focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500">
              <SelectValue placeholder="Chọn thẻ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {tags?.map((t: any) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 w-full sm:w-auto">
          <label className="block text-sm font-medium mb-1">Sắp xếp</label>
          <Select onValueChange={(val) => setSort(val)} value={sort}>
            <SelectTrigger className="w-full focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500">
              <SelectValue placeholder="Mới nhất" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mới nhất">Mới nhất</SelectItem>
              <SelectItem value="Cũ nhất">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <Button onClick={handleReset} variant="outline" className="w-full">
            Đặt lại
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {result?.map((post) => (
          <BlogCard post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
};

export default FilterBlogFeature;
