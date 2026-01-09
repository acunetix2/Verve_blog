import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, BookOpen, User, Tag, ArrowRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  title: string;
  type: "post" | "user" | "tag";
  description?: string;
  image?: string;
  author?: string;
  views?: number;
}

const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSelectResult = useCallback((result: SearchResult) => {
    if (result.type === "post") {
      navigate(`/post/${result.id}`);
    } else if (result.type === "user") {
      navigate(`/user/${result.id}`);
    } else if (result.type === "tag") {
      navigate(`/v/blog?tag=${result.title}`);
    }
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
  }, [navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }

      // Escape to close
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(-1);
      }

      // Arrow keys for navigation
      if (isOpen && results.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        }
        if (e.key === "Enter" && selectedIndex >= 0) {
          e.preventDefault();
          handleSelectResult(results[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, handleSelectResult]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search function - comprehensive search across all data
  useEffect(() => {
    const performSearch = async () => {
      if (query.trim().length < 1) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const searchQuery = query.toLowerCase();

        // Search posts
        const postResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/features/search`,
          {
            params: { q: query, limit: 50 },
            headers: { Authorization: `Bearer ${token}` },
          }
        ).catch(() => ({ data: { posts: [] } }));

        // Search users
        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/search`,
          {
            params: { q: query, limit: 50 },
            headers: { Authorization: `Bearer ${token}` },
          }
        ).catch(() => ({ data: { users: [] } }));

        // Format posts with all their properties (safe author parsing)
        const posts: SearchResult[] = (postResponse.data.posts || [])
          .map((post: any) => {
            const title = (post.title || "").toString();
            const description = (post.description || post.content || "").toString();

            // Normalize author to a display string (author may be id, string, or object)
            let authorStr = "";
            if (post.author) {
              if (typeof post.author === "string") {
                authorStr = post.author;
              } else if (typeof post.author === "object") {
                authorStr = post.author.name || post.author.username || post.author.email || "";
              } else {
                authorStr = String(post.author);
              }
            }

            return {
              raw: post,
              id: post._id || post.id,
              title,
              type: "post" as const,
              description: description.substring(0, 150),
              author: authorStr,
              views: post.views || 0,
            } as any;
          })
          .filter((p: any) => {
            const title = (p.title || "").toLowerCase();
            const description = (p.description || "").toLowerCase();
            const author = (p.author || "").toLowerCase();
            return title.includes(searchQuery) || description.includes(searchQuery) || author.includes(searchQuery);
          })
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            type: "post",
            description: p.description,
            author: p.author,
            views: p.views,
          }));

        // Format users with all their properties
        const users: SearchResult[] = (userResponse.data.users || [])
          .filter((user: any) => {
            const name = (user.name || "").toLowerCase();
            const email = (user.email || "").toLowerCase();
            const bio = (user.bio || "").toLowerCase();
            return name.includes(searchQuery) || email.includes(searchQuery) || bio.includes(searchQuery);
          })
          .map((user: any) => ({
            id: user._id,
            title: user.name || "Unknown User",
            type: "user" as const,
            description: user.bio || user.email || "User",
            image: user.profileImage,
          }));

        // Extract and collect all tags from posts and categories
        const tagsSet = new Set<string>();
        const categories = new Set<string>();
        
        (postResponse.data.posts || []).forEach((post: any) => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag: string) => {
              if (tag.toLowerCase().includes(searchQuery)) {
                tagsSet.add(tag);
              }
            });
          }
          if (post.category && post.category.toLowerCase().includes(searchQuery)) {
            categories.add(post.category);
          }
        });

        // Format tags
        const tags: SearchResult[] = Array.from(tagsSet)
          .slice(0, 10)
          .map((tag) => ({
            id: tag,
            title: tag,
            type: "tag" as const,
            description: "Tag",
          }));

        // Format categories
        const categoryResults: SearchResult[] = Array.from(categories)
          .slice(0, 5)
          .map((cat) => ({
            id: cat,
            title: cat,
            type: "tag" as const,
            description: "Category",
          }));

        // Combine all results and sort by relevance (exact matches first)
        const allResults = [...posts, ...users, ...tags, ...categoryResults];
        
        const sorted = allResults.sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          const aStarts = aTitle.startsWith(searchQuery) ? 0 : 1;
          const bStarts = bTitle.startsWith(searchQuery) ? 0 : 1;
          return aStarts - bStarts;
        });

        setResults(sorted.slice(0, 30));
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 200);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div ref={searchRef} className="relative">
      {/* Search Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
      >
        <Search size={18} />
        <span className="text-sm">Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 ml-auto px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-500 bg-gray-200 dark:bg-gray-900 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Mobile Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Search size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl mx-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Search Input */}
                <div className="relative border-b border-gray-200 dark:border-gray-800 p-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search posts, users, tags... (Ctrl+K)"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedIndex(-1);
                    }}
                    className="w-full pl-10 pr-10 py-3 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Results */}
                {loading ? (
                  <div className="p-8 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="max-h-[60vh] overflow-y-auto">
                    {results.map((result, idx) => (
                      <motion.button
                        key={result.id}
                        onClick={() => handleSelectResult(result)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`w-full px-4 py-4 text-left border-b border-gray-100 dark:border-gray-800 transition-colors flex items-start gap-4 ${
                          selectedIndex === idx
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        {/* Icon */}
                        <div className="mt-1 flex-shrink-0">
                          {result.type === "post" && (
                            <BookOpen className="text-blue-500" size={20} />
                          )}
                          {result.type === "user" && (
                            <User className="text-purple-500" size={20} />
                          )}
                          {result.type === "tag" && (
                            <Tag className="text-orange-500" size={20} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {result.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                            {result.description}
                          </p>
                          {result.type === "post" && result.author && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
                              By {result.author} • {result.views?.toLocaleString()} views
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <ArrowRight
                          className={`flex-shrink-0 mt-1 transition-colors ${
                            selectedIndex === idx
                              ? "text-blue-500"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                          size={20}
                        />
                      </motion.button>
                    ))}
                  </div>
                ) : query.length > 0 ? (
                  <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                    <Search size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No results found for "{query}"</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                    <Search size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Start typing to search...</p>
                  </div>
                )}

                {/* Footer with shortcuts */}
                {results.length > 0 && (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <span>↑↓ Navigate</span>
                      <span>Enter Select</span>
                      <span>Esc Close</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
