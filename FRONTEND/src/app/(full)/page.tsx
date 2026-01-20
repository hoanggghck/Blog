import HotBlogs from "@/features/home/HotsBlogs"
import MatchingBlogs from "@/features/home/MatchingBlogs"
import TrendingBlogs from "@/features/home/TrendingBlog"
import SearchBlock from "@/features/home/SearchBlock"

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
