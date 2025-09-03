import BlogFeature from "@/features/blog/BLogData";
import { Flame } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto max-w-[1440px] px-4 py-8">
      <section>
          <div className="flex items-center gap-3 mb-8">
            <Flame className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Bài viết phổ biến</h2>
          </div>
          <BlogFeature />
        </section>
    </div>
  );
}
