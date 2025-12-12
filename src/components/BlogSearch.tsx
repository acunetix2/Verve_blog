import { useState, useEffect } from "react";
import { Search, X, Loader2, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllTags } from "@/lib/blog";

interface BlogSearchProps {
  onSearch: (query: string) => void;
  onTagFilter: (tag: string | null) => void;
  selectedTag: string | null;
}

export const BlogSearch = ({ onSearch, onTagFilter, selectedTag }: BlogSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Debounce search input for smoother UX
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, onSearch]);

  // Load tags (either from backend or fallback)
  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await fetch("import.meta.env.VITE_API_BASE_URL}/tags");
        if (response.ok) {
          const data = await response.json();
          setAllTags(data);
        } else {
          // fallback if backend not implemented
          setAllTags(getAllTags());
        }
      } catch {
        setAllTags(getAllTags());
      } finally {
        setLoadingTags(false);
      }
    };
    loadTags();
  }, []);

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) onTagFilter(null);
    else onTagFilter(tag);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search articles by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-12 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Tags Filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Tag className="h-4 w-4 text-slate-400" />
          <span>Filter by tag:</span>
          {selectedTag && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 ml-1"
              onClick={() => onTagFilter(null)}
            >
              Clear filter
            </Button>
          )}
        </div>

        {/* Tag Badges */}
        {loadingTags ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading tags...</span>
          </div>
        ) : allTags.length === 0 ? (
          <p className="text-sm text-slate-500 py-2">No tags available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className={`cursor-pointer text-xs font-medium transition-all px-3 py-1.5 ${
                  selectedTag === tag
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm"
                    : "border-slate-300 text-slate-700 bg-white hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
                }`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedTag) && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Active filters:</span>{" "}
            {searchQuery && (
              <span className="inline-flex items-center gap-1">
                searching for <span className="font-semibold text-slate-900">"{searchQuery}"</span>
              </span>
            )}
            {searchQuery && selectedTag && <span className="text-slate-400"> • </span>}
            {selectedTag && (
              <span className="inline-flex items-center gap-1">
                tagged <span className="font-semibold text-slate-900">#{selectedTag}</span>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};