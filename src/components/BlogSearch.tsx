import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
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
        const response = await fetch("http://localhost:5000/api/tags");
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
    <div className="space-y-6 mb-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 font-mono bg-input border-border focus:border-blue-400 focus:ring-blue-400"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-destructive/20"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Tag Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
            Filter by tag
          </h3>
          {selectedTag && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTagFilter(null)}
              className="h-7 text-xs font-mono text-muted-foreground hover:text-destructive"
            >
              Clear filter
            </Button>
          )}
        </div>

        {/* Tag Badges */}
        {loadingTags ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading tags...
          </div>
        ) : allTags.length === 0 ? (
          <div className="text-muted-foreground text-sm italic">
            No tags found.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className={`cursor-pointer font-mono text-xs transition-all ${
                  selectedTag === tag
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "border-border hover:border-primary hover:bg-primary/10"
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
        <div className="text-sm font-mono text-muted-foreground">
          Showing results for:{" "}
          {searchQuery && <span className="text-primary">"{searchQuery}"</span>}
          {searchQuery && selectedTag && " + "}
          {selectedTag && <span className="text-primary">#{selectedTag}</span>}
        </div>
      )}
    </div>
  );
};
