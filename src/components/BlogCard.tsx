import { Link } from "react-router-dom";
import { Calendar, Clock, Tag, Shield } from "lucide-react";
import { BlogPost } from "@/lib/blog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link to={`/post/${post.slug}`}>
      <Card className="group relative overflow-hidden border-cyan-500/30 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
        {post.featured && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400/50 hover:from-cyan-500 hover:to-blue-500 font-mono text-xs shadow-lg shadow-cyan-500/30">
              <Shield className="h-3 w-3 mr-1" />
              FEATURED
            </Badge>
          </div>
        )}
        
        <div className="p-6 space-y-4">
          {/* Date and Read Time */}
          <div className="flex items-center gap-4 text-cyan-400/80 text-semibold text-xs font-mono">
            <span className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="text-xl text-white font-display font-semibold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-300 mb-2">
              {post.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          </div>

          {/* Read More Link */}
          <div className="pt-2 text-sm font-mono text-cyan-400 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
            <span>Read more</span>
            <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* Scanline effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan" />
        </div>

        {/* Bottom glow line on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </Link>
  );
};