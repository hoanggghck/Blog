'use client'
import { useGetBlogs } from "@/hooks/blog/useBlog";
import Link from "next/link";
import BlogCard from "./BlogCard";

const BlogFeature = () => {
  const { data: blogs, isLoading, isError, error } = useGetBlogs();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {
        blogs?.map(ele => {
          return <BlogCard post={ele} key={ele.id} />
        })
      }
    </div>
  )
}

export default BlogFeature;
