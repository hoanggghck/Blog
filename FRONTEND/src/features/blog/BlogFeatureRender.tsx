'use client'
import { debounce } from "lodash";
import { Suspense, useEffect, useMemo, useReducer } from "react"
import { useSearchParams } from "next/navigation";

import type { BlogType } from "@/types"
import type { ApiResponseListType, FilterAction, FilterState } from "@/types/common"

import ListBlock from "./ListBlock";
import FilterBlock from "./FilterBlock";
import { FilterBlockSkeleton } from "@/components/filter/FilterBlockSkeleton";
import { SkeletonListBlog } from "@/components/blog/skeleton/BlogListSkeleton";


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

const BlogFeatureRender = ({data: initialData}: {data: ApiResponseListType<BlogType>}) => {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const initialCat = Number(searchParams.get('category_id')) || 0;
  // Hooks
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
  // Handler
  const handleCategoryChange = (val: string) => {
    const catId = Number(val);
    dispatch({
      type: "APPLY_CAT",
      payload: { cat: catId }
    });
  };
  const onChangePage = (newPage: number) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Suspense fallback={<FilterBlockSkeleton />}>
        <FilterBlock 
          handleCategoryChange={handleCategoryChange}
          debouncedDispatch={debouncedDispatch}
          queryParams={queryParams}
        />
      </Suspense>
      <Suspense fallback={<SkeletonListBlog />}>
        <ListBlock 
          queryParams={queryParams}
          initialData={initialData}
          initialParams={initialParams}
          onChangePage={onChangePage}
        />
      </Suspense>
    </>
  )
}

export default BlogFeatureRender;