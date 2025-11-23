import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { BlogCard } from "@/components/BlogCard";
import { BlogSearch } from "@/components/BlogSearch";
import Banner from "@/components/Banner";
import {
  Terminal,
  Sparkles,
  Shield,
  Activity,
  Zap,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
  Target,
  Users,
  ArrowRight,
  Flame,
  Star,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import axios from "axios";

const Index = () => {
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [monthCount, setMonthCount] = useState<number>(0);

  // Fetch posts from backend on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts`);
        setAllPosts(res.data);
        setFilteredPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    const fetchMonthCount = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/posts/count-this-month`
        );
        setMonthCount(res.data.count);
      } catch (err) {
        console.error("Error fetching month count:", err);
      }
    };

    fetchPosts();
    fetchMonthCount();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updatePosts(query, selectedTag);
  };

  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag);
    updatePosts(searchQuery, tag);
  };

  const updatePosts = (query: string, tag: string | null) => {
    let posts = [...allPosts];

    if (tag) posts = posts.filter((post) => post.tags.includes(tag));

    if (query) {
      posts = posts.filter((post) =>
        [post.title, post.description, post.content, ...(post.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    }

    setFilteredPosts(posts);
  };

  const quickStats = [
    {
      label: "Total Posts",
      value: allPosts.length,
      icon: BookOpen,
      color: "cyan",
      trend: "+12%",
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      label: "Active",
      value: "Live",
      icon: Activity,
      color: "green",
      trend: "99.9%",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      label: "This Month",
      value: monthCount,
      icon: TrendingUp,
      color: "purple",
      trend: "+13%",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      label: "Avg Read",
      value: "5m",
      icon: Clock,
      color: "orange",
      trend: "4.1★",
      gradient: "from-orange-500/20 to-yellow-500/20",
    },
  ];

  const achievements = [
    { icon: Flame, label: "7 Day Streak", value: "Active" },
    { icon: Star, label: "Top Reader", value: "Gold" },
    { icon: Eye, label: "Total Views", value: "100+" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Subtle grid overlay */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Enhanced gradient orbs with glow effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
        }
      `}</style>

      {/* Header */}

      {/* Dashboard Container */}
      <div className="container relative z-10 py-4 sm:py-6 md:py-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Top Bar - Welcome & Status */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent gradient-animate">
                    Dashboard
                  </span>
                </h1>
                <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                  <Activity className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-400 animate-pulse" />
                  <span className="text-green-400 font-mono text-[10px] sm:text-xs font-medium">Live</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}{" "}
                <span className="hidden xs:inline">• Welcome back</span>
              </p>
            </div>

            {/* Quick Actions - Mobile & Desktop */}
            <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
              <Link to="/me/about" className="flex-1 lg:flex-initial">
                <button className="w-full px-4 sm:px-5 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all backdrop-blur-sm">
                  About
                </button>
              </Link>
              <Link to="/me/blog" className="flex-1 lg:flex-initial">
                <button className="w-full px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2">
                  <span>View All</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
            {quickStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className={`group relative overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 border border-white/10 hover:border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 transition-all hover:scale-[1.02] cursor-pointer`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="p-1.5 sm:p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                        <Icon className={`h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-${stat.color}-400`} />
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono text-green-400 font-medium">{stat.trend}</span>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stat.value}</p>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 font-medium truncate">{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Section */}
          <div className="mb-4 sm:mb-6">
            <Banner />
          </div>

          {/* Achievements Bar */}
          <div className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-yellow-500/10 rounded-lg">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-300">Your Achievements</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                {achievements.map((achievement, idx) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={idx} className="flex items-center gap-1.5 sm:gap-2">
                      <div className="p-1 sm:p-1.5 bg-cyan-500/10 rounded-lg">
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-[10px] sm:text-xs text-gray-500">{achievement.label}</p>
                        <p className="text-xs sm:text-sm font-semibold text-white">{achievement.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Main Feed - 8 columns */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Search & Filters */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-cyan-500/10 rounded-lg">
                  <Terminal className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold">Explore Content</h2>
              </div>
              <BlogSearch
                onSearch={handleSearch}
                onTagFilter={handleTagFilter}
                selectedTag={selectedTag}
              />
            </div>

            {/* Posts Feed */}
            {filteredPosts.length === 0 ? (
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl p-12 sm:p-16 backdrop-blur-sm text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3 sm:mb-4">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">No Results Found</h3>
                <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto px-4">
                  Try adjusting your search or filter criteria to find what you're looking for
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredPosts.slice(0, 3).map((post) => (
                  <div key={post.slug} className="group">
                    <BlogCard post={post} />
                  </div>
                ))}
                {filteredPosts.length > 3 && (
                  <div className="text-center mt-4">
                    <Link
                      to="/me/blog"
                      className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors text-sm sm:text-base group"
                    >
                      <span>View All Posts</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - 4 columns */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            {/* Quick Links */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 backdrop-blur-sm lg:sticky lg:top-24">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-yellow-500/10 rounded-lg">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold">Quick Links</h3>
              </div>
              <div className="space-y-2">
                <Link to="/blog" className="block">
                  <div className="group/link flex items-center justify-between p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-lg sm:rounded-xl transition-all cursor-pointer">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-cyan-500/10 rounded-lg group-hover/link:bg-cyan-500/20 transition-colors">
                        <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium">All Posts</span>
                    </div>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 group-hover/link:text-cyan-400 transition-colors" />
                  </div>
                </Link>

                <Link to="/me/about" className="block">
                  <div className="group/link flex items-center justify-between p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-lg sm:rounded-xl transition-all cursor-pointer">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg group-hover/link:bg-blue-500/20 transition-colors">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium">About Platform</span>
                    </div>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 group-hover/link:text-blue-400 transition-colors" />
                  </div>
                </Link>
              </div>

              {/* Platform Health */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg sm:rounded-xl">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-xs sm:text-sm font-semibold text-green-400">System Status</span>
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 animate-pulse" />
                </div>
                <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Uptime</span>
                    <span className="text-white font-mono font-medium">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Response Time</span>
                    <span className="text-white font-mono font-medium">24ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Users</span>
                    <span className="text-white font-mono font-medium">100+</span>
                  </div>
                </div>
              </div>

              {/* Social Connect */}
              <div className="mt-4 sm:mt-6">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3">Connect</h4>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  <a
                    href="https://github.com/acunetix2/verve_blog.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-lg sm:rounded-xl transition-all group"
                  >
                    <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/iddy-chesire-55009b264/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-lg sm:rounded-xl transition-all group"
                  >
                    <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </a>
                  <a
                    href="https://twitter.com/iddychesire"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-lg sm:rounded-xl transition-all group"
                  >
                    <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </a>
                  <a
                    href="mailto:iddychesire@gmail.com"
                    className="flex items-center justify-center p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-lg sm:rounded-xl transition-all group"
                  >
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-green-400 transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 mt-16 sm:mt-24 bg-black/50 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto py-6 sm:py-8 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                Built by <span className="text-white font-semibold">Iddy Chesire</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Activity size={10} className="text-green-400 animate-pulse sm:w-3 sm:h-3" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;