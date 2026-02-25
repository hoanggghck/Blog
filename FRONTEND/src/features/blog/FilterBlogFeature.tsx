import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/category/useCategory";

type PropsType = {
  handleCategoryChange: (val: string) => void, 
  debouncedDispatch: (val: string) => void,
  queryParams: any
}

export default function FilterBlogFeature({
  handleCategoryChange, 
  debouncedDispatch,
  queryParams
}: PropsType) {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const [inputKeyword, setInputKeyword] = useState(initialKeyword);
  const { data: categories } = useCategories();
  // Handler
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputKeyword(val);
    debouncedDispatch(val);
  };
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <div className="relative flex-1">
        <Input
          value={inputKeyword}
          onChange={handleKeywordChange}
          type="text"
          placeholder="Tìm kiếm tiêu đề, mô tả..."
          className="w-full focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500"
        />
      </div>
      <div className="relative w-full sm:w-50">
        <Select
          onValueChange={handleCategoryChange}
          value={String(queryParams.category_id)}
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
    </div>
  )
}
