'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Heading,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
} from 'lucide-react';
import StarterKit from "@tiptap/starter-kit";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }
    return (
        <div className="flex items-center gap-1 border-b p-2">
            {/* Bold, Italic, Underline */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-muted' : ''}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-muted' : ''}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'bg-muted' : ''}
            >
                <Underline className="h-4 w-4" />
            </Button>

            {/* Heading */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
            >
                <Heading className="h-4 w-4" />
            </Button>

            {/* Lists */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-muted' : ''}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-muted' : ''}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>

            {/* Quote & Code */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'bg-muted' : ''}
            >
                <Quote className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'bg-muted' : ''}
            >
                <Code className="h-4 w-4" />
            </Button>

            {/* Link & Image */}
            <Button variant="ghost" size="sm" onClick={() => {}}>
                <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => {}}>
                <ImageIcon className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default function TextEditor({stats, setStats}: {
        stats: { words: number; chars: number; reading: number };
        setStats: (val: { words: number; chars: number; reading: number }) => void;
    }) {

    const [content, setContent] = useState('');
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => setIsMounted(true), []);

    const editor = useEditor({
        extensions: [
            StarterKit
        ],
        content: "Bắt đầu viết bài của bạn",
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const text = editor.getText();
            const words = text.trim().split(/\s+/).filter(Boolean).length;
            const chars = text.length;
            const reading = Math.ceil(words / 200); // 200 words/min

            setContent(html);
            setStats({ words, chars, reading });
        },
        editorProps: {
            attributes: {
                class:
                    "w-full min-h-[200px] bg-background text-sm focus:outline-none [&>p]:m-0 [&>p]:leading-relaxed",
            },
        },
    immediatelyRender: false, }, 
    [isMounted]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Nội dung</CardTitle>
            </CardHeader>
            <CardContent className="px-6 space-y-2">
                <MenuBar editor={editor} />
                <div className="min-h-[200px] p-2">
                    <EditorContent 
                        editor={editor}
                        className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm 
                        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                        [&>p]:m-0 [&>p]:leading-relaxed"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
