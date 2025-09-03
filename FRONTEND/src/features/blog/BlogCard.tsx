import { Badge } from "@/components/ui/badge";
import { BlogType } from "@/types";
import { Clock, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

interface BlogCardProps {
  featured?: boolean;
  post: BlogType;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link href={`/blog/${post.slug}-${post.id}`} className="group block">
      <article className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
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
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-xs font-medium">{post.author.name}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}