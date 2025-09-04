'use client'
import { useState } from "react";

import { useGetBlogs } from "@/hooks/blog/useBlog";
import BlogCard from "./BlogCard";
import { Button } from "@/components/ui/button";

const HotBlogFeature = () => {
  const [range, setRange] = useState<"week" | "month" | "year">("week");
  const { data: blogs, isLoading, isError, error } = useGetBlogs();
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="flex gap-3 mb-8">
        <Button
          variant={range === "week" ? "default" : "outline"}
          onClick={() => setRange("week")}
        >
          Tuần
        </Button>
        <Button
          variant={range === "month" ? "default" : "outline"}
          onClick={() => setRange("month")}
        >
          Tháng
        </Button>
        <Button
          variant={range === "year" ? "default" : "outline"}
          onClick={() => setRange("year")}
        >
          Năm
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          blogs?.map(ele => {
            return <BlogCard post={ele} key={ele.id} />
          })
        }
      </div>
    </div>
  )
}

export default HotBlogFeature;
