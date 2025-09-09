"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react";
import z from "zod";
import { Label } from "@radix-ui/react-label"
import { useForm } from "react-hook-form"
// Dev
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { useCreateTag, useGetTag, useUpdateTag } from "@/hooks/tag/useTag";
import { TagFormType } from "@/types";

const categorySchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  slug: z.string().max(30, "Mô tả phải nhiều nhất nhất 30 ký tự").min(1, ("Mô tả không được để trống")),
  description: z.string().optional(),
});

export default function DialogTag({
  active,
  setActive,
  isUpdate,
  selectedId = 0
}: {
  active: boolean
  setActive: (active: boolean) => void,
  isUpdate?: boolean,
  selectedId?: number
}) {
  const { data: categoryData, isLoading } = useGetTag(selectedId);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TagFormType>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
  });
  const createCategory = useCreateTag(() => setActive(false));
  const updateCategory = useUpdateTag(() => setActive(false));
  // Hooks
  useEffect(() => {
    if (isUpdate && categoryData) {
      reset(categoryData);
    }
  }, [isUpdate, categoryData, reset]);
  // Methods
  const onSubmit = (data: TagFormType) => {
    if (isUpdate) {
      updateCategory.mutate({p: {...data}, id: selectedId});
    } else {
      createCategory.mutate(data);
    }
  };
  
  return (
    <>
      <Dialog open={active} onOpenChange={setActive}>
        <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Thêm danh mục</DialogTitle>
            <DialogDescription>
              Đây là một dialog đơn giản sử dụng shadcn/ui.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên danh mục</Label>
                <Input
                  id="name"
                  placeholder="Nhập tên danh mục"
                  type="text"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">Đường dẫn</Label>
                <Input
                  id="slug"
                  placeholder="Nhập đường dẫn"
                  type="text"
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả"
                  rows={4}
                  className="min-h-0"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs">
                    {errors.description.message}
                  </p>
                )}
              </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setActive(false)}>Đóng</Button>
            <Button variant="default" type="submit">Xác nhận</Button>
          </DialogFooter>
        </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
