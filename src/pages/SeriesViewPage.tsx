import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BookOpen, ArrowRight, Eye } from "lucide-react";
import { toast } from "sonner";

interface Post {
  _id: string;
  title: string;
  slug: string;
  description: string;
  seriesOrder: number;
  views: number;
  createdAt: string;
}

interface Series {
  _id: string;
  title: string;
  description: string;
  slug: string;
  author: { name: string };
  posts: Post[];
  views: number;
  category: string;
}

const SeriesViewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeries();
  }, [slug]);

  const fetchSeries = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/series/${slug}`
      );
      setSeries(response.data);
    } catch (error) {
      toast.error("Failed to load series");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-400">Loading series...</p>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 text-lg">Series not found</p>
        </div>
      </div>
    );
  }

  const sortedPosts = [...series.posts].sort((a, b) => a.seriesOrder - b.seriesOrder);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-red-600/20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-orange-500" size={32} />
            <span className="text-sm font-semibold text-orange-400 bg-orange-900/20 px-3 py-1 rounded-full border border-orange-600/30">
              {series.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{series.title}</h1>
          <p className="text-lg text-gray-400 mb-6">{series.description}</p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Eye size={18} className="text-gray-500" />
              {series.views.toLocaleString()} views
            </span>
            <span>By {series.author?.name}</span>
            <span>{series.posts.length} articles</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {sortedPosts.length === 0 ? (
          <div className="bg-gray-800 rounded-lg border border-red-600/20 p-12 text-center">
            <BookOpen className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 text-lg">No posts in this series yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPosts.map((post, index) => (
              <div
                key={post._id}
                className="bg-gray-800 rounded-2xl border border-red-600/20 p-6 hover:border-red-600/50 hover:shadow-lg transition-all shadow-lg"
              >
                <div className="flex items-start gap-6">
                  {/* Series Order Number */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye size={16} /> {post.views} views
                      </span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Read Button */}
                  <div className="flex-shrink-0">
                    <a
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all"
                    >
                      Read <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Series List */}
        <div className="mt-12 pt-8 border-t border-red-600/20">
          <a
            href="/series"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-medium"
          >
            ← Back to all series
          </a>
        </div>
      </div>
    </div>
  );
};

export default SeriesViewPage;
