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
  Eye, Code, Server, Wifi, FileEdit
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
  "All": "from-blue-400 to-blue-500",
  "Web Exploitation": "from-blue-300 to-blue-400",
  "Binary Exploitation": "from-purple-400 to-purple-500",
  "Reverse Engineering": "from-indigo-400 to-indigo-500",
  "Cryptography": "from-amber-400 to-amber-500",
  "Forensics": "from-emerald-400 to-emerald-500",
  "Network Security": "from-cyan-400 to-cyan-500",
  "Malware Analysis": "from-red-400 to-red-500",
  "Penetration Testing": "from-green-400 to-green-500",
  "CTF Writeups": "from-orange-400 to-orange-500",
  "Vulnerability Research": "from-rose-400 to-rose-500",
  "Cloud Security": "from-sky-400 to-sky-500",
  "Wireless Security": "from-violet-400 to-violet-500",
  "Database Security": "from-teal-400 to-teal-500",
  "Uncategorized": "from-gray-400 to-gray-500"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
          * {
            font-family: 'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
        `}</style>
        <div className="text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Shield className="absolute h-6 w-6 text-blue-600" />
          </div>
          <p className="text-gray-700 font-medium">Loading writeups...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
          * {
            font-family: 'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
        `}</style>
        <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Error Loading Writeups</h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
        * {
          font-family: 'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4 shadow-lg">
			<FileEdit className="h-8 w-8 text-white" />
		  </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Curated Verve WriteUps
          </h2>
          <p className="text-gray-800 text-base max-w-2xl mx-auto">
			  Whether you are a beginner learning the fundamentals, or a professional staying up-to-date with the latest threats, Verve Hub offers curated resources, practical guides, and examples to enhance your cybersecurity skills.
		  </p>
        </div>

        {/* Category Navigation */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-6">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-lg">Browse by Category</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category.name] || FileText;
              const gradient = categoryColors[category.name] || "from-gray-400 to-gray-500";
              const isActive = selectedCategory === category.name;
              
              return (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`group relative flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all duration-300 ${
                    isActive
                      ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:scale-102"
                  }`}
                >
                  {/* Icon with gradient background */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Category name */}
                  <span className={`text-sm font-semibold mb-1 text-center leading-tight ${
                    isActive ? "text-blue-600" : "text-gray-700 group-hover:text-blue-600"
                  }`}>
                    {category.name}
                  </span>
                  
                  {/* Count badge */}
                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isActive 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700"
                  }`}>
                    {category.count}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search writeups by title or description..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-12 h-14 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-base"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-lg"
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
            <p className="text-lg text-gray-900">
              {filteredPosts.length === 0 ? (
                <span className="text-gray-500">No writeups found</span>
              ) : (
                <>
                  <span className="font-bold text-blue-600">
                    {filteredPosts.length}
                  </span>{" "}
                  <span className="text-gray-700">
                    {filteredPosts.length === 1 ? "writeup" : "writeups"}
                  </span>
                  {selectedCategory !== "All" && (
                    <span className="text-gray-500"> in {selectedCategory}</span>
                  )}
                </>
              )}
            </p>
            {searchQuery && (
              <p className="text-xs text-gray-500 mt-1">
                Filtered by search
              </p>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No writeups found
            </h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
              {selectedCategory === "All"
                ? "We couldn't find any writeups matching your search criteria."
                : `No writeups found in the "${selectedCategory}" category with the current filters.`}
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
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
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
                className="bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                {/* Card Header with gradient accent */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"></div>
                
                {/* Card Content */}
                <div className="p-6">
                  <BlogCard post={post} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-gray-200">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Verve Hub Security
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Sharing knowledge through detailed writeups, vulnerability research, and security analysis
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <span>System operational</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}