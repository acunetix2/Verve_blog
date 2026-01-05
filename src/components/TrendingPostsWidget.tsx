import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Flame,
  Star,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  ArrowRight,
  Tag,
  Calendar,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface TrendingPost {
  _id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  views: number;
  likes: number;
  comments: number;
  readTime: string;
  date: string;
  tags: string[];
  trendScore: number;
  category?: string;
  trending: boolean;
  momentum: "rising" | "stable" | "declining";
}

interface TrendingWidgetProps {
  limit?: number;
  showCategory?: boolean;
  variant?: "compact" | "detailed";
}

const TrendingPostsWidget: React.FC<TrendingWidgetProps> = ({
  limit = 5,
  showCategory = true,
  variant = "detailed",
}) => {
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchTrendingPosts();
  }, [selectedCategory]);

  const fetchTrendingPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("limit", limit.toString());
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      const response = await axios.get(`/api/posts/trending?${params}`);
      setTrendingPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch trending posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMomentumColor = (momentum: string) => {
    switch (momentum) {
      case "rising":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const CompactPost = ({ post, index }: { post: TrendingPost; index: number }) => (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </p>
        <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Eye size={12} />
            <span>{post.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={12} />
            <span>{post.likes}</span>
          </div>
        </div>
      </div>
      <Flame className={`flex-shrink-0 ${getMomentumColor(post.momentum)}`} size={16} />
    </Link>
  );

  const DetailedPost = ({ post, index }: { post: TrendingPost; index: number }) => (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden"
    >
      <div className="p-6">
        {/* Header with rank and trend */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              #{index + 1}
            </div>
            <div className="flex items-center gap-1">
              {post.trending && <TrendingUp size={14} className="text-orange-500" />}
              <span className="text-xs font-semibold text-orange-600">Trending</span>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            post.momentum === "rising"
              ? "bg-green-100 text-green-700"
              : post.momentum === "declining"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}>
            {post.momentum === "rising" && <TrendingUp size={12} />}
            {post.momentum === "declining" && <TrendingUp size={12} className="rotate-180" />}
            <span>{post.momentum}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.description}</p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{post.views.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={14} />
            <span>{post.likes} likes</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare size={14} />
            <span>{post.comments} comments</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Clock size={14} />
            <span>{post.readTime} read</span>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-600">By {post.author}</span>
          <div className="flex items-center gap-1 text-xs text-blue-600 group-hover:text-blue-700 font-medium">
            Read More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={`space-y-4 ${variant === "compact" ? "space-y-2" : ""}`}>
          {Array(limit)
            .fill(0)
            .map((_, i) => (
              <Skeleton
                key={i}
                className={variant === "compact" ? "h-20 rounded-lg" : "h-48 rounded-lg"}
              />
            ))}
        </div>
      ) : trendingPosts.length > 0 ? (
        variant === "compact" ? (
          /* Compact View */
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {trendingPosts.map((post, idx) => (
                <CompactPost key={post._id} post={post} index={idx} />
              ))}
            </div>
            <Link
              to="/blog"
              className="flex items-center justify-center gap-2 w-full p-4 text-center text-blue-600 hover:text-blue-700 font-medium border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Detailed View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingPosts.map((post, idx) => (
              <DetailedPost key={post._id} post={post} index={idx} />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No trending posts yet</p>
        </div>
      )}

      {/* CTA Section */}
      {!loading && trendingPosts.length > 0 && variant === "detailed" && (
        <div className="mt-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Explore All Articles <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default TrendingPostsWidget;
