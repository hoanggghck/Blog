'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, HeartIcon, Share2 } from "lucide-react"

import { convertDate } from "@/utils";
import { useCreateReaction, useGetReactionsByBlog, useGetUserHasReactionBlog, useRemoveReaction } from "@/hooks/reaction/useReaction";
import { useDialog } from "@/provider/dialogLoginProvider";
import type { BlogType } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ContentBlock = ({ blog } : { blog: BlogType }) => {
  const createReaction = useCreateReaction();
  const removeReaction = useRemoveReaction();
  const { openDialog } = useDialog();

  const { data: isReact } = useGetUserHasReactionBlog(blog.id);
  const { data: count } = useGetReactionsByBlog(blog.id);

  const handleLikeBlog = async () => {
    openDialog(() => {
      if (isReact) {
        removeReaction.mutate(blog.id);
      } else {
        createReaction.mutate(blog.id);
      }
    })
  }

  return (
    <>
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
      <div className="bg-card border rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
            <AvatarFallback>{blog.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold text-foreground">{blog.author.name}</h3>
        </div>
      </div>
    </>
  )
}

export default ContentBlock;