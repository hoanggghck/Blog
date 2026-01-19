import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BtnFilter from "./BtnFilter";

const SearchBlock = () => {
  return (
    <div className="flex items-center gap-2 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Tìm kiếm tiêu đề, mô tả..."
          className="pl-10 w-full focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500"
        />
      </div>
      <BtnFilter />
    </div>
  )
}

export default SearchBlock;