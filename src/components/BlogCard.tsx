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
      <Card className="group relative h-full flex flex-col overflow-hidden border-red-600/20 bg-gray-800 hover:border-red-600/50 hover:shadow-2xl transition-all duration-300">
        {/* Card Header with red gradient */}
        <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 flex-shrink-0"></div>
        
        <div className="p-5 flex flex-col flex-1">
          {/* Featured Badge */}
          {post.featured && (
            <div className="mb-3">
              <Badge className="bg-red-600 text-white border-0 hover:bg-red-700 text-xs font-medium px-2.5 py-0.5 shadow-sm">
                <Shield className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}
          
          {/* Metadata */}
          <div className="flex items-center gap-3 text-gray-400 text-xs font-medium mb-3">
            <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          {/* Title and Description */}
          <div className="flex-1 space-y-2 mb-4">
            <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors duration-200 leading-snug">
              {post.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
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
                  className="text-xs font-normal border-red-600/30 text-red-500 bg-red-900/20 px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs font-normal border-red-600/30 text-red-400 bg-red-900/20 px-2 py-0.5"
                >
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-sm font-medium text-orange-500 group-hover:text-orange-400 transition-colors mt-auto pt-3 border-t border-gray-700">
            <span>Read article</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>

        {/* Subtle hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </Link>
  );
};