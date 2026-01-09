/**
 * Author / Copyright: Iddy
 * All rights reserved.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { BlogCard } from "@/components/BlogCard";
import { BlogSearch } from "@/components/BlogSearch";
import WelcomeBanner from "@/components/WelcomeBanner";
import Banner from "@/components/Banner";
import author from "@/assets/author.png";
import CommandStatusBadge from "@/components/CommandStatusBadge";
import CompanyLogo from "@/assets/logo.png";
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
    <div className="min-h-screen bg-slate-100 text-gray-800" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Elegant background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] animate-pulse"></div>
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-200/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Refined grid texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Welcome Banner - At the top */}
        <WelcomeBanner />

        {/* Header */}
         <header className="w-full bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border-b border-slate-200/50">
		  <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-8">

			{/* Status Badge */}
			<CommandStatusBadge
			  speed={100}        
			  pause={1000}      
			  darkMode={true}  
			  context="admin"   
			/>
			{/* Main Heading */}
			<h1
			  className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900"
			  style={{ fontFamily: "'Google Sans', sans-serif" }}
			>
			  Verve Hub Writeups
			</h1>

			{/* Subheading / Description */}
			<p
			  className="text-lg sm:text-xl text-slate-800 max-w-4xl mx-auto leading-relaxed font-light"
			  style={{ fontFamily: "'Google Sans', sans-serif" }}
			>
			  Verve Hub is a cybersecurity learning platform providing detailed CTF writeups, TryHackMe walkthroughs, curated reference materials, and downloadable resources. 
			  We aim to empower learners, enhance practical skills, and guide you toward mastery in cybersecurity.
			</p>

			{/* Key Features */}
			<div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
			  <div className="flex flex-col items-center gap-2 text-center max-w-xs">
				<Shield className="h-8 w-8 text-cyan-500" />
				<h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "'Google Sans', sans-serif" }}>Practical Security</h3>
				<p className="text-sm text-slate-700 font-light">
				  Interactive CTF walkthroughs, TryHackMe room writeups, and real-world security exercises.
				</p>
			  </div>
			  <div className="flex flex-col items-center gap-2 text-center max-w-xs">
				<BookOpen className="h-8 w-8 text-indigo-500" />
				<h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "'Google Sans', sans-serif" }}>Curated Resources</h3>
				<p className="text-sm text-slate-700 font-light">
				   Curated reference guides and tutorials designed to support systematic learning.
				</p>
			  </div>
			  <div className="flex flex-col items-center gap-2 text-center max-w-xs">
				<Cpu className="h-8 w-8 text-violet-500" />
				<h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "'Google Sans', sans-serif" }}>Skill Development</h3>
				<p className="text-sm text-slate-700 font-light">
				  Gain guidance and deepen your cybersecurity knowledge.
				</p>
			  </div>
			</div>

			{/* Call-to-Action Buttons */}
			<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
			  <Link to="/v/about">
				<button className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow text-slate-900">
				  About Us
				</button>
			  </Link>
			  <Link to="/v/blog">
				<button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
				  Explore Writeups
				  <ArrowRight className="h-4 w-4" />
				</button>
			  </Link>
			</div>

			{/* Highlight / Tagline */}
			<p className="mt-12 text-sm text-slate-500 font-medium tracking-wide uppercase" style={{ fontFamily: "'Google Sans', sans-serif" }}>
			  Learn • Understand • Secure • Excel
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
                  className="group relative overflow-hidden bg-white border border-slate-200/60 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 ${stat.bgColor} rounded-xl`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-sm font-medium text-slate-700 mt-1">{stat.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{stat.description}</p>
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
            <h2 className="text-2xl font-bold text-slate-900">Popular Categories</h2>
            <Link to="/v/blog" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <div
                  key={idx}
                  className={`group bg-white border border-slate-200/60 hover:border-slate-300 hover:shadow-lg ${category.hoverBg} rounded-xl p-5 transition-all duration-300 cursor-pointer`}
                >
                  <div className={`w-12 h-12 ${category.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-slate-600">{category.count} articles</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Banner Section */}
        <div className="py-8">
          <Banner />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 py-12 max-w-6xl mx-auto">
          {/* Primary Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Platform Introduction */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-xl">
                  <Lightbulb className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 text-slate-900">Welcome to Verve Hub Writeups</h2>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    A modern publishing platform designed for developers, designers, and creators. 
                    Discover in-depth articles, tutorials, and insights on technology, design, and productivity. 
                    Our community of writers shares knowledge that helps you grow professionally and personally.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Cybersecurity Content</p>
                    <p className="text-xs text-slate-600">Industry insights</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Users className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Active Community</p>
                    <p className="text-xs text-slate-600">100+ members</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Globe className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Available</p>
                    <p className="text-xs text-slate-600">Everyone</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-xl">
                  <Terminal className="h-5 w-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Discover</h2>
              </div>
              <BlogSearch
                onSearch={handleSearch}
                onTagFilter={handleTagFilter}
                selectedTag={selectedTag}
              />
            </div>

            {/* Featured Content */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Featured Articles</h2>
                {filteredPosts.length > 0 && (
                  <span className="text-sm text-slate-600 font-medium">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                  </span>
                )}
              </div>

              {filteredPosts.length === 0 ? (
                <div className="bg-white border border-slate-200/60 rounded-2xl p-16 text-center shadow-sm">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 border border-indigo-200 mb-4">
                    <Sparkles className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900">No Articles Found</h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto">
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
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors group"
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
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Trending Topics</h3>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-slate-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-slate-900 transition-colors">{topic.name}</p>
                      <p className="text-xs text-slate-600">{topic.posts} articles</p>
                    </div>
                    <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">{topic.trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'published' ? 'bg-blue-100' :
                      activity.type === 'updated' ? 'bg-violet-100' : 'bg-teal-100'
                    } h-fit`}>
                      {activity.type === 'published' && <Newspaper className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'updated' && <Sparkles className="h-4 w-4 text-violet-600" />}
                      {activity.type === 'commented' && <MessageSquare className="h-4 w-4 text-teal-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1 text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 border border-indigo-200/60 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={author}
                  alt="Iddy Chesire"
                  className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-white"
                />
                <div className="flex-1">
				  <h3 className="text-base font-bold text-gray-900">Iddy Chesire</h3>
				  <p className="text-sm text-indigo-600 font-medium">Platform Creator</p>
				</div>
				</div>
				<p className="text-sm font-medium text-gray-800 leading-relaxed mb-4">
				  Cybersecurity Researcher, Full-stack developer, and writer passionate about creating content that helps others learn and grow. Building tools and platforms that elevate security.
				</p>
              <div className="flex items-center gap-2 text-xs text-slate-600">
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
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 lg:sticky lg:top-24 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Zap className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Quick Access</h3>
              </div>
              
              <div className="space-y-2">
                <Link to="/v/blog">
                  <div className="group/link flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-xl transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-indigo-100 rounded-lg">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-900">All Articles</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover/link:text-slate-600 transition-colors" />
                  </div>
                </Link>

                <Link to="/v/about">
                  <div className="group/link flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-xl transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-indigo-100 rounded-lg">
                        <Shield className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-900">About Platform</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover/link:text-slate-600 transition-colors" />
                  </div>
                </Link>
              </div>

              {/* Platform Status */}
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-emerald-800">System Health</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
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

            {/* Reader Achievements */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-yellow-500/10 rounded-xl">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Reader Milestones</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Flame className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">7 Day Streak</p>
                      <p className="text-xs text-slate-600">Keep reading daily!</p>
                    </div>
                    <span className="text-xs font-semibold text-orange-600">Active</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Top Contributor</p>
                      <p className="text-xs text-muted-foreground">Featured reader</p>
                    </div>
                    <span className="text-xs font-semibold text-yellow-400">Gold</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Eye className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Article Views</p>
                      <p className="text-xs text-muted-foreground">Total engagement</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-400">100+</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Heart className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Bookmarks</p>
                      <p className="text-xs text-muted-foreground">Saved content</p>
                    </div>
                    <span className="text-xs font-semibold text-purple-400">24</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Engagement */}
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-cyan-500/10 rounded-xl">
                  <MessageSquare className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-serif font-semibold">Engagement Stats</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-400" />
                    <span className="text-sm text-muted-foreground">Total Likes</span>
                  </div>
                  <span className="text-sm font-semibold">1.2K</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-muted-foreground">Comments</span>
                  </div>
                  <span className="text-sm font-semibold">340</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-muted-foreground">Shares</span>
                  </div>
                  <span className="text-sm font-semibold">580</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
		<footer className="relative border-t bg-slate-800 border-border/50 mt-20 bg-card/30 backdrop-blur-sm">
		  <div className="container max-w-7xl mx-auto py-12 px-4">
			<div className="max-w-6xl mx-auto">
			  {/* Footer Content */}
			  <div className="grid md:grid-cols-4 gap-8 mb-8">
				<div className="md:col-span-2">
				  <div className="flex items-center gap-2 mb-4">
					<div className="p-2 rounded-xl flex items-center justify-center">
					  <img 
						src={CompanyLogo} 
						alt="Company Logo" 
						className="h-10 w-10 object-contain" 
					  />
					</div>
					<span className="text-lg font-serif font-semibold text-white">Verve Hub Writeups</span>
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
			  <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
				<p className="text-xs text-white">
				  &copy; {new Date().getFullYear()} Verve Hub WriteUps. All rights reserved.
				</p>
				<div className="flex items-center gap-4">
				  <a href="#" className="text-xs text-white hover:text-cyan-400 transition-colors">
					Privacy Policy
				  </a>
				  <a href="#" className="text-xs text-white hover:text-cyan-400 transition-colors">
					Terms of Service
				  </a>
				  <a href="#" className="text-xs text-white hover:text-cyan-400 transition-colors">
					Cookie Policy
				  </a>
				</div>
			  </div>
			</div>
		  </div>
		</footer>
    </div>
  );
};

export default Index;
