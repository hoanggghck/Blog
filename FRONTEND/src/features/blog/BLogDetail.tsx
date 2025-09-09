'use client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  Calendar,
  ThumbsUp,
  Zap
} from "lucide-react";
import { useState } from "react";
import { BlogType } from "@/types";

export default function BlogDetail({blog} : { blog: BlogType}) {

  if (!blog) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-foreground mb-4">blog Not Found</h1>
        <p className="text-muted-foreground">The blog you're looking for doesn't exist.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };


  return (
    <article className="max-w-4xl mx-auto">
      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="secondary">{blog.category.name}</Badge>
          <div className="flex items-center text-muted-foreground text-sm gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(blog.createdAt)}
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
              <p className="text-sm text-muted-foreground">Author & Developer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              Follow
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8">
        <img
          src={blog.thumbnailUrl}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: blog.content }}>
        
      </div>

      {/* Reaction Bar */}
      <div className="bg-muted/30 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">

          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Comment
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Author Bio */}
      <div className="bg-card border rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
            <AvatarFallback>{blog.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2">{blog.author.name}</h3>
            <div className="flex items-center gap-3">
              <Button size="sm">Follow</Button>
              <Button variant="outline" size="sm">View Profile</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Comments (12)</h3>
        
        {/* Comment Form */}
        <div className="mb-8">
          <textarea
            placeholder="Share your thoughts..."
            className="w-full p-4 border border-border rounded-lg bg-background resize-none"
            rows={4}
          />
          <div className="flex justify-end mt-3">
            <Button>blog Comment</Button>
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        {/* Sample Comments */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={`https://images.unsplash.com/photo-150000000${i}?w=40&h=40&fit=crop&crop=face`} />
                <AvatarFallback>U{i}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-foreground">User {i}</span>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <p className="text-muted-foreground mb-3">
                  Great article! This really helped me understand the concepts better. 
                  Looking forward to more content like this.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-3 h-3 mr-1" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm">
                    Reply
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
