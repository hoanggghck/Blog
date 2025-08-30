"use client";
import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Upload } from "lucide-react";
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
import { categoryApi } from "@/apis/category";
import { tagApi } from "@/apis/tag";
import { CategoryType } from "@/types/category";
import { TagType } from "@/types/tag";
import TextEditor from "@/components/commons/TextEditor";
import { useCreateBlog } from "@/hooks/blog/useBlog";
import { useCategories } from "@/hooks/category/useCategory";
// Type
import type { BlogType } from "@/types";
import { BLOG_STATUS } from "@/const/status";
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
  const { register, handleSubmit, control,  } = useForm({
    defaultValues: initialFormData,
  });
  // Hooks
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tags, setTags] = useState<TagType[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectValue, setSelectValue] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogType>();
  const createBlog = useCreateBlog();

   const { data: categories } = useCategories();

  useEffect(() => {
    (async () => {
      const tagRes = await tagApi.getList();
      setTags(tagRes.data.result.items);
    })();
  }, []);

  // Methods
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveTag = (tagIdToRemove: string) => {
    const newTags = selectedTags.filter(
      (tagId) => tagId.toString() !== tagIdToRemove.toString()
    );
    setSelectedTags(newTags);
    setSelectValue("");
  };

  const onSubmit = () => {
    // const payload: BlogType = {
    //   title: data.title,
    //   slug: data.slug,
    //   content: content, // editor content
    //   categoryId: data.categoryId,
    //   tagId: selectedTags[0],
    //   status: data.status,
    //   thumbnail: fileInputRef.current?.files?.[0],
    // };

    createBlog.mutate(formData);
  };

  const handleSelectTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
      setSelectValue("");
    }
  };

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
                <label className="block text-sm font-medium">
                  Tiêu đề bài viết
                </label>
                <Input
                  placeholder="Enter your post title..."
                  {...register("title")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">/post/</span>
                  <Input placeholder="post-url-slug" {...register("slug")} />
                </div>
              </div>
            </CardContent>
          </Card>
          <TextEditor
            setContent={setContent}
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="published">Công khai</SelectItem>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
              <h3 className="font-semibold flex items-center gap-2">
                Thẻ
              </h3>
              <Select onValueChange={handleSelectTag} value={selectValue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn thẻ" />
                </SelectTrigger>
                <SelectContent>
                  {tags
                    .filter((tag) => !selectedTags.includes(tag.id.toString()))
                    .map((tag) => (
                      <SelectItem key={tag.id} value={tag.id.toString()}>
                        {tag.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tagId) => {
                  const tag = tags.find((t) => t.id.toString() === tagId);
                  if (!tag) return null;
                  return (
                    <span
                      key={tagId}
                      className="px-2 py-1 text-sm rounded-full bg-gray-200 flex items-center gap-1"
                    >
                      #{tag.name}
                      <button
                        onClick={() => handleRemoveTag(tagId)}
                        className="text-gray-500 hover:text-gray-800 focus:outline-none cursor-pointer"
                      >
                        &times;
                      </button>
                    </span>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="px-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                Hình ảnh
              </h3>
              <div
                className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center text-gray-500 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 mb-2" />
                <p>Tải lên ảnh bìa cho bài viết của bạn.</p>
                <Button variant="outline" className="mt-3" type="button">
                  Chọn hình
                </Button>
                <Input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                  onChange={handleFileChange}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-3 w-48 rounded"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="fixed bottom-0 left-0 w-full border-t bg-white px-6 py-3 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex gap-3">
              <Button variant="outline" type="button">
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
