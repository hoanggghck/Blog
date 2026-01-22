import HotBlogs from "@/features/home/HotsBlogs"
import MatchingBlogs from "@/features/home/MatchingBlogs"
import TrendingBlogs from "@/features/home/TrendingBlog"
import FilterBlock from "@/features/home/FilterBlock";

export default function Home() {
  
  return (
    <>
      <FilterBlock />
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
