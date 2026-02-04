import { Suspense } from "react";
import { Sparkles } from "lucide-react";

import type { BlogType, TagType } from "@/types";

import { blogApi, tagApi } from "@/apis";
import { BlogList } from "@/components/blog/BlogList";
import { SkeletonListBlog } from "@/components/blog/skeleton/BlogListSkeleton";


const MatchingCotent = async () => {
  const { data, status } = await blogApi.getList();

  const blogs: BlogType[] = data.result.items;
  return <BlogList blogs={blogs} />
}

const TagsDisplay = async () => {
  const { data: tagData } = await tagApi.getList();
  const displayedTags: TagType[] = tagData ? tagData?.result?.slice(0, 3) : [];
  
  return (
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
  )
}

export default function MatchingBlogsFeature() {

  return (
    <>
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <Sparkles className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-bold text-foreground">
          Phù hợp với bạn
        </h2>
        <Suspense fallback={
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700 animate-pulse">
              Loading...
            </span>
          </div>
        }>
          <TagsDisplay />
        </Suspense>
      </div>
      <Suspense fallback={<SkeletonListBlog />}>
        <MatchingCotent />
      </Suspense>
    </>
  )
}
