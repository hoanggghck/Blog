import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
// Dev
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/category/useCategory";

export const FilterBlock = ({
  handleCategoryChange, 
  debouncedDispatch,
  queryParams
}: {
  handleCategoryChange: (val: string) => void, 
  debouncedDispatch: (val: string) => void,
  queryParams: any
}) => {
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
    <div className="flex items-center gap-2 mb-8">
      <div className="relative flex-1">
        <Input
          value={inputKeyword}
          onChange={handleKeywordChange}
          type="text"
          placeholder="Tìm kiếm tiêu đề, mô tả..."
          className="w-full focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500"
        />
      </div>
      <div className="relative">
        <Select
          onValueChange={handleCategoryChange}
          value={String(queryParams.category_id)}
        >
          <SelectTrigger className="w-full sm:w-[200px] focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500">
            <Filter className="w-4 h-4" />
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