import { BlogCard } from "@/components/blog/BlogCard";
import { PaginationCommon } from "@/components/commons/PagePagination";
import { useGetBlogs } from "@/hooks/blog/useBlog";
import { ApiResponseListType } from "@/types/common";
// Type
import { BlogType } from "@/types";

const ListBlock = ({ 
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
export default ListBlock