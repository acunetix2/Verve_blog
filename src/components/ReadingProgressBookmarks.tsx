import React, { useState, useEffect } from "react";
import {
  Bookmark,
  BookOpen,
  Clock,
  CheckCircle2,
  Trash2,
  Eye,
  Heart,
  Share2,
  ChevronRight,
  Calendar,
  Tag,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface SavedArticle {
  _id: string;
  postId: string;
  title: string;
  slug: string;
  author: string;
  readTime: string;
  date: string;
  savedAt: string;
  readingProgress: number;
  totalWords: number;
  wordsRead: number;
  status: "unread" | "reading" | "completed";
  estimatedTimeLeft: number;
}

interface ReadingHistory {
  postId: string;
  title: string;
  slug: string;
  readAt: string;
  progress: number;
}

interface BookmarksSection {
  userId: string;
  savedArticles: SavedArticle[];
  readingHistory: ReadingHistory[];
  totalSaved: number;
  totalRead: number;
}

const ReadingProgressBookmarks: React.FC = () => {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"saved" | "history">("saved");
  const [filter, setFilter] = useState<"all" | "unread" | "reading" | "completed">("all");

  useEffect(() => {
    fetchBookmarksData();
  }, []);

  const fetchBookmarksData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/bookmarks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedArticles(response.data.savedArticles || []);
      setReadingHistory(response.data.readingHistory || []);
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
      toast.error("Failed to load bookmarks");
      setSavedArticles([]);
      setReadingHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (articleId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/bookmarks/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedArticles((prev) =>
        prev.filter((article) => article._id !== articleId)
      );
      toast.success("Bookmark removed");
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  const updateReadingProgress = async (articleId: string, progress: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/bookmarks/${articleId}/progress`,
        { progress },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedArticles((prev) =>
        prev.map((article) =>
          article._id === articleId
            ? { ...article, readingProgress: progress }
            : article
        )
      );
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const clearReadingHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/bookmarks/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReadingHistory([]);
      toast.success("Reading history cleared");
    } catch (error) {
      console.error("Failed to clear history:", error);
      toast.error("Failed to clear history");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "reading":
        return "bg-blue-100 text-blue-800";
      case "unread":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={16} />;
      case "reading":
        return <Eye size={16} />;
      case "unread":
        return <BookOpen size={16} />;
      default:
        return null;
    }
  };

  const filteredArticles = savedArticles.filter((article) => {
    if (filter === "all") return true;
    return article.status === filter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Reading Library</h1>
        <p className="text-blue-100">Manage your saved articles and reading progress</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Articles Saved</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {savedArticles.length}
              </p>
            </div>
            <Bookmark className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Articles Read</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {savedArticles.filter((a) => a.status === "completed").length}
              </p>
            </div>
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Reading Now</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {savedArticles.filter((a) => a.status === "reading").length}
              </p>
            </div>
            <Eye className="text-orange-600" size={32} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "saved"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BookOpen className="inline mr-2" size={18} />
            Saved Articles ({savedArticles.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "history"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Clock className="inline mr-2" size={18} />
            Reading History
          </button>
        </div>

        <div className="p-6">
          {/* Saved Articles Tab */}
          {activeTab === "saved" ? (
            <div className="space-y-4">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["all", "unread", "reading", "completed"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                      filter === f
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-32 rounded-lg" />
                    ))}
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <Link
                      key={article._id}
                      to={`/blog/${article.slug}`}
                      className="group block bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                article.status
                              )}`}
                            >
                              {getStatusIcon(article.status)}
                              {article.status}
                            </span>
                            {article.status === "completed" && (
                              <span className="text-xs text-green-600 font-medium">
                                ✓ Completed
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeBookmark(article._id);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Reading Progress</span>
                          <span className="font-medium">
                            {article.readingProgress}%
                          </span>
                        </div>
                        <Progress
                          value={article.readingProgress}
                          className="h-2"
                        />
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {article.readTime} read
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          Saved {new Date(article.savedAt).toLocaleDateString()}
                        </div>
                        {article.estimatedTimeLeft > 0 && (
                          <div className="flex items-center gap-1 ml-auto text-orange-600">
                            <AlertCircle size={14} />
                            {article.estimatedTimeLeft} mins left
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Bookmark className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-600">
                    No {filter !== "all" ? filter : ""} articles saved yet
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Save articles to read them later
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Reading History Tab */
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-20 rounded-lg" />
                    ))}
                </div>
              ) : readingHistory.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600 text-sm">
                      {readingHistory.length} articles in history
                    </p>
                    <Button
                      onClick={clearReadingHistory}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 border-red-200"
                    >
                      Clear History
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {readingHistory.map((item, idx) => (
                      <Link
                        key={idx}
                        to={`/blog/${item.slug}`}
                        className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Read on {new Date(item.readAt).toLocaleDateString()}{" "}
                            at {new Date(item.readAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">
                            {item.progress}%
                          </span>
                          <ChevronRight
                            size={18}
                            className="text-gray-400 group-hover:text-blue-600 transition-colors"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Clock className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-600">No reading history yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Start reading articles to see your history
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingProgressBookmarks;
