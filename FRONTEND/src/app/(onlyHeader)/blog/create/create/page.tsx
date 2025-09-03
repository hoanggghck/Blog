"use client";
import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Trash, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

// Dev
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import TextEditor from "@/components/commons/TextEditor";
import { useCreateBlog } from "@/hooks/blog/useBlog";
import { useCategories } from "@/hooks/category/useCategory";
// Type
import type { BlogType } from "@/types";
import { BLOG_STATUS } from "@/const/status";
import { useTag } from "@/hooks/tag/useTag";
import { toSlug } from "@/utils";
import { useDebounce } from "@/hooks/common/debounce";

const initialFormData: BlogType = {
  categoryId: 0,
  content: '',
  slug: '',
  status: BLOG_STATUS.DARFT,
  tagId: 0,
  title: '',
  thumbnail: null
}

export default function WritePostPage() {
  // Form
  const { register, handleSubmit, control, watch, setValue  } = useForm<BlogType>({
    defaultValues: initialFormData,
  });
  // Hooks
  const createBlog = useCreateBlog();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const watchThumbnail = watch("thumbnail");
  const watchTags = watch("tagIds" as any, []); 

   const { data: categories } = useCategories();
   const { data: tags } = useTag();

  // Methods
  const router = useRouter()

  const onSubmit = (values: any) => {
    const payload: BlogType = {
      ...values,
      tagId: values.tagIds?.[0] ?? null, 
    };
    createBlog.mutate(payload);
  };

  const onChangeSlug = useDebounce((title: string) => {
    setValue("title", title);
    setValue("slug", toSlug(title), { shouldValidate: true });
  }, 500);

  return (
    <div className="w-full min-h-screen bg-white p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="px-6 flex justify-between">
              <h2 className="text-xl font-semibold">Viết bài của bạn</h2>
            </div>
            <CardContent className="px-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiêu đề bài viết
                </label>
                <Input
                  placeholder="Enter your post title..."
                  {...register("title")}
                  onChange={(e) => onChangeSlug(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">/post/</span>
                  <Input 
                    placeholder="post-url-slug" 
                    {...register("slug")}
                    onChange={(e) => {
                      const clean = toSlug(e.target.value);
                      setValue("slug", clean, { shouldValidate: true });
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Controller
            control={control}
            name="content"
            render={({ field }) => <TextEditor setContent={field.onChange} />}
          />
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="px-6 space-y-4">
              <h3 className="font-semibold">Cài đặt công khai</h3>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select  onValueChange={(val) => field.onChange(Number(val) as BLOG_STATUS)} value={field.value?.toString()}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BLOG_STATUS.DARFT.toString()}>Bản nháp</SelectItem>
                      <SelectItem value={BLOG_STATUS.PUBLISH.toString()}>Công khai</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {categories &&
                <>
                  <h3 className="font-semibold flex items-center gap-2">
                    Mục
                  </h3>
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                        <Select  onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : ""} >
                      <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn mục" />
                      </SelectTrigger>
                      <SelectContent>
                          {categories.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                          </SelectItem>
                          ))}
                      </SelectContent>
                      </Select>
                  )}
                  />
                </>
              }
              {tags && (
                <>
                  <h3 className="font-semibold">Thẻ</h3>
                  <Select
                    onValueChange={(tagId) =>
                      setValue("tagIds" as any, [...watchTags, Number(tagId)])
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn thẻ" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags
                        .filter((tag) => !watchTags.includes(tag.id))
                        .map((tag) => (
                          <SelectItem key={tag.id} value={tag.id.toString()}>
                            {tag.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchTags.map((tagId: number) => {
                      const tag = tags.find((t) => t.id === tagId);
                      if (!tag) return null;
                      return (
                        <span
                          key={tagId}
                          className="px-2 py-1 text-sm rounded-full bg-gray-200 flex items-center gap-1"
                        >
                          #{tag.name}
                          <button
                            type="button"
                            onClick={() =>
                              setValue(
                                "tagIds" as any,
                                watchTags.filter((id: number) => id !== tagId)
                              )
                            }
                          >
                            &times;
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="px-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                Hình ảnh
              </h3>
              <Controller
                control={control}
                name="thumbnail"
                render={({ field }) => (
                    <div className="border-2 border-dashed rounded-md p-4 text-gray-500 relative">
                    {!watchThumbnail ? (
                        <div
                        className="flex flex-col items-center justify-center text-center cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                        >
                        <Upload className="h-6 w-6 mb-2" />
                        <p>Tải lên ảnh bìa cho bài viết của bạn.</p>
                        <Button
                            variant="outline"
                            className="mt-3 cursor-pointer"
                            type="button"
                        >
                            Chọn hình
                        </Button>
                        <Input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            field.onChange(file);
                            }}
                        />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 cursor-pointer"
                            onClick={() => field.onChange(null)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                        <img
                            src={URL.createObjectURL(watchThumbnail as File)}
                            alt="Preview"
                            className="w-48 rounded"
                        />
                        </div>
                    )}
                    </div>
                )}
                />
            </CardContent>
          </Card>
        </div>
        <div className="fixed bottom-0 left-0 w-full border-t bg-white px-6 py-3 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-end items-center">
            <div className="flex gap-3">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Trở về
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white "
                type="submit"
              >
                Lưu bài
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
