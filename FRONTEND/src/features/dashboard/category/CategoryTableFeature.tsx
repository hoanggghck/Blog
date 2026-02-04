"use client";
import { useState } from "react";
import { Edit, Trash } from "lucide-react";

import type { CategoryType } from "@/types";

import DialogCategory from "./DialogCategory";
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
import { useCategories, useRemoveCategory } from "@/hooks/category/useCategory";
import { ConfirmDialog } from "@/components/dialog/DialogConfirm";

export default function CategoryTableFeature() {
  // Define
  const [active, setActive] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const { data, isLoading, isError } = useCategories();
  const categories: CategoryType[] = data ?? [];
  const removeCategory = useRemoveCategory();
  // Methods

  const handleConfirm = () => {
    if (!selectedId) {
      removeCategory.mutate(selectedId);
      setSelectedId(0);
    }
  };
  const handleOpenDialog = (id: number) => {
    setActive(true);
    setSelectedId(id);
  }
  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Danh sách danh mục</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => handleOpenDialog(0)}
          >
            Thêm danh mục
          </Button>
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ): (
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
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(cat.id)}
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
      {active &&
        <DialogCategory
          active={active}
          setActive={setActive}
          selectedId={selectedId}
        />
      }
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
        title="Xóa danh mục"
        description="Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
};
