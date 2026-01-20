import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Calendar,
  TrendingUp,
  Eye,
  Heart,
  Clock,
  ArrowUpDown,
  Tag,
  BookOpen,
  FileText,
  Zap,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResult {
  _id: string;
  title: string;
  description: string;
  type: "post" | "course" | "lesson" | "document";
  date: string;
  tags?: string[];
  views?: number;
  likes?: number;
  readTime?: string;
  category?: string;
  author?: string;
  slug?: string;
  difficulty?: string;
  duration?: string;
  image?: string;
}

interface SearchFilters {
  query: string;
  contentType: "all" | "post" | "course" | "lesson" | "document";
  category?: string;
  tags?: string[];
  sortBy: "relevance" | "date" | "views" | "likes";
  dateRange?: "week" | "month" | "3months" | "year" | "all";
  minViews?: number;
}

const AdvancedSearchSystem: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    contentType: "all",
    sortBy: "relevance",
    dateRange: "all",
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const resultsPerPage = 10;

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    if (filters.query.length > 0) {
      searchPosts();
    } else {
      setResults([]);
    }
  }, [filters, selectedTags, currentPage]);

  const fetchFiltersData = async () => {
    try {
      const response = await axios.get("/api/posts/search/filters");
      setCategories(response.data.categories || []);
      setAllTags(response.data.tags || []);
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
    }
  };

  const searchPosts = useCallback(async () => {
    if (filters.query.trim().length === 0) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("q", filters.query);
      params.append("sort", filters.sortBy);
      params.append("contentType", filters.contentType);
      
      if (filters.category) params.append("category", filters.category);
      if (filters.dateRange && filters.dateRange !== "all") {
        params.append("dateRange", filters.dateRange);
      }
      if (selectedTags.length > 0) {
        params.append("tags", selectedTags.join(","));
      }
      params.append("page", currentPage.toString());
      params.append("limit", resultsPerPage.toString());

      // Search across all content types
      const endpoint = filters.contentType === "all" 
        ? `/api/search/all?${params}` 
        : `/api/posts/search?${params}`;
      
      const response = await axios.get(endpoint);
      setResults(response.data.results || response.data.posts || []);
      setTotalResults(response.data.total || 0);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [filters, selectedTags, currentPage]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      sortBy: "relevance",
      dateRange: "all",
    });
    setSelectedTags([]);
    setCurrentPage(1);
    setResults([]);
  };

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Search Everything</h1>
        <p className="text-green-100">Find posts, courses, lessons, and documents across the entire platform</p>
      </div>

      {/* Content Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'post', 'course', 'lesson', 'document'] as const).map((type) => (
          <button
            key={type}
            onClick={() => {
              setFilters((prev) => ({ ...prev, contentType: type }));
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
              filters.contentType === type
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {type === 'all' && '📚 All Content'}
            {type === 'post' && '📰 Articles'}
            {type === 'course' && '🎓 Courses'}
            {type === 'lesson' && '📖 Lessons'}
            {type === 'document' && '📄 Documents'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block lg:col-span-1`}>
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>

            {/* Content Type */}
            <div className="mb-6 hidden lg:block">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Content Type</label>
              <Select
                value={filters.contentType}
                onValueChange={(value: any) => {
                  setFilters((prev) => ({ ...prev, contentType: value }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="post">Articles</SelectItem>
                  <SelectItem value="course">Courses</SelectItem>
                  <SelectItem value="lesson">Lessons</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Sort By</label>
              <Select
                value={filters.sortBy}
                onValueChange={(value: any) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="date">Newest First</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            {categories.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                <Select
                  value={filters.category || ""}
                  onValueChange={(value) =>
                    handleFilterChange("category", value === "" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date Range */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Date Range</label>
              <Select
                value={filters.dateRange || "all"}
                onValueChange={(value: any) => handleFilterChange("dateRange", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 12).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {(filters.query || filters.category || selectedTags.length > 0) && (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search Input & Controls */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search articles, keywords, topics..."
                value={filters.query}
                onChange={(e) => {
                  handleFilterChange("query", e.target.value);
                }}
                className="pl-10 py-6 text-base"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Results Count */}
          {totalResults > 0 && (
            <div className="text-sm text-gray-600">
              Found <span className="font-semibold text-gray-900">{totalResults}</span> results
              {selectedTags.length > 0 && (
                <span>
                  {" "}
                  in <strong>{selectedTags.join(", ")}</strong>
                </span>
              )}
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="space-y-4">
                {results.map((result) => {
                  const getResultLink = () => {
                    switch (result.type) {
                      case 'post':
                        return `/blog/${result.slug}`;
                      case 'course':
                        return `/courses/${result._id}`;
                      case 'lesson':
                        return `/lessons/${result._id}`;
                      case 'document':
                        return `/documents/${result._id}`;
                      default:
                        return '#';
                    }
                  };

                  const getTypeIcon = () => {
                    switch (result.type) {
                      case 'post':
                        return '📰';
                      case 'course':
                        return '🎓';
                      case 'lesson':
                        return '📖';
                      case 'document':
                        return '📄';
                      default:
                        return '📌';
                    }
                  };

                  const getTypeColor = () => {
                    switch (result.type) {
                      case 'post':
                        return 'bg-blue-50 border-blue-200';
                      case 'course':
                        return 'bg-green-50 border-green-200';
                      case 'lesson':
                        return 'bg-purple-50 border-purple-200';
                      case 'document':
                        return 'bg-amber-50 border-amber-200';
                      default:
                        return 'bg-gray-50 border-gray-200';
                    }
                  };

                  return (
                    <Link
                      key={result._id}
                      to={getResultLink()}
                      className={`block rounded-lg border p-6 hover:shadow-md transition-all group ${getTypeColor()} hover:border-green-300`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{getTypeIcon()}</span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {result.type}
                            </Badge>
                            {result.difficulty && (
                              <Badge variant="outline" className="text-xs capitalize">
                                {result.difficulty}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                            {result.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {result.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            {result.views !== undefined && (
                              <div className="flex items-center gap-1">
                                <Eye size={14} />
                                {result.views.toLocaleString()} views
                              </div>
                            )}
                            {result.likes !== undefined && (
                              <div className="flex items-center gap-1">
                                <Heart size={14} />
                                {result.likes} likes
                              </div>
                            )}
                            {result.readTime && (
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {result.readTime} read
                              </div>
                            )}
                            {result.duration && (
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {result.duration}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(result.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      {result.tags && result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                          {result.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {result.tags.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{result.tags.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {currentPage > 1 && (
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Previous
                    </button>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg transition ${
                        currentPage === page
                          ? "bg-green-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {currentPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </>
          ) : filters.query.length > 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">No results found for "{filters.query}"</p>
              <p className="text-sm text-gray-500">Try adjusting your search terms, filters, or content type</p>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Enter a search term to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchSystem;
