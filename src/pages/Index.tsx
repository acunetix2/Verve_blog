/**
 * Author / Copyright: Iddy
 * All rights reserved.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { BlogCard } from "@/components/BlogCard";
import { BlogSearch } from "@/components/BlogSearch";
import WelcomeBanner from "@/components/WelcomeBanner";
import Banner from "@/components/Banner";
import author from "@/assets/author.png";
import CommandStatusBadge from "@/components/CommandStatusBadge";
import { VerveHubLogo } from "@/components/VerveHubLogo";
import PostSeriesComponent from "@/components/PostSeriesComponent";
import PostSchedulingComponent from "@/components/PostSchedulingComponent";
import EmailDigestComponent from "@/components/EmailDigestComponent";
import EnhancedThemeSwitcher from "@/components/EnhancedThemeSwitcher";
import EnhancedDashboard from "@/components/EnhancedDashboard";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import FloatingActionButton from "@/components/FloatingActionButton";
import { SkeletonDashboard } from "@/components/Skeletons";
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
  Feather,
  Calendar,
  Code2,
  Lightbulb,
  Rocket,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Globe,
  Cpu,
  Palette,
  BarChart3,
  Newspaper,
  Tag,
  User,
} from "lucide-react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import axios from "axios";

const Index = () => {
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [monthCount, setMonthCount] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<"feed" | "series" | "scheduling" | "digest">("feed");
  const [showAuthorZoom, setShowAuthorZoom] = useState(false);

  useEffect(() => {
    // Fetch current user info
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/v`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentUser(res.data.user || { name: localStorage.getItem("userName") || "User" });
        } else {
          const storedName = localStorage.getItem("userName");
          if (storedName) {
            setCurrentUser({ name: storedName });
          }
        }
      } catch (err) {
        const storedName = localStorage.getItem("userName");
        if (storedName) {
          setCurrentUser({ name: storedName });
        }
      }
    };

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

    fetchCurrentUser();
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
      label: "Total Articles",
      value: allPosts.length,
      icon: Feather,
      gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
      color: "text-indigo-600",
      bgColor: "bg-indigo-500/10",
      description: "Published content",
    },
    {
      label: "This Month",
      value: monthCount,
      icon: Calendar,
      gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
      color: "text-violet-600",
      bgColor: "bg-violet-500/10",
      description: "New publications",
    },
    {
      label: "Avg Read Time",
      value: "5 min",
      icon: Clock,
      gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      description: "Reading duration",
    },
    {
      label: "Active Readers",
      value: "100+",
      icon: Users,
      gradient: "from-teal-500/10 via-teal-500/5 to-transparent",
      color: "text-teal-600",
      bgColor: "bg-teal-500/10",
      description: "Community size",
    },
  ];

  const categories = [
    { name: "Cybersecurity", icon: Shield, count: 6, color: "text-red-600", bg: "bg-red-50", hoverBg: "hover:bg-red-100" },
    { name: "Ethical Hacking", icon: Cpu, count: 5, color: "text-indigo-600", bg: "bg-indigo-50", hoverBg: "hover:bg-indigo-100" },
    { name: "Penetration Testing", icon: Code2, count: 4, color: "text-violet-600", bg: "bg-violet-50", hoverBg: "hover:bg-violet-100" },
    { name: "Bug Bounty", icon: Rocket, count: 3, color: "text-orange-600", bg: "bg-orange-50", hoverBg: "hover:bg-orange-100" },
    { name: "Digital Forensics", icon: Feather, count: 2, color: "text-teal-600", bg: "bg-teal-50", hoverBg: "hover:bg-teal-100" },
    { name: "Threat Intelligence", icon: BarChart3, count: 1, color: "text-emerald-600", bg: "bg-emerald-50", hoverBg: "hover:bg-emerald-100" },
  ];

  const trendingTopics = [
    { name: "OWASP Top 10", posts: 6, trend: "+25%" },
    { name: "CTF Challenges", posts: 5, trend: "+20%" },
    { name: "Web App Hacking", posts: 4, trend: "+15%" },
    { name: "Network Pentesting", posts: 3, trend: "+12%" },
    { name: "Malware Analysis", posts: 2, trend: "+10%" },
    { name: "Social Engineering", posts: 1, trend: "+8%" },
  ];

  const recentActivity = [
    { type: "published", title: "Understanding React Server Components", time: "2 hours ago" },
    { type: "updated", title: "Guide to Modern CSS", time: "5 hours ago" },
    { type: "commented", title: "TypeScript Best Practices", time: "1 day ago" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Elegant background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Refined grid texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-6">
        {/* Welcome Banner - At the top */}
        <WelcomeBanner />

        {/* Header */}
    <header className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-red-600/30">
		  <div className="w-full px-6 py-4 text-left space-y-8">
          {/* Main Heading */}
          <h1
            className="text-5xl sm:text-6xl lg:text-4xl font-bold tracking-tight text-white"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            Welcome to Verve Hub Academy
          </h1>

          {/* Subheading / Description */}
          <p
            className="text-left sm:text-1xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            Verve Hub Academy is a cybersecurity learning platform providing detailed CTF writeups, TryHackMe walkthroughs, curated reference materials, and downloadable resources. 
            We aim to empower learners, enhance practical skills, and guide you toward mastery in cybersecurity.
          </p>

			{/* Key Features */}
			<div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
			  <div className="flex flex-col items-center gap-2 text-center max-w-xs">
				<Shield className="h-8 w-8 text-red-500" />
				<h3 className="font-semibold text-white" style={{ fontFamily: "'Google Sans', sans-serif" }}>Practical Security</h3>
				<p className="text-sm text-gray-400 font-light">
				  CTF walkthroughs, TryHackMe room writeups, and beginner-friendly courses.
				</p>
			  </div>
			  <div className="flex flex-col items-center gap-2 text-center max-w-xs">
				<BookOpen className="h-8 w-8 text-orange-500" />
				<h3 className="font-semibold text-white" style={{ fontFamily: "'Google Sans', sans-serif" }}>Curated Resources</h3>
				<p className="text-sm text-gray-400 font-light">
				   Curated reference guides and tutorials designed to support systematic learning.
				</p>
			  </div>
			  <div className="flex flex-col items-center gap-2 text-center max-w-xs">
				<Cpu className="h-8 w-8 text-red-500" />
				<h3 className="font-semibold text-white" style={{ fontFamily: "'Google Sans', sans-serif" }}>Skill Development</h3>
				<p className="text-sm text-gray-400 font-light">
				  Gain guidance and deepen your cybersecurity knowledge.
				</p>
			  </div>
			</div>

			{/* Call-to-Action Buttons */}
			<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
			  <Link to="/v/about">
				<button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow text-white">
				  About Us
				</button>
			  </Link>
			  <Link to="/v/blog">
				<button className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
				  Explore
				  <ArrowRight className="h-4 w-4" />
				</button>
			  </Link>
			</div>

			{/* Highlight / Tagline */}
			<p className="mt-12 text-sm text-gray-400 font-medium tracking-wide " style={{ fontFamily: "'Google Sans', sans-serif" }}>
			  Statistics
			</p>

		  </div>
		</header>

        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation />

        {/* Enhanced Dashboard */}
        <EnhancedDashboard />

        {/* Stats Banner */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {quickStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden bg-gray-800 border border-red-600/30 rounded-2xl p-6 hover:border-red-500/60 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 bg-red-900/40 rounded-xl`}>
                        <Icon className={`h-5 w-5 text-red-500`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-300 mt-1">{stat.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{stat.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="py-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Popular Categories</h2>
            <Link to="/v/blog" className="text-sm text-red-500 hover:text-red-400 font-semibold">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <div
                  key={idx}
                  className={`group bg-gray-800 border border-red-600/30 hover:border-red-500/60 hover:shadow-lg hover:shadow-red-500/20 rounded-xl p-5 transition-all duration-300 cursor-pointer`}
                >
                  <div className={`w-12 h-12 bg-red-900/40 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 text-red-500`} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-400">{category.count} articles</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Banner Section */}
        <div className="py-4">
          <Banner />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 py-12 max-w-6xl mx-auto">
          {/* Primary Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Platform Introduction */}
            <div className="bg-gray-800 border border-red-600/30 rounded-2xl p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-red-900/40 rounded-xl">
                  <Lightbulb className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 text-white">Welcome to Verve Hub!</h2>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    A modern publishing platform designed for developers, designers, and creators. 
                    Discover in-depth articles, tutorials, and insights on technology, design, and productivity. 
                    Our community of writers shares knowledge that helps you grow professionally and personally.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-red-900/20 rounded-lg border border-red-600/30">
                  <div className="p-2 bg-gray-700 rounded-lg shadow-sm">
                    <BookOpen className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Cybersecurity Content</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-900/20 rounded-lg border border-orange-600/30">
                  <div className="p-2 bg-gray-700 rounded-lg shadow-sm">
                    <Users className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Active Community</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-900/20 rounded-lg border border-red-600/30">
                  <div className="p-2 bg-gray-700 rounded-lg shadow-sm">
                    <Globe className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Open-Source</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-gray-800 border border-red-600/30 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-red-900/40 rounded-xl">
                  <Terminal className="h-5 w-5 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Discover</h2>
              </div>
              <BlogSearch
                onSearch={handleSearch}
                onTagFilter={handleTagFilter}
                selectedTag={selectedTag}
              />
            </div>

            {/* Featured Content */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Featured Articles</h2>
                {filteredPosts.length > 0 && (
                  <span className="text-sm text-gray-400 font-medium">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                  </span>
                )}
              </div>

              {filteredPosts.length === 0 ? (
                <div className="bg-gray-800 border border-red-600/30 rounded-2xl p-16 text-center shadow-sm">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/40 border border-red-600/30 mb-4">
                    <Sparkles className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">No Articles Found</h3>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto">
                    Try adjusting your search or filter criteria to discover more content
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredPosts.slice(0, 3).map((post, idx) => (
                    <div 
                      key={post.slug}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <BlogCard post={post} />
                    </div>
                  ))}
                  {filteredPosts.length > 3 && (
                    <div className="text-center pt-6">
                      <Link
                        to="/v/blog"
                        className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors group"
                      >
                        <span>View All Articles</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Trending Topics */}
            <div className="bg-gray-800 border border-red-600/30 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-orange-900/40 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="text-base font-bold text-white">Trending Topics</h3>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-red-600/30">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white group-hover:text-white transition-colors">{topic.name}</p>
                      <p className="text-xs text-gray-400">{topic.posts} articles</p>
                    </div>
                    <span className="text-xs font-semibold text-red-500 bg-red-900/40 px-2 py-1 rounded">{topic.trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 border border-red-600/30 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-blue-900/40 rounded-xl">
                  <Activity className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-base font-bold text-white">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'published' ? 'bg-blue-900/40' :
                      activity.type === 'updated' ? 'bg-orange-900/40' : 'bg-teal-900/40'
                    } h-fit`}>
                      {activity.type === 'published' && <Newspaper className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'updated' && <Sparkles className="h-4 w-4 text-orange-500" />}
                      {activity.type === 'commented' && <MessageSquare className="h-4 w-4 text-teal-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1 text-white">{activity.title}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-red-600/30 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={author}
                  alt="Iddy Chesire"
                  className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-red-600/30 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowAuthorZoom(true)}
                />
                <div className="flex-1">
				  <h3 className="text-base font-bold text-white">Iddy Chesire</h3>
				  <p className="text-sm text-red-500 font-medium">Platform Creator</p>
				</div>
				</div>
				<p className="text-sm font-medium text-gray-300 leading-relaxed mb-4">
				  Cybersecurity Researcher, Full-stack developer, and writer passionate about creating content that helps others learn and grow. Building tools and platforms that elevate security.
				</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>{allPosts.length} articles</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>100+ readers</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="bg-gray-800 border border-red-600/30 rounded-2xl p-6  lg:top-24 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-red-900/40 rounded-xl">
                  <Zap className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-base font-bold text-white">Quick Access</h3>
              </div>
              
              <div className="space-y-2">
                <Link to="/v/blog">
                  <div className="group/link flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 border border-transparent hover:border-red-600/30 rounded-xl transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-red-900/40 rounded-lg">
                        <BookOpen className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="text-sm font-medium text-white">All Articles</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500 group-hover/link:text-gray-400 transition-colors" />
                  </div>
                </Link>

                <Link to="/v/about">
                  <div className="group/link flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 border border-transparent hover:border-red-600/30 rounded-xl transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-red-900/40 rounded-lg">
                        <Shield className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="text-sm font-medium text-white">About Platform</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500 group-hover/link:text-gray-400 transition-colors" />
                  </div>
                </Link>
              </div>

              {/* Platform Status */}
              <div className="mt-6 p-4 bg-red-900/20 border border-red-600/30 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-red-500">System Health</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-700 font-medium">Operational</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Uptime</span>
                    <span className="font-mono font-semibold text-emerald-700">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Response Time</span>
                    <span className="font-mono font-semibold text-slate-900">24ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Active Readers</span>
                    <span className="font-mono font-semibold text-slate-900">100+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Content Updates</span>
                    <span className="font-mono font-semibold text-slate-900">Daily</span>
                  </div>
                </div>
              </div>
              {/* Social Links */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-slate-600 mb-3">Connect</h4>
                <div className="grid grid-cols-4 gap-2">
                  <a
                    href="https://github.com/acunetix2/verve_blog.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-xl transition-all group"
                  >
                    <Github className="h-4 w-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/iddy-chesire-55009b264/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-xl transition-all group"
                  >
                    <Linkedin className="h-4 w-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
                  </a>
                  <a
                    href="https://twitter.com/iddychesire"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-xl transition-all group"
                  >
                    <Twitter className="h-4 w-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
                  </a>
                  <a
                    href="mailto:iddychesire@gmail.com"
                    className="flex items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-xl transition-all group"
                  >
                    <Mail className="h-4 w-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
		<footer className="relative border-t bg-slate-800 border-border/50 mt-20 bg-card/30 backdrop-blur-sm">
		  <div className="container w-full py-12 px-4">
			<div className="w-full">
			  {/* Footer Content */}
			  <div className="grid md:grid-cols-4 gap-8 mb-8">
				<div className="md:col-span-2">
				  <div className="flex items-center gap-2 mb-4">
					<div className="p-2 rounded-xl flex items-center justify-center">
					  <VerveHubLogo size="md" />
					</div>
					<span className="text-lg font-serif font-semibold text-white">Verve Hub Academy</span>
				  </div>
				  <p className="text-sm text-white leading-relaxed mb-4">
					A modern publishing platform for developers and creators. 
					Sharing knowledge through well-crafted articles and tutorials.
				  </p>
				  <div className="flex items-center gap-2 text-xs">
					<div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
					<span className="text-emerald-400 font-medium">All systems operational</span>
				  </div>
				</div>

				<div>
				  <h4 className="text-sm font-semibold mb-4 text-white">Platform</h4>
				  <ul className="space-y-2">
					<li>
					  <Link to="/v/blog" className="text-sm text-white hover:text-cyan-400 transition-colors">
						All Articles
					  </Link>
					</li>
					<li>
					  <Link to="/v/about" className="text-sm text-white hover:text-cyan-400 transition-colors">
						About Us
					  </Link>
					</li>
					<li>
					  <a href="#" className="text-sm text-white hover:text-cyan-400 transition-colors">
						Categories
					  </a>
					</li>
					<li>
					  <a href="#" className="text-sm text-white hover:text-cyan-400 transition-colors">
						Authors
					  </a>
					</li>
				  </ul>
				</div>

				<div>
				  <h4 className="text-sm font-semibold mb-4 text-white">Resources</h4>
				  <ul className="space-y-2">
					<li>
					  <a
						href="/documentation"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-white hover:text-cyan-400 transition-colors"
					  >
						Documentation
					  </a>
					</li>
					<li>
					  <a
						href="/newsletter"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-white hover:text-cyan-400 transition-colors"
					  >
						Newsletter
					  </a>
					</li>
					<li>
					  <a
						href="/community"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-white hover:text-cyan-400 transition-colors"
					  >
						Community
					  </a>
					</li>
					<li>
					  <a
						href="/support"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-white hover:text-cyan-400 transition-colors"
					  >
						Support
					  </a>
					</li>
				  </ul>
				</div>
			  </div>

			  {/* Footer Bottom */}
			  <div className="pt-8 border-t border-red-600/20 flex flex-col sm:flex-row items-center justify-between gap-4">
				<p className="text-xs text-gray-400">
				  &copy; {new Date().getFullYear()} Verve Hub Academy. All rights reserved.
				</p>
				<div className="flex items-center gap-4">
				  <a href="#" className="text-xs text-gray-400 hover:text-red-500 transition-colors">
					Privacy Policy
				  </a>
				  <a href="#" className="text-xs text-gray-400 hover:text-red-500 transition-colors">
					Terms of Service
				  </a>
				  <a href="#" className="text-xs text-gray-400 hover:text-red-500 transition-colors">
					Cookie Policy
				  </a>
				</div>
			  </div>
			</div>
		  </div>
		</footer>

        {/* Author Zoom Modal */}
        <AnimatePresence>
          {showAuthorZoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowAuthorZoom(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Profile Image */}
                <img
                  src={author}
                  alt="Iddy Chesire"
                  className="w-96 h-96 rounded-2xl object-cover shadow-2xl border-4 border-red-600/30"
                />

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuthorZoom(false)}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gray-900 rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-gray-800 transition-colors border-2 border-red-600/30"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* User Info Below Image */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-6 text-center"
                >
                  <h3 className="text-2xl font-bold text-white">Iddy Chesire</h3>
                  <p className="text-gray-400 mt-1 text-sm">Platform Creator & Cybersecurity Researcher</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};

export default Index;
