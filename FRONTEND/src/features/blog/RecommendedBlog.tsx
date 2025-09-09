"use client";
import { Sparkles } from "lucide-react";

import { useGetBlogs } from "@/hooks/blog/useBlog";
import { useGetTags } from "@/hooks/tag/useTag";
import BlogCard from "./BlogCard";

const RecommendedBlogFeature = () => {
  const { data: blogs, isLoading, isError, error } = useGetBlogs();
  const { data: tags } = useGetTags();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const displayedTags = tags?.slice(0, 3) || []; 

  const filtered = blogs?.filter((b) =>
    displayedTags.some((tag) => tag.id === b.tag?.id)
  );

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-bold text-foreground">
          Phù hợp với bạn
        </h2>
        <span className="text-muted-foreground text-sm">Dựa trên thẻ:</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered?.map((post) => (
          <BlogCard post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedBlogFeature;
