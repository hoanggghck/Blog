import Link from "next/link";
import Image from "next/image";
import React from "react";
// Dev
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Type
import { BlogType } from "@/types";
interface BlogCardProps {
  featured?: boolean;
  post: BlogType;
}

const BlogCard = React.memo(function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}-${post.id}`} className="group block ">
      <article className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border h-full group">
        <div className="group">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              quality={70}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="text-xs">
              {post.category.name}
            </Badge>
          </div>
          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <Avatar className="cursor-pointer">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
              <span className="text-xs font-medium">{post.author.name}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
});

export default BlogCard;
