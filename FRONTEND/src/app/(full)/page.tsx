import HotBlogs from "@/features/home/blogs/render/HotsBlogs"
import MatchingBlogs from "@/features/home/blogs/render/MatchingBlogs"
import TrendingBlogs from "@/features/home/blogs/render/TrendingBlog"
import SearchBlock from "@/features/home/filter/SearchBlock"

export default function Home() {
  
  return (
    <>
      <SearchBlock />
      <div className="mb-8">
        <HotBlogs />
      </div>
      <div className="mb-8">
        <TrendingBlogs />
      </div>
      <div className="mb-8">
        <MatchingBlogs />
      </div>
    </>
  );
}
