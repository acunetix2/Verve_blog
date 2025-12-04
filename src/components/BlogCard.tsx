import { Link } from "react-router-dom";
import { Calendar, Clock, Tag, Shield, ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/blog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link to={`/post/${post.slug}`} className="block h-full">
      <Card className="group relative h-full flex flex-col overflow-hidden border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200">
        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-blue-600 text-white border-0 hover:bg-blue-700 text-xs font-medium px-2.5 py-0.5 shadow-sm">
              <Shield className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
        
        <div className="p-5 flex flex-col flex-1">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-slate-500 text-xs font-medium mb-3">
            <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          {/* Title and Description */}
          <div className="flex-1 space-y-2 mb-4">
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 leading-snug">
              {post.title}
            </h3>
            <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          </div>

          {/* Tags (if available) */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs font-normal border-slate-200 text-slate-600 bg-slate-50 px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs font-normal border-slate-200 text-slate-500 bg-slate-50 px-2 py-0.5"
                >
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors mt-auto pt-2 border-t border-slate-100">
            <span>Read article</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>

        {/* Subtle hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/30 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </Link>
  );
};