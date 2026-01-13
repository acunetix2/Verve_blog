import React, { useState, useEffect } from "react";
import { LogIn, Mail, Github, Linkedin, Twitter, BookOpen, Shield, TrendingUp, Users, Zap, ArrowRight, Menu, X, Award, Target, FileText, Lock, Code, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VerveHubLogo } from "@/components/VerveHubLogo";
import axios from "axios";
import DOMPurify from "dompurify";

// Security: Sanitize HTML content to prevent XSS attacks
const sanitizeText = (text: string): string => {
  if (!text || typeof text !== "string") return "";
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState([
    { number: "0", label: "Active Users" },
    { number: "0", label: "Blog Posts" },
    { number: "0", label: "Courses" },
    { number: "0", label: "Resources" }
  ]);
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SECURITY: Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SECURITY: Handle protected content access
  const handleContentClick = (slug: string) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { redirectTo: `/blog/${encodeURIComponent(slug)}` } });
      return;
    }
    // Navigate to blog post if authenticated
    navigate(`/blog/${encodeURIComponent(slug)}`);
  };

  const handleViewAllContent = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/blog");
  };

  // Fetch real data from backend with security measures
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create axios instance with timeout to prevent hanging
        const axiosInstance = axios.create({
          timeout: 10000, // 10 second timeout
          baseURL: import.meta.env.VITE_API_BASE_URL
        });

        // Only fetch publicly available data
        // Limit results to prevent large payload attacks
        const [postsRes, coursesRes, documentsRes] = await Promise.all([
          axiosInstance.get("/posts?limit=100", {
            headers: { "Accept": "application/json" }
          }).catch(() => ({ data: [] })),
          axiosInstance.get("/courses?limit=100", {
            headers: { "Accept": "application/json" }
          }).catch(() => ({ data: [] })),
          axiosInstance.get("/documents?limit=100", {
            headers: { "Accept": "application/json" }
          }).catch(() => ({ data: [] }))
        ]);

        const posts = Array.isArray(postsRes.data) ? postsRes.data : [];
        const courses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
        const documents = Array.isArray(documentsRes.data) ? documentsRes.data : [];

        // Validate and sanitize data
        if (!Array.isArray(posts) || posts.length > 500 || !Array.isArray(courses) || courses.length > 500 || !Array.isArray(documents) || documents.length > 500) {
          throw new Error("Invalid data format received");
        }

        // Update stats with validated data (excluding user count for security)
        setStats([
          { number: Math.min(posts.length, 9999).toString(), label: "Blog Posts" },
          { number: Math.min(courses.length, 9999).toString(), label: "Courses" },
          { number: Math.min(documents.length, 9999).toString(), label: "Resources" },
          { number: Math.min(posts.length + courses.length + documents.length, 9999).toString(), label: "Total Content" }
        ]);

        // Get recent posts for content section (limit to 3) with sanitization
        // SECURITY: Only show PUBLIC posts to prevent unauthorized content exposure
        const recentPosts = posts
          .filter((post: any) => {
            // Only show posts that are explicitly public or don't have visibility restrictions
            // Default to public if visibility field is not set (backward compatibility)
            return post && (post.isPublic !== false && post.visibility !== "private");
          })
          .slice(0, 3)
          .filter((post: any) => {
            // Only include posts with required fields
            return post && post.title && post.slug && typeof post.title === "string" && typeof post.slug === "string";
          })
          .map((post: any) => ({
            title: sanitizeText(post.title).substring(0, 100), // Limit length
            difficulty: 
              post.category === "advanced" ? "Hard" : 
              post.category === "intermediate" ? "Intermediate" : 
              "Easy",
            category: "Blog",
            tags: (Array.isArray(post.tags) ? post.tags : [])
              .slice(0, 3)
              .filter((tag: any) => typeof tag === "string")
              .map((tag: any) => sanitizeText(tag).substring(0, 20)),
            id: post._id,
            slug: post.slug.substring(0, 200) // Limit slug length to prevent SSRF
          }));

        setRecentContent(recentPosts);
        setLoading(false);
      } catch (error: any) {
        console.error("Failed to fetch landing page data:", error?.message || error);
        // Don't expose sensitive error details to user
        setError("Unable to load content at this time");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  // Static content categories (can be fetched if needed)
  const contentCategories = [
    { icon: Target, title: "Blog Posts", count: `${stats[1]?.number || "0"}`, color: "from-red-500 to-orange-500", description: "In-depth security articles and tutorials" },
    { icon: Shield, title: "Courses", count: `${stats[2]?.number || "0"}`, color: "from-green-500 to-emerald-500", description: "Complete learning paths and training" },
    { icon: FileText, title: "Resources", count: `${stats[3]?.number || "0"}`, color: "from-blue-500 to-cyan-500", description: "Guides, cheatsheets, and documentation" },
    { icon: Users, title: "Community", count: "Active", color: "from-purple-500 to-pink-500", description: "Join thousands of learners and experts" }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden" style={{ fontFamily: "'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Product+Sans:wght@400;500;700&display=swap');
      `}</style>
      
      {/* Subtle Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-50/30 via-white to-gray-50/30"></div>

      {/* Header */}
      <header className={`w-full py-3 px-4 sm:px-6 flex justify-between items-center fixed top-0 z-50 transition-all duration-300 ${
        scrollY > 20 ? "backdrop-blur-md bg-white/95 shadow-sm border-b border-gray-200" : "backdrop-blur-sm bg-white/80"
      }`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href='/'}>
          <div className="w-12 h-12 flex items-center justify-center">
            <VerveHubLogo size="md" />
          </div>
          <h1 className="text-sm font-semibold text-gray-900">
            Verve Hub Academy
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-xs">
          <button onClick={() => scrollToSection("content")} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
            Content
          </button>
          <button onClick={() => scrollToSection("categories")} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
            Categories
          </button>
          <button onClick={() => scrollToSection("features")} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
            Features
          </button>
          <button onClick={() => scrollToSection("contact")} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
            Contact
          </button>
          <button
            onClick={() => navigate("/login")}
            className="ml-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow cursor-pointer"
          >
            Sign In
          </button>
        </nav>
        
        <button 
          className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden pt-20 px-6 animate-in fade-in slide-in-from-top">
          <nav className="flex flex-col space-y-4 text-sm">
            <button onClick={() => scrollToSection("content")} className="text-gray-700 hover:text-blue-600 font-medium text-left py-3 border-b border-gray-100">Content</button>
            <button onClick={() => scrollToSection("categories")} className="text-gray-700 hover:text-blue-600 font-medium text-left py-3 border-b border-gray-100">Categories</button>
            <button onClick={() => scrollToSection("features")} className="text-gray-700 hover:text-blue-600 font-medium text-left py-3 border-b border-gray-100">Features</button>
            <button onClick={() => scrollToSection("contact")} className="text-gray-700 hover:text-blue-600 font-medium text-left py-3 border-b border-gray-100">Contact</button>
            <button onClick={() => { navigate("/login"); setIsMenuOpen(false); }} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Sign In
            </button>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-4 sm:px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full mb-6 hover:scale-105 transition-transform">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-700 font-medium">New writeups added weekly</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Master Cybersecurity
            <br />
            <span className="text-blue-600">Through Practice</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
            Deep-dive CTF writeups, TryHackMe walkthroughs, and comprehensive learning resources. From reconnaissance to privilege escalation—everything documented.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate("/login")}
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 text-sm cursor-pointer"
            >
              <LogIn size={18} />
              <span>Start Learning</span>
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg transition-all text-sm cursor-pointer"
            >
              <BookOpen size={18} />
              <span>Browse Content</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stat.number}</div>
                <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Content */}
      <section id="content" className="py-16 px-4 sm:px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">Latest Content</h2>
            <p className="text-gray-600 text-sm">New blog posts and resources added regularly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 flex items-center justify-center py-8">
                <div className="text-gray-500 text-sm">Loading latest content...</div>
              </div>
            ) : error ? (
              <div className="col-span-3 text-center py-8 text-gray-500 text-sm">
                {error}
              </div>
            ) : recentContent.length > 0 ? (
              recentContent.map((item, index) => (
                <button key={index} onClick={() => handleContentClick(item.slug)} className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer text-left">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                      item.difficulty === "Hard" ? "bg-red-50 text-red-700 border border-red-200" :
                      item.difficulty === "Intermediate" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                      "bg-green-50 text-green-700 border border-green-200"
                    }`}>
                      {item.difficulty}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md border border-gray-200">
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors break-words">
                    {item.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-gray-50 text-gray-600 rounded border border-gray-200 truncate">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-blue-600 text-xs font-medium group-hover:translate-x-1 transition-transform">
                    <span>{isAuthenticated ? "Read Article" : "Login to Read"}</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500 text-sm">
                No content available yet. Check back soon!
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <button onClick={handleViewAllContent} className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg transition-all text-sm">
              {isAuthenticated ? "View All Content" : "Login to View All"}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">Content Categories</h2>
            <p className="text-gray-600 text-sm">Organized learning paths for your cybersecurity journey</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contentCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center cursor-pointer">
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                    <Icon size={26} className="text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                  
                  <div className="text-2xl font-bold text-blue-600 mb-2">{category.count}</div>
                  
                  <p className="text-gray-600 text-xs leading-relaxed">{category.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4 sm:px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">Why Verve Hub Academy?</h2>
            <p className="text-gray-600 text-sm">Everything you need to level up your security skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Code, color: "from-blue-500 to-blue-600", title: "Step-by-Step Methodology", desc: "Detailed enumeration, exploitation, and privilege escalation steps with command breakdowns." },
              { icon: Terminal, color: "from-purple-500 to-pink-600", title: "Tool Mastery Guides", desc: "Learn Nmap, Burp Suite, Metasploit, and custom scripts in practical scenarios." },
              { icon: Award, color: "from-green-500 to-emerald-600", title: "Certification Prep", desc: "Content aligned with OSCP, CEH, and other certifications with exam-style challenges." },
              { icon: FileText, color: "from-yellow-500 to-orange-600", title: "Comprehensive Notes", desc: "Downloadable cheatsheets, study guides, and reference materials for quick revision." },
              { icon: TrendingUp, color: "from-blue-500 to-cyan-600", title: "Regular Updates", desc: "New writeups added weekly covering the latest challenges and emerging techniques." },
              { icon: Users, color: "from-red-500 to-pink-600", title: "Community Driven", desc: "Free for every passionate security enthusiast. Join our growing community." }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-base font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Zap size={16} className="text-white" />
            <span className="text-xs text-white font-medium">Join 100+ Active Users</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Ready to Master Cybersecurity?
          </h2>
          <p className="text-blue-100 text-base mb-8 max-w-2xl mx-auto">
            Access detailed CTF writeups, TryHackMe walkthroughs, and learning resources. Start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={() => navigate("/login")}
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg shadow-lg transition-all text-sm cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white hover:bg-white/10 font-medium rounded-lg backdrop-blur-sm transition-all text-sm cursor-pointer"
            >
              <BookOpen size={16} />
              <span>Explore Content</span>
            </button>
          </div>

          <p className="text-blue-100 text-xs">
            No credit card required • Free forever • 100+ writeups
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Get In Touch</h2>
          <p className="text-gray-600 mb-8 text-sm">
            Have questions? Want to contribute? Reach out through any channel below.
          </p>
          
          <div className="flex justify-center gap-4 mb-10">
            {[
              { icon: Github, href: "https://github.com/verveblog.git", color: "hover:bg-gray-900 hover:text-white" },
              { icon: Linkedin, href: "https://linkedin.com/in/iddy-chesire-55009b264/", color: "hover:bg-blue-600 hover:text-white" },
              { icon: Twitter, href: "https://twitter.com/iddychesire", color: "hover:bg-blue-400 hover:text-white" },
              { icon: Mail, href: "mailto:iddychesire@gmail.com", color: "hover:bg-green-600 hover:text-white" }
            ].map((social, idx) => {
              const Icon = social.icon;
              return (
                <a 
                  key={idx}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-12 h-12 flex items-center justify-center bg-white border border-gray-200 text-gray-700 rounded-lg transition-all hover:scale-110 hover:shadow-md ${social.color}`}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <p className="text-gray-700 text-sm mb-3">
              Want to contribute your own writeups or learning materials?
            </p>
            <a
              href="mailto:vervehubwriteups@gmail.com"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
            >
              vervehubwriteups@gmail.com
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <VerveHubLogo size="sm" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Verve Hub Academy</h3>
              </div>
              <p className="text-gray-600 text-xs mb-4 max-w-md leading-relaxed">
                Your comprehensive resource for cybersecurity learning. From beginner CTF challenges to advanced penetration testing techniques.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Github, href: "https://github.com/verveblog.git" },
                  { icon: Linkedin, href: "https://linkedin.com/in/iddy-chesire-55009b264/" },
                  { icon: Twitter, href: "https://twitter.com/iddychesire" }
                ].map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a key={idx} href={social.href} className="text-gray-600 hover:text-blue-600 transition-colors">
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 font-semibold mb-3 text-xs">Content</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="/login" className="hover:text-blue-600 transition-colors">CTF Writeups</a></li>
                <li><a href="https://tryhackme.com" className="hover:text-blue-600 transition-colors">TryHackMe Rooms</a></li>
                <li><a href="/signup" className="hover:text-blue-600 transition-colors">Learning Guides</a></li>
                <li><a href="/signup" className="hover:text-blue-600 transition-colors">Tool Tutorials</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-900 font-semibold mb-3 text-xs">Resources</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="/about" className="hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="/contribute" className="hover:text-blue-600 transition-colors">Contribute</a></li>
                <li><a href="/community" className="hover:text-blue-600 transition-colors">Community</a></li>
                <li><a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} Verve Hub Academy. Empowering cybersecurity learners worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}