'use client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Share2,
  Calendar,
  ThumbsUp,
  Reply,
  HeartIcon
} from "lucide-react";
import { BlogType } from "@/types";
import { convertDate, timeAgo } from "@/utils";
import { useCreateReaction, useGetUserHasReactionBlog, useGetReactionsByBlog, useRemoveReaction } from "@/hooks/reaction/useReaction";
import { useCreateComment, useGetComment } from "@/hooks/comment/useComment";
import { useState } from "react";

export default function BlogDetail({blog} : { blog: BlogType}) {
  
  if (!blog) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy</h1>
        <p className="text-muted-foreground">Bài viết này không tồn tại.</p>
      </div>
    );
  }
  const [content, setContent] = useState<string>('')
  const createComment = useCreateComment();
  const createReaction = useCreateReaction();
  const removeReaction = useRemoveReaction();
  // const { data: isReact } = useGetUserHasReactionBlog(blog.id);
  const isReact = false;
  const { data: comments } = useGetComment(blog.id);
  const {data: count} = useGetReactionsByBlog(blog.id);
  
  const handleLikeBlog = async () => {
    // if (isReact) {
    //   removeReaction.mutate(blog.id);
    // } else {
    //   createReaction.mutate(blog.id);
    // }
  }

  const handleCreateComment = () => {
    createComment.mutate({
      content,
      blogId: blog.id,
    },
    {
      onSuccess: () => {
        setContent('');
      },
    });
  }

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="secondary">{blog.category.name}</Badge>
          <div className="flex items-center text-muted-foreground text-sm gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {convertDate(blog.createdAt)}
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
          {blog.title}
        </h1>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
              <AvatarFallback>{blog.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{blog.author.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="lg" onClick={handleLikeBlog}>
              <HeartIcon className={isReact ? " fill-red-500 text-red-500" : ""} />
              { count }
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="mr-2" />
              Chia sẻ
            </Button>
          </div>
        </div>
      </header>

      <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8">
        <img
          src={blog.thumbnailUrl}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
      <div className="py-5">
        
      </div>
      <div className="bg-card border rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
            <AvatarFallback>{blog.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold text-foreground">{blog.author.name}</h3>
          {/* <div className="flex-1">
            <div className="flex items-center gap-3">
              <Button size="sm">Theo dõi</Button>
              <Button variant="outline" size="sm">Xem thông tin</Button>
            </div>
          </div> */}
        </div>
      </div>
      <div className="bg-card md:border rounded-xl md:p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Bình luận {comments?.length ? `(${comments.length})` : ''}</h3>
        <div className="mb-8">
          <textarea
            placeholder="Share your thoughts..."
            className="w-full p-4 border border-border rounded-lg bg-background resize-none"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end mt-3">
            <Button onClick={() => handleCreateComment()}>Bình luận</Button>
          </div>
        </div>
        <Separator className="mb-6" />
        <div className="space-y-6">
          {comments && comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={comment.user.avatar ?? ''} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-foreground">{comment.user.name}</span>
                  <span className="text-sm text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-muted-foreground mb-3">
                  {comment.content}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    Thích
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Reply className="w-3 h-3 mr-1" />
                    Trả lời
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
