"use client";
import { useState } from "react";

import type { BlogType } from "@/types";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/commons/LoadingSpinner";
import { PaginationCommon } from "@/components/commons/PagePagination";
import {  useGetFullBlogs } from "@/hooks/blog/useBlog";
import { convertDate } from "@/utils";
import { Badge } from "@/components/ui/badge";


export default function BlogTableFeature() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetFullBlogs(page);
  const blogs: BlogType[] = data?.items || [];
  if (!data && !isLoading) return <p>Không có dữ liệu hiển thị</p>
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Danh sách bài đăng</h2>
      </div>
      <Table className="table-auto w-full">
        <TableHeader className="block">
          <TableRow className="flex w-full">
            <TableHead className="w-50">Tiêu đề</TableHead>
            <TableHead className="w-100">Nội dung</TableHead>
            <TableHead className="w-37.5">Slug</TableHead>
            <TableHead className="w-25">Tác giả</TableHead>
            <TableHead className="w-37.5">Danh mục</TableHead>
            <TableHead className="w-37.5">Thẻ</TableHead>
            <TableHead className="w-25">Ngày tạo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="block">
        {isLoading ? 
          (<TableRow className="flex w-full">
            <TableCell className="w-full text-center py-6">
              <LoadingSpinner />
            </TableCell>
          </TableRow>
          ) : 
          (blogs.map((blog) => (
            <TableRow key={blog.id} className="flex w-full">
              <TableCell className="w-50 flex items-center gap-2">
                {blog.title}
              </TableCell>
              <TableCell className="flex-1">
                <p className="line-clamp-3">{blog.content}</p>
              </TableCell>
              <TableCell className="w-37.5">{blog.slug}</TableCell>
              <TableCell className="w-25">{blog.author.name}</TableCell>
              <TableCell className="w-37.5">
                <div className="flex items-center">
                  <Badge variant="default">{blog.category.name}</Badge>
                </div>
              </TableCell>
              <TableCell className="w-37.5">
                <div className="flex items-center">
                  <span
                    className="px-2 py-1 w-auto text-sm rounded-full bg-gray-200"
                  >
                    #{blog.tag.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="w-25">
                {convertDate(blog.createdAt)}
              </TableCell>
            </TableRow>
          ))
          )
        }
      </TableBody>
      </Table>
      <div className="flex justify-center">
        <PaginationCommon 
          currentPage={data.page}
          limit={data.limit}
          onChangePage={(newPage: number) => setPage(newPage)}
          total={data.total}
        />
      </div>
    </div>
  );
};
