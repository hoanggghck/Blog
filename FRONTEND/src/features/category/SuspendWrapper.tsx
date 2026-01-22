import { blogApi } from "@/apis"
import CategoryCard from "@/components/category/category-card";
import { Badge } from "@/components/ui/badge";

const SuspendWrapper = async () => {
  const { data } = await blogApi.countCategory();
  if (!data) return null;
  
  return (
    <div className="container mx-auto max-w-[1440px] px-4 py-8">
      <div className="flex gap-3 mb-8">
        <h2 className="text-2xl font-bold text-foreground">Các danh mục</h2>
        <Badge className="text-xs" variant={"secondary"}>
          {data.result.length || 0} danh mục
        </Badge>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {data.result.map((cat, index) => (
          <CategoryCard cat={cat} key={index} />
        ))}
      </div>
    </div>
  )
}

export default SuspendWrapper;