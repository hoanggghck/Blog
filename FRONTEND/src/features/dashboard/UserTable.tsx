"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// Dev
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useGetUsers } from "@/hooks/user/useGetUser";
import { convertDate, convertOptionToLabel } from "@/utils";
import { USER_STATUS_OPTIONS } from "@/const/options";
import { Badge } from "@/components/ui/badge";
import { USER_STATUS } from "@/const/status";
import { LoadingSpinner } from "@/components/commons/LoadingSpinner";

const UserTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError } = useGetUsers(page, limit);

  const users = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Danh sách người dùng</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Tìm kiếm người dùng theo tên..."
            className="w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <p className="text-red-500">Error loading users</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hình đại diện</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role?.name}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === USER_STATUS.ACTIVE ? "success" : user.status === USER_STATUS.INACTIVE ? "secondary" : "error"}>
                      {convertOptionToLabel(USER_STATUS_OPTIONS, user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{convertDate(user.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default UserTable;
