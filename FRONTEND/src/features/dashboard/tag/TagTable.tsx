"use client";
import { useState } from "react";
import { Edit, Trash } from "lucide-react";
// Dev
import { LoadingSpinner } from "@/components/commons/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Type
import type { CategoryType } from "@/types";
import { ConfirmDialog } from "@/components/dialog/DialogConfirm";
import DialogTag from "./DialogTag";
import { useGetTags, useRemoveTag } from "@/hooks/tag/useTag";

const CategoryTable = () => {
  // Define
  const [active, setActive] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const { data, isLoading, isError } = useGetTags();
  const tags: CategoryType[] = data ?? [];
  const removeCategory = useRemoveTag();
  // Methods

  const handleConfirm = () => {
    if (!selectedId) {
      removeCategory.mutate(selectedId);
      setSelectedId(0);
    }
  };
  const handleOpenDialog = (id: number, isUpdate: boolean) => {
    setActive(true);
    setSelectedId(id);
    setIsUpdate(isUpdate);
  }
  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Danh sách thẻ</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => handleOpenDialog(0, false)}
          >
            Thêm thẻ
          </Button>
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <p className="text-red-500">Không tải được</p>
      ) : (
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[15%]">Tên</TableHead>
              <TableHead className="w-[20%]">Đường dẫn</TableHead>
              <TableHead className="w-[50%]">Mô tả</TableHead>
              <TableHead className="w-[15%]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(cat.id, true)}
                  >
                    <Edit />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(cat.id)}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <DialogTag
        active={active}
        setActive={setActive}
        isUpdate={isUpdate}
        selectedId={selectedId}
      />
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
        title="Xóa Thẻ"
        description="Bạn có chắc chắn muốn xóa thẻ này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default CategoryTable;
