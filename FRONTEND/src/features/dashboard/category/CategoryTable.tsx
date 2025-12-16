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
import { useCategories, useRemoveCategory } from "@/hooks/category/useCategory";
import DialogCategory from "./DialogCategory";
// Type
import type { CategoryType } from "@/types";
import { ConfirmDialog } from "@/components/dialog/DialogConfirm";

const CategoryTable = () => {
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
      ) : isError ? (
        <p className="text-red-500">Error loading users</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Đường dẫn</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell>
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
                    className="ml-2"
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

export default CategoryTable;
