"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/category/useCategory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal } from "lucide-react";

const BtnFilter = () => {
  const { data: categories } = useCategories();
  const [category, setCategory] = useState<number>(0);

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="px-3 gap-2 text-sm font-medium border-border/80 "
          >
            <Filter className="w-4 h-4" />
            Bộ lọc
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3 space-y-3">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">
              Danh mục
            </span>
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
          <div className="flex justify-end">
            <Button
              variant="link"
              className="text-sm text-muted-foreground hover:no-underline hidden md:flex bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
            >
              Xác nhận
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BtnFilter;
