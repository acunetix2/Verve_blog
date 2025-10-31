import { Link } from "react-router-dom";
import { Calendar, Clock, Tag } from "lucide-react";
import { BlogPost } from "@/lib/blog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link to={`/post/${post.slug}`}>
      <Card className="group relative overflow-hidden border-border bg-card hover:border-white transition-all duration-300 hover:shadow-glow">
        {post.featured && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gray text-white border-white/50 hover:text-primary font-mono text-xs">
              FEATURED
            </Badge>
          </div>
        )}
        
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 text-white text-semibold text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </span>
          </div>

          <div>
            <h3 className="text-xl text-white font-display font-semibold text-foreground group-hover:text-blue-300 transition-colors mb-2">
              {post.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {post.description}
            </p>
          </div>

          <div className="flex flex-wrap text-white gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="font-mono text-xs border-border  hover:bg-muted/50 transition-colors"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          <div className="pt-2 text-sm font-mono text-white text-muted-foreground group-hover:text-primary transition-colors">
            Read more →
          </div>
        </div>

        {/* Scanline effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none scanline" />
      </Card>
    </Link>
  );
};
