import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Filter } from "lucide-react"

export const SkeletonFilter = () => {
  return (
    <div className="flex items-center gap-2 mb-8">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Tìm kiếm tiêu đề, mô tả..."
          className="w-full focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500"
        />
      </div>
      <div className="relative">
        <Select
        >
          <SelectTrigger className="w-full sm:w-[200px] focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500">
            <Filter className="w-4 h-4" />
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Tất cả</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}