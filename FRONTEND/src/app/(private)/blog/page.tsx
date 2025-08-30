"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Upload } from "lucide-react";

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
import TextEditor from "@/components/commons/TextEditor"
import { useCreateBlog } from "@/hooks/blog/useBlog";
import { BlogRequestType } from "@/types";

export default function WritePostPage() {
    const { register, handleSubmit, control, setValue, watch } = useForm({
        defaultValues: {
            title: "",
            slug: "",
            coverImage: null,
            metaTitle: "",
            metaDescription: "",
            categoryId: "",
            tags: [],
            status: "draft",
        },
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const status = watch("status");
    const [stats, setStats] = useState({ words: 0, chars: 0, reading: 0 });
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [tags, setTags] = useState<TagType[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectValue, setSelectValue] = useState('');
    const [content, setContent] = useState('');
    const createBlog = useCreateBlog()
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const catRes = await categoryApi.getList();
            setCategories(catRes.data.result.items); 

            const tagRes = await tagApi.getList();
            setTags(tagRes.data.result.items);
        })();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveTag = (tagIdToRemove: string) => {
        const newTags = selectedTags.filter((tagId) => tagId.toString() !== tagIdToRemove.toString());
        setSelectedTags(newTags);
        setSelectValue("")
    };

    const onSubmit = (data: any) => {
        const payload: BlogRequestType = {
            title: data.title,
            slug: data.slug,
            content: content, // editor content
            categoryId: data.categoryId,
            tagId: selectedTags[0],                 
            status: data.status,
            thumbnail: fileInputRef.current?.files?.[0],
        };

        createBlog.mutate(payload);
    };
    
    const handleSelectTag = (tagId: string) => {
        if (!selectedTags.includes(tagId)) {
            setSelectedTags([...selectedTags, tagId]);
            setSelectValue('');
        }
    };

    return (
        <div className="w-full min-h-screen bg-white p-6">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {/* Left main form */}
                <div className="md:col-span-2 space-y-6">
                    {/* Post Title + Slug */}
                    <Card>
                        <div className="px-6 flex justify-between">
                            <h2 className="text-xl font-semibold">Viết bài của bạn</h2>
                            <div className="flex gap-2">
                                {["published", "draft"]
                                    .sort((a, b) => (a === status ? -1 : b === status ? 1 : 0))
                                    .map((s) => (
                                    <span
                                        key={s}
                                        className={`px-3 py-1 text-sm rounded-full ${
                                        status === s ? "bg-white text-gray-800 border border-gray-300" : "bg-gray-200 text-gray-800"
                                        }`}
                                    >
                                        {s === "published" ? "Công khai" : "Bản nháp"}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <CardContent className="px-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Tiêu đề bài viết</label>
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

                    {/* Cover Image */}
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
                                    <img src={preview} alt="Preview" className="mt-3 w-48 rounded" />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Nội dung */}
                    <TextEditor stats={stats} setStats={setStats} setContent={setContent}/>

                    {/* SEO */}
                    {/* <Card>
                        <CardContent className="px-6 space-y-4">
                            <h3 className="font-semibold">Cài đặt SEO</h3>
                            <Input placeholder="Tiêu đề trang" {...register("metaTitle")} />
                            <Textarea
                                placeholder="Chi tiết trang"
                                {...register("metaDescription")}
                            />
                        </CardContent>
                    </Card> */}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="px-6">
                            <h3 className="font-semibold mb-2">Tình trạng bài viết</h3>
                            <div className="grid grid-cols-2 gap-y-2 w-full">
                                <p className="text-sm">Số lượng từ</p>
                                <p className="text-sm text-right">{stats.words}</p>

                                <p className="text-sm">Thời gian đọc</p>
                                <p className="text-sm text-right">{stats.reading} min</p>

                                <p className="text-sm">Số lượng ký tự</p>
                                <p className="text-sm text-right">{stats.chars}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category & Tags */}
                    <Card>
                        <CardContent className="px-6 space-y-4">
                            <h3 className="font-semibold">Mục & Thẻ</h3>
                            <h4>Mục</h4>
                            <Controller
                                control={control}
                                name="categoryId"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value} >
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
                            <h4>Thẻ</h4>
                            <Select onValueChange={handleSelectTag} value={selectValue}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn thẻ" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tags
                                        .filter(
                                            (tag) => !selectedTags.includes(tag.id.toString())
                                        )
                                        .map((tag) => (
                                            <SelectItem key={tag.id} value={tag.id.toString()}>
                                                {tag.name}
                                            </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Hiển thị tag đã chọn */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedTags.map((tagId) => {
                                    const tag = tags.find((t) => t.id.toString() === tagId);
                                    if (!tag) return null; // Add a check to prevent errors if the tag isn't found
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

                    {/* Cài đặt Publish */}
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
                        </CardContent>
                    </Card>
                </div>
                {/* Thanh Save bar */}
                <div className="fixed bottom-0 left-0 w-full border-t bg-white px-6 py-3 shadow-md">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            ✍️ {stats.words} từ • {stats.reading} phút đọc
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" type="button">
                                Trở về
                            </Button>
                            {/* <Button variant="outline" type="button">
                                Xem trước 
                            </Button> */}
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white " type="submit">Lưu bài</Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
