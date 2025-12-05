import { useEffect, useState } from "react";
import { BlogCard } from "@/components/BlogCard";
import { BlogPost } from "@/lib/blog";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Search, X, FileText, ArrowLeft, Shield, Lock, 
  Terminal, Bug, Globe, Database, Network, AlertTriangle,
  Eye, Code, Server, Wifi
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Category icon mapping
const categoryIcons: Record<string, any> = {
  "All": Globe,
  "Web Exploitation": Globe,
  "Binary Exploitation": Terminal,
  "Reverse Engineering": Code,
  "Cryptography": Lock,
  "Forensics": Eye,
  "Network Security": Network,
  "Malware Analysis": Bug,
  "Penetration Testing": Shield,
  "CTF Writeups": FileText,
  "Vulnerability Research": AlertTriangle,
  "Cloud Security": Server,
  "Wireless Security": Wifi,
  "Database Security": Database,
  "Uncategorized": FileText
};

const categoryColors: Record<string, string> = {
  "All": "from-slate-600 to-slate-700",
  "Web Exploitation": "from-blue-600 to-blue-700",
  "Binary Exploitation": "from-purple-600 to-purple-700",
  "Reverse Engineering": "from-indigo-600 to-indigo-700",
  "Cryptography": "from-amber-600 to-amber-700",
  "Forensics": "from-emerald-600 to-emerald-700",
  "Network Security": "from-cyan-600 to-cyan-700",
  "Malware Analysis": "from-red-600 to-red-700",
  "Penetration Testing": "from-green-600 to-green-700",
  "CTF Writeups": "from-orange-600 to-orange-700",
  "Vulnerability Research": "from-rose-600 to-rose-700",
  "Cloud Security": "from-sky-600 to-sky-700",
  "Wireless Security": "from-violet-600 to-violet-700",
  "Database Security": "from-teal-600 to-teal-700",
  "Uncategorized": "from-gray-600 to-gray-700"
};

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<BlogPost[]>(`${API_BASE_URL}/posts`);
        const postsData = response.data;

        setPosts(postsData);
        setFilteredPosts(postsData);

        // Extract categories with counts
        const categoryMap = new Map<string, number>();
        postsData.forEach((post) => {
          const category = post.category || "Uncategorized";
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });

        const categoriesWithCounts = Array.from(categoryMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => a.name.localeCompare(b.name));

        // Add "All" category at the beginning
        setCategories([
          { name: "All", count: postsData.length },
          ...categoriesWithCounts,
        ]);
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

    if (selectedCategory !== "All") {
      updatedPosts = updatedPosts.filter((post) =>
        (post.category || "Uncategorized") === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      updatedPosts = updatedPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(updatedPosts);
  }, [searchQuery, selectedCategory, posts]);

  const handleSearch = (value: string) => setSearchQuery(value);
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
            <Shield className="absolute h-6 w-6 text-cyan-500" />
          </div>
          <p className="text-slate-300 font-medium">Loading writeups...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-red-900/50 rounded-xl p-6 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-950/50 rounded-full flex items-center justify-center">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 mb-1">Error Loading Writeups</h3>
              <p className="text-sm text-slate-400">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Security Writeups
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">Verve Hub CTF & Vulnerability Research</p>
              </div>
            </div>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-all hover:shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-cyan-500/30">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">
            Cybersecurity Knowledge Base
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explore our collection of CTF writeups, vulnerability research, and security analysis
          </p>
        </div>

        {/* Category Navigation */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-2xl p-6 mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-6">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="text-lg">Browse by Category</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category.name] || FileText;
              const gradient = categoryColors[category.name] || "from-gray-600 to-gray-700";
              const isActive = selectedCategory === category.name;
              
              return (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`group relative flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all duration-300 ${
                    isActive
                      ? "border-cyan-500 bg-gradient-to-br from-cyan-950/50 to-blue-950/50 shadow-lg shadow-cyan-500/20 scale-105"
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50 hover:scale-102"
                  }`}
                >
                  {/* Icon with gradient background */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg ${
                    isActive ? "shadow-cyan-500/30" : "shadow-black/30"
                  } transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Category name */}
                  <span className={`text-sm font-semibold mb-1 text-center leading-tight ${
                    isActive ? "text-cyan-400" : "text-slate-300 group-hover:text-slate-200"
                  }`}>
                    {category.name}
                  </span>
                  
                  {/* Count badge */}
                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isActive 
                      ? "bg-cyan-500/20 text-cyan-300" 
                      : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                  }`}>
                    {category.count}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-2xl p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
            <Input
              placeholder="Search writeups by title or description..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-12 h-14 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-base"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-lg"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div>
            <p className="text-lg text-slate-300">
              {filteredPosts.length === 0 ? (
                <span className="text-slate-500">No writeups found</span>
              ) : (
                <>
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    {filteredPosts.length}
                  </span>{" "}
                  <span className="text-slate-400">
                    {filteredPosts.length === 1 ? "writeup" : "writeups"}
                  </span>
                  {selectedCategory !== "All" && (
                    <span className="text-slate-500"> in {selectedCategory}</span>
                  )}
                </>
              )}
            </p>
            {searchQuery && (
              <p className="text-xs text-slate-500 mt-1">
                Filtered by search
              </p>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 mb-6">
              <FileText className="h-10 w-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-3">
              No writeups found
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              {selectedCategory === "All"
                ? "We couldn't find any writeups matching your search criteria."
                : `No writeups found in the "${selectedCategory}" category with the current filters.`}
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:border-slate-600"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-slate-700 transition-all duration-300 p-6 flex flex-col h-full group hover:scale-102"
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-slate-800">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Verve Hub Security
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Sharing knowledge through detailed writeups, vulnerability research, and security analysis
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></div>
              <span>System operational</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}