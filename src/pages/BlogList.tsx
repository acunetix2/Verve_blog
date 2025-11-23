import { useEffect, useState } from "react";
import { BlogCard } from "@/components/BlogCard";
import { BlogPost } from "@/lib/blog";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, X, Tag, Terminal, Sparkles, Shield, Activity } from "lucide-react";

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<BlogPost[]>(`${API_BASE_URL}/posts`);
        const postsData = response.data;

        setPosts(postsData);
        setFilteredPosts(postsData);

        // Extract unique tags dynamically
        const tags = Array.from(
          new Set(postsData.flatMap((p) => p.tags || []))
        );
        setAllTags(tags);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Filter logic
  useEffect(() => {
    let updatedPosts = [...posts];

    if (searchQuery.trim()) {
      updatedPosts = updatedPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag) {
      updatedPosts = updatedPosts.filter((post) =>
        post.tags?.includes(selectedTag)
      );
    }

    setFilteredPosts(updatedPosts);
  }, [searchQuery, selectedTag, posts]);

  const handleSearch = (value: string) => setSearchQuery(value);
  const handleTagClick = (tag: string) =>
    setSelectedTag(selectedTag === tag ? null : tag);

  // Loading & error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-950 text-white flex justify-center items-center px-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 mb-4">
            <Terminal className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-cyan-300 font-mono text-base sm:text-lg">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-950 text-white flex justify-center items-center px-4">
        <div className="text-center py-12 sm:py-20 text-red-400 font-mono border border-red-500/30 bg-red-950/20 rounded-lg px-6 sm:px-8 py-4 sm:py-6 max-w-md text-sm sm:text-base">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-950 text-white">
      {/* Animated grid background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${8 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30px) translateX(15px); }
          50% { transform: translateY(-60px) translateX(-15px); }
          75% { transform: translateY(-30px) translateX(15px); }
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4 border-b border-cyan-500/20 pb-4 sm:pb-6">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 shrink-0" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Available WriteUps
            </h1>
            <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 shrink-0" />
          </div>
          <Link
            to="/home"
            className="group px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg font-mono text-sm sm:text-base text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-500/30 w-full sm:w-auto text-center"
          >
            <button className="rounded-full w-full sm:w-auto">
              <span className="group-hover:-translate-x-1 rounded-full inline-block transition-transform">←</span> Home
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-cyan-400 h-4 w-4 sm:h-5 sm:w-5" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 bg-gray-900/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono rounded-lg text-sm sm:text-base"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-red-500/20 text-red-400 hover:text-red-300"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>

        {/* Tag List below search */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-900/30 border border-cyan-500/20 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 mr-2 w-full sm:w-auto mb-2 sm:mb-0">
            <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-mono text-cyan-300">Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2 flex-1">
            {allTags.length > 0 ? (
              allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className={`cursor-pointer font-mono text-xs transition-all ${
                    selectedTag === tag
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/30"
                      : "border-cyan-500/30 text-cyan-300 bg-gray-900/50 hover:border-cyan-400 hover:bg-cyan-500/10"
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  <Tag className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                  {tag}
                </Badge>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 font-mono">
                No tags available.
              </p>
            )}
          </div>
          {selectedTag && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 sm:h-7 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 sm:px-3"
              onClick={() => setSelectedTag(null)}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 sm:py-32">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 mb-4 sm:mb-6">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-400/50" />
            </div>
            <h3 className="text-lg sm:text-xl font-display font-semibold text-cyan-300 mb-2">
              No posts found
            </h3>
            <p className="text-gray-400 font-mono text-xs sm:text-sm px-4">
              Try adjusting your filters or search keywords
            </p>
          </div>
        ) : (
          <div
            className="
              grid gap-4 sm:gap-6 
              grid-cols-1 
              xs:grid-cols-2 
              lg:grid-cols-3 
              xl:grid-cols-4 
              auto-rows-fr
            "
          >
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
                className="
                  flex flex-col justify-between 
                  h-full bg-gradient-to-br from-gray-900/50 to-gray-950/50 
                  border border-cyan-500/20 
                  rounded-lg sm:rounded-xl p-3 sm:p-4 
                  backdrop-blur-sm
                  hover:border-cyan-400/50
                  hover:shadow-lg hover:shadow-cyan-500/20
                  transition-all duration-300
                "
              >
                <div className="flex-1 text-white">
                  <BlogCard post={post} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="relative border-t border-cyan-500/20 mt-16 sm:mt-24 bg-gray-950/80 backdrop-blur-sm rounded-lg">
          <div className="container py-6 sm:py-8 text-center space-y-3 sm:space-y-4 px-4">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
              <p className="text-xs sm:text-sm font-mono text-gray-300">
                <span className="text-cyan-400 font-bold">Verve Hub Blog</span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono flex-wrap">
              <span className="text-cyan-400">Learn</span>
              <span className="text-gray-600">•</span>
              <span className="text-blue-400">Understand</span>
              <span className="text-gray-600">•</span>
              <span className="text-cyan-400">Secure</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-green-500 font-mono pt-3 sm:pt-4 border-t border-gray-800/50">
              <Activity size={10} className="text-green-500 animate-pulse sm:w-3 sm:h-3" />
              <span>All systems online</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
  }