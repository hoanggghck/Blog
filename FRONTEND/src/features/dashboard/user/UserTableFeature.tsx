"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import type { UserType } from "@/types";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetUsers } from "@/hooks/user/useGetUser";
import { convertDate, convertOptionToLabel } from "@/utils";
import { USER_STATUS_OPTIONS } from "@/const/options";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/commons/LoadingSpinner";
import { PaginationCommon } from "@/components/commons/PagePagination";


export default function UserTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetUsers(page);
  const users: UserType[] = data?.items ? data.items : [];
  if (!data && !isLoading) return <p>Không có dữ liệu hiển thị</p>
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Danh sách người dùng</h2>
      </div>
      <Table className="table-fixed w-full">
        <TableHeader className="block">
          <TableRow className="flex w-full">
            <TableHead className="w-[80px]">Avatar</TableHead>
            <TableHead className="flex-1">Tên</TableHead>
            <TableHead className="flex-1">Email</TableHead>
            <TableHead className="w-[120px]">Vai trò</TableHead>
            <TableHead className="w-[120px]">Trạng thái</TableHead>
            <TableHead className="w-[140px]">Ngày tạo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="block max-h-[400px] overflow-y-auto">
        {isLoading ? 
          (<TableRow className="flex w-full">
            <TableCell className="w-full text-center py-6">
              <LoadingSpinner />
            </TableCell>
          </TableRow>
          ) : 
          (users.map((user) => (
            <TableRow key={user.id} className="flex w-full">
              <TableCell className="w-[80px] flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="flex-1">{user.name}</TableCell>
              <TableCell className="flex-1">{user.email}</TableCell>
              <TableCell className="w-[120px]">{user.roleName}</TableCell>
              <TableCell className="w-[120px]">
                <Badge>{convertOptionToLabel(USER_STATUS_OPTIONS, user.status)}</Badge>
              </TableCell>
              <TableCell className="w-[140px]">
                {convertDate(user.createdAt)}
              </TableCell>
            </TableRow>
          ))
          )
        }
        </TableBody>
        </Table>
      <div className="flex justify-center">
        {data && 
          <PaginationCommon 
            currentPage={data.page}
            limit={data.limit}
            onChangePage={(newPage: number) => setPage(newPage)}
            total={data.total}
          />
        }
      </div>
    </div>
  );
};
