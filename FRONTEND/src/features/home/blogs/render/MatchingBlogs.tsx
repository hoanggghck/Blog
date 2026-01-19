import { Suspense } from "react";
import { Sparkles } from "lucide-react";
// Dev
import { blogApi, tagApi } from "@/apis";
import ListBlog from "../ListBlog";
import BlogListSkeleton from "../SkeletonBlog";
// Type
import { BlogType, TagType } from "@/types";

const MatchingCotent = async () => {
  const { data, status } = await blogApi.getList();
  
  const blogs: BlogType[] = data.result;
  return <ListBlog blogs={blogs} />
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

const MatchingBlogs = () => {
  
  return (
    <>
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <Sparkles className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-bold text-foreground">
          Phù hợp với bạn
        </h2>
        <TagsDisplay />
      </div>
      <Suspense fallback={<BlogListSkeleton />}>
        <MatchingCotent />
      </Suspense>
    </>
  )
}

export default MatchingBlogs;