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

interface SearchPost {
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
  category?: string;
}

interface SearchFilters {
  query: string;
  category?: string;
  tags?: string[];
  sortBy: "relevance" | "date" | "views" | "likes";
  dateRange?: "week" | "month" | "3months" | "year" | "all";
  minViews?: number;
}

const AdvancedSearchSystem: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    sortBy: "relevance",
    dateRange: "all",
  });

  const [results, setResults] = useState<SearchPost[]>([]);
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
      if (filters.category) params.append("category", filters.category);
      if (filters.dateRange && filters.dateRange !== "all") {
        params.append("dateRange", filters.dateRange);
      }
      if (selectedTags.length > 0) {
        params.append("tags", selectedTags.join(","));
      }
      params.append("page", currentPage.toString());
      params.append("limit", resultsPerPage.toString());

      const response = await axios.get(`/api/posts/search?${params}`);
      setResults(response.data.posts);
      setTotalResults(response.data.total);
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Search Articles</h1>
        <p className="text-blue-100">Find insights and knowledge from our comprehensive library</p>
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
                {results.map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post.slug}`}
                    className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            {post.views.toLocaleString()} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart size={14} />
                            {post.likes} likes
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {post.readTime} read
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {post.category && (
                        <Badge className="flex-shrink-0" variant="secondary">
                          {post.category}
                        </Badge>
                      )}
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                        {post.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}
                  </Link>
                ))}
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
                          ? "bg-blue-600 text-white"
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
              <p className="text-sm text-gray-500">Try adjusting your search terms or filters</p>
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
