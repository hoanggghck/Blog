import BlogCard from "@/components/blog/blog-card";
import { PaginationCommon } from "@/components/commons/PagePagination";
import { useGetBlogs } from "@/hooks/blog/useBlog";
import { BlogType } from "@/types";
import { ApiResponseListType } from "@/types/common";

export const BlogListSkeleton = () => {
  return (
    <>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>
        ))}
      </div>
    </>
  );
};
export const ListBlogSearch = ({ 
  queryParams, 
  initialData, 
  initialParams,
  onChangePage
}: {
  queryParams: any;
  initialData: ApiResponseListType<BlogType>;
  initialParams: any;
  onChangePage: (page: number) => void
}) => {
  const { data: blogData } = useGetBlogs(queryParams, initialData, initialParams);

  if (!blogData) return <p>Không có dữ liệu hiển thị</p>

  return (
    <>
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
    </>
  );
};
