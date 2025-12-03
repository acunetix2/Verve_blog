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
      label: "Total Articles",
      value: allPosts.length,
      icon: Feather,
      gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
      color: "text-blue-400",
      description: "Published content",
    },
    {
      label: "This Month",
      value: monthCount,
      icon: Calendar,
      gradient: "from-purple-500/20 via-purple-500/10 to-transparent",
      color: "text-purple-400",
      description: "New publications",
    },
    {
      label: "Avg Read Time",
      value: "5 min",
      icon: Clock,
      gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
      color: "text-amber-400",
      description: "Reading duration",
    },
    {
      label: "Active Readers",
      value: "100+",
      icon: Users,
      gradient: "from-cyan-500/20 via-cyan-500/10 to-transparent",
      color: "text-cyan-400",
      description: "Community size",
    },
  ];

const categories = [
  { name: "Cybersecurity", icon: Shield, count: 6, color: "text-red-400", bg: "bg-red-500/10" },
  { name: "Ethical Hacking", icon: Cpu, count: 5, color: "text-blue-400", bg: "bg-blue-500/10" },
  { name: "Penetration Testing", icon: Code2, count: 4, color: "text-purple-400", bg: "bg-purple-500/10" },
  { name: "Bug Bounty", icon: Rocket, count: 3, color: "text-orange-400", bg: "bg-orange-500/10" },
  { name: "Digital Forensics", icon: Feather, count: 2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { name: "Threat Intelligence", icon: BarChart3, count: 1, color: "text-emerald-400", bg: "bg-emerald-500/10" },
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
    <div className="min-h-screen bg-background text-foreground editorial-body">
      {/* Sophisticated ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-glow"></div>
        <div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-editorial-secondary/5 rounded-full blur-[120px] animate-glow"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Subtle grain texture */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Elegant Header */}
        <header className="py-12 sm:py-16 lg:py-20 border-b border-border/50">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-cyan-500/30 rounded-full text-xs font-medium">
			  <Activity className="h-3 w-3 text-cyan-400 animate-pulse" />
			  All Systems Operational
			</div>

			<h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-semibold tracking-tight editorial-heading">
			  <span className="bg-gradient-to-br from-foreground via-cyan-400 to-foreground bg-clip-text text-transparent">
				Verve Hub Writeups
			  </span>
			</h1>

			<p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
			  A curated collection of thoughts, insights, and learning writeups and documents worth your time
			</p>
            <div className="flex items-center justify-center gap-3 pt-4">
              <Link to="/me/about">
                <button className="px-6 py-2.5 bg-card hover:bg-muted border border-border hover:border-border/80 rounded-xl text-sm font-medium transition-all hover-lift">
                  About
                </button>
              </Link>
              <Link to="/me/blog">
                <button className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-500/90 text-primary-foreground rounded-xl text-sm font-semibold transition-all hover-lift shadow-lg shadow-primary/20 flex items-center gap-2">
                  <span>Explore All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Stats Banner */}
        <div className="py-8 sm:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {quickStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden bg-card border border-border/50 rounded-2xl p-6 hover-lift hover:border-border transition-all"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-3xl font-serif font-semibold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{stat.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="py-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-semibold">Popular Categories</h2>
            <Link to="/me/blog" className="text-sm text-primary hover:text-primary/80 font-medium">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <div
                  key={idx}
                  className="group bg-card border border-border/50 hover:border-border rounded-xl p-4 transition-all hover-lift cursor-pointer"
                >
                  <div className={`w-10 h-10 ${category.bg} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-5 w-5 ${category.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} articles</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Banner Section */}
        <div className="py-6">
          <Banner />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 py-12 max-w-6xl mx-auto">
          {/* Primary Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Platform Introduction */}
            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border border-blue-500/20 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Lightbulb className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-serif font-semibold mb-2">Welcome to Verve Hub Writeups</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A modern publishing platform designed for developers, designers, and creators. 
                    Discover in-depth articles, tutorials, and insights on technology, design, and productivity. 
                    Our community of writers shares knowledge that helps you grow professionally and personally.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <BookOpen className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Cybersecurity Content</p>
                    <p className="text-xs text-muted-foreground">Industry insights</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Users className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Active Community</p>
                    <p className="text-xs text-muted-foreground">100+ members</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Globe className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Available</p>
                    <p className="text-xs text-muted-foreground">Everyone</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Search Section */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Terminal className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-semibold">Discover</h2>
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
                <h2 className="text-3xl font-serif font-semibold">Featured Articles</h2>
                {filteredPosts.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                  </span>
                )}
              </div>

              {filteredPosts.length === 0 ? (
                <div className="bg-card border border-border/50 rounded-2xl p-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-2">No Articles Found</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Try adjusting your search or filter criteria to discover more content
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredPosts.slice(0, 3).map((post, idx) => (
                    <div 
                      key={post.slug} 
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <BlogCard post={post} />
                    </div>
                  ))}
                  {filteredPosts.length > 3 && (
                    <div className="text-center pt-6">
                      <Link
                        to="/me/blog"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group"
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
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-orange-500/10 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-serif font-semibold">Trending Topics</h3>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 hover:bg-muted rounded-xl transition-colors cursor-pointer group">
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{topic.name}</p>
                      <p className="text-xs text-muted-foreground">{topic.posts} articles</p>
                    </div>
                    <span className="text-xs font-semibold text-orange-400">{topic.trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-serif font-semibold">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'published' ? 'bg-blue-500/10' :
                      activity.type === 'updated' ? 'bg-purple-500/10' : 'bg-cyan-500/10'
                    } h-fit`}>
                      {activity.type === 'published' && <Newspaper className="h-4 w-4 text-blue-400" />}
                      {activity.type === 'updated' && <Sparkles className="h-4 w-4 text-purple-400" />}
                      {activity.type === 'commented' && <MessageSquare className="h-4 w-4 text-cyan-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
				  <h3 className="text-lg font-serif font-semibold text-white">Iddy Chesire</h3>
				  <p className="text-sm text-cyan-400">Platform Creator</p>
				</div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
				  Cybersecurity Researcher, Full-stack developer and writer passionate about creating content that helps others learn and grow.  
				  Building tools and platforms that elevates security.
			 </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
            <div className="bg-card border border-border/50 rounded-2xl p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-serif font-semibold">Quick Access</h3>
              </div>
              
              <div className="space-y-2">
                <Link to="/blog">
                  <div className="group/link flex items-center justify-between p-3 bg-muted/50 hover:bg-muted border border-transparent hover:border-border/50 rounded-xl transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-primary/10 rounded-lg">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">All Articles</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                  </div>
                </Link>

                <Link to="/me/about">
                  <div className="group/link flex items-center justify-between p-3 bg-muted/50 hover:bg-muted border border-transparent hover:border-border/50 rounded-xl transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-primary/10 rounded-lg">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">About Platform</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                  </div>
                </Link>
              </div>

              {/* Platform Status */}
              <div className="mt-6 p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-emerald-400">System Health</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-400">Operational</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-mono font-medium text-emerald-400">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-mono font-medium">24ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Readers</span>
                    <span className="font-mono font-medium">100+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Content Updates</span>
                    <span className="font-mono font-medium">Daily</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Connect</h4>
                <div className="grid grid-cols-4 gap-2">
                  <a
                    href="https://github.com/acunetix2/verve_blog.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-3 bg-muted/50 hover:bg-muted border border-transparent hover:border-border/50 rounded-xl transition-all group"
                  >
                    <Github className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/iddy-chesire-55009b264/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-3 bg-muted/50 hover:bg-muted border border-transparent hover:border-border/50 rounded-xl transition-all group"
                  >
                    <Linkedin className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                  <a
                    href="https://twitter.com/iddychesire"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-3 bg-muted/50 hover:bg-muted border border-transparent hover:border-border/50 rounded-xl transition-all group"
                  >
                    <Twitter className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                  <a
                    href="mailto:iddychesire@gmail.com"
                    className="flex items-center justify-center p-3 bg-muted/50 hover:bg-muted border border-transparent hover:border-border/50 rounded-xl transition-all group"
                  >
                    <Mail className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                </div>
              </div>
            </div>

            {/* Reader Achievements */}
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-yellow-500/10 rounded-xl">
                  <Award className="h-5 w-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-serif font-semibold">Reader Milestones</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Flame className="h-5 w-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">7 Day Streak</p>
                      <p className="text-xs text-muted-foreground">Keep reading daily!</p>
                    </div>
                    <span className="text-xs font-semibold text-orange-400">Active</span>
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
		<footer className="relative border-t border-border/50 mt-20 bg-card/30 backdrop-blur-sm">
		  <div className="container max-w-7xl mx-auto py-12 px-4">
			<div className="max-w-6xl mx-auto">
			  {/* Footer Content */}
			  <div className="grid md:grid-cols-4 gap-8 mb-8">
				<div className="md:col-span-2">
				  <div className="flex items-center gap-2 mb-4">
					<div className="p-2 bg-white rounded-xl">
					  <Feather className="h-5 w-5 text-cyan-500" />
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
					  <Link to="/me/blog" className="text-sm text-white hover:text-cyan-400 transition-colors">
						All Articles
					  </Link>
					</li>
					<li>
					  <Link to="/me/about" className="text-sm text-white hover:text-cyan-400 transition-colors">
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
				  © {new Date().getFullYear()} Verve Hub WriteUps. All rights reserved.
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
