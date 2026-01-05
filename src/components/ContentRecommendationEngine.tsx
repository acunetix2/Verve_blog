import React, { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  Heart,
  Clock,
  Eye,
  Tag,
  ArrowRight,
  Loader,
  Zap,
  BookmarkPlus,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecommendedPost {
  _id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  views: number;
  likes: number;
  readTime: string;
  matchScore: number;
  matchReason: string;
  category?: string;
  thumbnail?: string;
}

interface RecommendationReason {
  type: "similar_topic" | "trending" | "author_follow" | "read_history" | "tag_match";
  label: string;
  description: string;
}

const ContentRecommendationEngine: React.FC<{
  currentPostId?: string;
  limit?: number;
  variant?: "card" | "list" | "carousel";
}> = ({ currentPostId, limit = 6, variant = "card" }) => {
  const [recommendations, setRecommendations] = useState<RecommendedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [currentPostId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("limit", limit.toString());
      if (currentPostId) {
        params.append("postId", currentPostId);
      }

      const response = await axios.get(
        `/api/recommendations/personalized?${params}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRecommendations(response.data);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
    toast.success("Recommendations refreshed!");
  };

  const getMatchReasonColor = (reason: string) => {
    switch (reason) {
      case "similar_topic":
        return "bg-blue-100 text-blue-700";
      case "trending":
        return "bg-orange-100 text-orange-700";
      case "author_follow":
        return "bg-purple-100 text-purple-700";
      case "read_history":
        return "bg-green-100 text-green-700";
      case "tag_match":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getMatchReasonIcon = (reason: string) => {
    switch (reason) {
      case "similar_topic":
        return <Tag size={14} />;
      case "trending":
        return <TrendingUp size={14} />;
      case "author_follow":
        return <Zap size={14} />;
      case "read_history":
        return <Eye size={14} />;
      case "tag_match":
        return <Heart size={14} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className={variant === "list" ? "h-24 rounded-lg" : "h-48 rounded-lg"} />
        <Skeleton className={variant === "list" ? "h-24 rounded-lg" : "h-48 rounded-lg"} />
        <Skeleton className={variant === "list" ? "h-24 rounded-lg" : "h-48 rounded-lg"} />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Sparkles className="mx-auto text-gray-400 mb-2" size={32} />
        <p className="text-gray-600">No recommendations available yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Keep reading to get personalized recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">
            Recommended For You
          </h2>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          {refreshing ? (
            <>
              <Loader className="mr-2 animate-spin" size={16} />
              Refreshing...
            </>
          ) : (
            <>
              <Zap size={16} className="mr-1" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Recommendations Grid/List */}
      {variant === "list" ? (
        /* List View */
        <div className="space-y-3">
          {recommendations.map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className="group flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex-shrink-0">
                    <Sparkles size={12} />
                    {post.matchScore}%
                  </div>
                </div>
                <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                  {post.matchReason}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    {post.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={12} />
                    {post.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : variant === "carousel" ? (
        /* Carousel View */
        <div className="overflow-x-auto pb-4 -mx-6 px-6">
          <div className="flex gap-4 min-w-min">
            {recommendations.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post.slug}`}
                className="group flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all"
              >
                {post.thumbnail && (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getMatchReasonColor(
                      post.matchReason
                    )}`}>
                      {getMatchReasonIcon(post.matchReason)}
                      {post.matchReason}
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                      <Sparkles size={12} />
                      {post.matchScore}%
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      {post.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className="group h-full flex flex-col bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden"
            >
              {post.thumbnail && (
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold">
                    <Sparkles size={12} />
                    {post.matchScore}%
                  </div>
                </div>
              )}

              <div className="flex-1 p-4 flex flex-col">
                {/* Match Badge */}
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium w-fit mb-3 ${getMatchReasonColor(
                  post.matchReason
                )}`}>
                  {getMatchReasonIcon(post.matchReason)}
                  <span className="capitalize">{post.matchReason.replace(/_/g, " ")}</span>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 mb-4 flex-1">
                  {post.description}
                </p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      {post.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={12} />
                      {post.likes}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </div>
                </div>

                {/* CTA */}
                <Button
                  className="w-full mt-4 gap-2"
                  variant="outline"
                  size="sm"
                >
                  Read More <ArrowRight size={14} />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
        <Sparkles className="text-purple-600 flex-shrink-0 mt-1" size={20} />
        <div>
          <p className="text-sm font-medium text-purple-900 mb-1">
            Smart Recommendations
          </p>
          <p className="text-xs text-purple-700">
            These recommendations are personalized based on your reading history, interests, and engagement patterns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentRecommendationEngine;
