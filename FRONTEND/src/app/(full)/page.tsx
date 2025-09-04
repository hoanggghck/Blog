import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlogFeature from "@/features/blog/BLogData";
import { Filter, Flame, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto max-w-[1440px] px-4 py-8">
      <section>
          <div className="flex items-center gap-2 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm tiêu đề, mô tả..."
                className="pl-10 w-full focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 whitespace-nowrap"
            >
                <Filter className="w-4 h-4" />
                Bộ lọc
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-8">
            <Flame className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Bài viết phổ biến</h2>
          </div>
          <BlogFeature />
        </section>
    </div>
  );
}
