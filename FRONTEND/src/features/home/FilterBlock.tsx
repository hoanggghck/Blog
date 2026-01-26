'use client'
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCategories } from "@/hooks/category/useCategory";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const FilterBlock = () => {
  // Define
  const router = useRouter();
  // State
  const [category, setCategory] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>('');
  // Fectch API
  const { data: categories } = useCategories();
  // Handler
  const searchData = () => {
    router.push(`/blog?keyword=${keyword}&category_id=${category}`);
  }
  
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <div className="relative flex-1">
        <Input
          onChange={(e) => setKeyword(e.target.value)}
          type="text"
          placeholder="Tìm kiếm tiêu đề, mô tả..."
          className="w-full focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500"
        />
      </div>
      <div className="relative w-full sm:w-[200px]">
        <Select
          onValueChange={(val) => setCategory(Number(val))}
          value={String(category)}
        >
          <SelectTrigger className="w-full focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500">
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Tất cả</SelectItem>
            {categories?.map((c: any) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="primary"
        className="w-full sm:w-auto px-3 gap-2 text-sm font-medium border-border/80"
        onClick={searchData}
      >
        <Search className="w-4 h-4" />
        Tìm kiếm
      </Button>
    </div>
  )
}

export default FilterBlock;