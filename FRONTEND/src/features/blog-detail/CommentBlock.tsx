'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea"
import { useCreateComment, useGetComment } from "@/hooks/comment/useComment";
import { useDialog } from "@/provider/dialogLoginProvider";
import { useAuthenStore } from "@/stores/useAuthenStore";
import { timeAgo } from "@/utils";
import { Reply, ThumbsUp } from "lucide-react";
import { useState } from "react";
type PropsType = {
  blogId: number;
}

const CommentBlock = ({ blogId }: PropsType) => {
  const [content, setContent] = useState<string>('');
  const { isAuthorize } = useAuthenStore();
  const { openDialog } = useDialog();

  const createComment = useCreateComment();
  const { data: comments } = useGetComment(blogId);
  const handleCreateComment = () => {
    createComment.mutate({
      content,
      blogId: blogId,
    },
    {
      onSuccess: () => {
        setContent('');
      },
    });
  }
  if (!blogId) return <p>Ko có dữ liệu hiển thị</p>
  return (
    <div className="bg-card md:border rounded-xl md:p-6">
      <h3 className="text-xl font-bold text-foreground mb-6">Bình luận {comments?.length ? `(${comments.length})` : ''}</h3>
      <div className="mb-8">
        <Textarea
          placeholder="Share your thoughts..."
          className="w-full p-4 border border-border rounded-lg bg-background resize-none"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!isAuthorize}
        />
        <div className="flex justify-end mt-3">
          <Button onClick={() => openDialog(handleCreateComment)}>Bình luận</Button>
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
  )
}

export default CommentBlock;