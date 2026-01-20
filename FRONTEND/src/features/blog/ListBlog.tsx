'use client'
import { debounce } from "lodash";
import { Filter } from "lucide-react";
import { useEffect, useMemo, useReducer, useState } from "react"
import { useSearchParams } from "next/navigation";
// Dev
import BlogCard from "@/components/blog/blog-card";
import { PaginationCommon } from "@/components/commons/PagePagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetBlogs } from "@/hooks/blog/useBlog";
import { useCategories } from "@/hooks/category/useCategory";
// Type
import { BlogType } from "@/types"
import { ApiResponseListType } from "@/types/common"
type FilterState = {
  page: number;
  limit: number;
  keyword: string;
  category_id: number;
};

type FilterAction =
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'APPLY_KEYWORD'; payload: { keyword: string } }
  | { type: 'APPLY_CAT'; payload: { cat: number } }
  | { type: 'RESET' };

const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'APPLY_KEYWORD':
      return { 
        ...state, 
        page: 1,
        keyword: action.payload.keyword
      };
    case 'APPLY_CAT':
      return { 
        ...state, 
        page: 1,
        category_id: action.payload.cat
      };
    case 'RESET':
      return { ...state, page: 1, keyword: '', category_id: 0 };
    default:
      return state;
  }
};

const ListBlogRender = ({data: initialData}: {data: ApiResponseListType<BlogType>}) => {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const initialCat = Number(searchParams.get('category_id')) || 0;
  
  const [inputKeyword, setInputKeyword] = useState(initialKeyword);
  
  const initialParams = useMemo(() => ({
    page: initialData.page,
    limit: initialData.limit,
    keyword: initialKeyword,
    category_id: initialCat,
  }), []); 

  const [queryParams, dispatch] = useReducer(filterReducer, initialParams);

  const debouncedDispatch = useMemo(
    () => debounce((keyword: string) => {
      dispatch({
        type: "APPLY_KEYWORD",
        payload: { keyword },
      });
    }, 500),
    []
  );
  useEffect(() => {
    return () => {
      debouncedDispatch.cancel();
    };
  }, [debouncedDispatch]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputKeyword(val);
    debouncedDispatch(val);
  };

  const handleCategoryChange = (val: string) => {
    const catId = Number(val);
    dispatch({
      type: "APPLY_CAT",
      payload: { cat: catId }
    });
  };

  const { data: blogData, isFetching } = useGetBlogs(queryParams, initialData, initialParams);
  const { data: categories } = useCategories();

  const onChangePage = (newPage: number) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if(!blogData) return <p>Không có dữ liệu hiển thị</p>
  
  return (
    <div className="container">
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="px-3 gap-2 text-sm font-medium border-border/80 "
              >
                <Filter className="w-4 h-4" />
                  {queryParams.category_id ? categories?.find(ele => ele.id === queryParams.category_id)?.name : 'Bộ lọc'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 space-y-3">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Danh mục
                </span>
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
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {blogData.items.length ? 
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {blogData.items.map((ele) => {
              return (
                <BlogCard key={ele.id} post={ele} />
              )
            })}
          </div>
          :   
        <div>Không có dữ liệu hiển thị</div>
      }
      <div className="flex justify-center">
        <PaginationCommon 
          currentPage={blogData.page}
          limit={blogData.limit}
          onChangePage={onChangePage}
          total={blogData.total}
        />
      </div>
    </div>
  )
}

export default ListBlogRender;