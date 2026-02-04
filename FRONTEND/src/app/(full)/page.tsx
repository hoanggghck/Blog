import HotBlogsFeature from "@/features/home/HotBlogsFeature"
import MatchingBlogsFeature from "@/features/home/MatchingBlogsFeature"
import TrendingBlogsFeature from "@/features/home/TrendingBlogsFeature"
import FilterHomeFeature from "@/features/home/FilterHomeFeature";

export default function Home() {

  return (
    <>
      <FilterHomeFeature />
      <div className="mb-8">
        <HotBlogsFeature />
      </div>
      <div className="mb-8">
        <TrendingBlogsFeature />
      </div>
      <div className="mb-8">
        <MatchingBlogsFeature />
      </div>
    </>
  );
}
