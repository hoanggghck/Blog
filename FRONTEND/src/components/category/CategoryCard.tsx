import { ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

import type { CategoryBlogType } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CategoryCard({ cat }: { cat: CategoryBlogType }) {
  
  return (
    <Link href={`blog?category_id=${cat.id}`}>
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle style={{ "--hover-color": cat.color } as React.CSSProperties} className="text-xl group-hover:text-[var(--hover-color)] transition-colors">
                  {cat.name}
                </CardTitle>
              </div>
              <Badge className='text-xs' style={{ backgroundColor: cat.color }}>
                {cat.count} bài viết
              </Badge>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {cat.description}
          </p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              Updated today
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
