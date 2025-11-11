import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { BlogCard } from "@/components/BlogCard";
import { BlogSearch } from "@/components/BlogSearch";
import Banner from "@/components/Banner";
import { getAllPosts, getPostsByTag } from "@/lib/blog";
import { Terminal, Sparkles, Shield, PlusCircle, Activity, Zap } from "lucide-react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const Index = () => {
  const [filteredPosts, setFilteredPosts] = useState(getAllPosts());
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updatePosts(query, selectedTag);
  };

  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag);
    updatePosts(searchQuery, tag);
  };

  const updatePosts = (query: string, tag: string | null) => {
    let posts = getAllPosts();

    if (tag) posts = getPostsByTag(tag);

    if (query) {
      posts = posts.filter((post) =>
        [post.title, post.description, post.content, ...post.tags] 
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    }

    setFilteredPosts(posts);
  };

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
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.6); }
        }
      `}</style>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative border-b border-cyan-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent"></div>
        
        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Status Badge */}
            <div className="flex justify-center items-center gap-3">
              <div className="relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 backdrop-blur-sm border border-cyan-500/30 rounded-full shadow-lg shadow-cyan-500/20">
                <Activity className="h-5 w-5 text-green-400 animate-pulse" />
                <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-cyan-300 font-semibold">
                  System Operational
                </span>
                <Activity className="h-4 w-4 text-green-500 animate-pulse" />
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-[length:200%_auto] animate-gradient drop-shadow-2xl">
                Verve Hub WriteUps
              </h1>
              <div className="flex items-center justify-center gap-2 text-cyan-400/50"> 
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-400/50"></div>  
                <Shield className="h-5 w-5" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-400/50"></div>  
              </div>
            </div>

            {/* Subtitle */}
            <div className="space-y-4">
              <p className="text-xl md:text-2xl text-gray-300 font-mono leading-relaxed">
                Cybersecurity insights, TryHackMe writeups, CTF solutions & hands-on guides.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-950/20 border border-cyan-500/20 rounded-lg">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-200 font-mono font-semibold">
                  Explore • Learn • Defend
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-400 font-mono leading-relaxed max-w-2xl mx-auto">
              Practical experiences and walkthroughs from real-world cyber challenges.
              Whether you're studying, training, or exploring each post breaks down security concepts
              into simple, actionable insights.
            </p>

            {/* Banner */}
            <div className="flex justify-center pt-4">
              <Banner />
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-8">
              <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4">
                <p className="text-2xl font-bold text-cyan-400">{getAllPosts().length}</p>
                <p className="text-xs text-gray-400 font-mono mt-1">Sample Posts</p>
              </div>
              <div className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 backdrop-blur-sm border border-green-500/20 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-400">Active</p>
                <p className="text-xs text-gray-400 font-mono mt-1">Status</p>
              </div>
              <div className="bg-gradient-to-br from-blue-950/30 to-indigo-950/30 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-400">24/7</p>
                <p className="text-xs text-gray-400 font-mono mt-1">Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </section>

      {/* Blog Section */}
      <section className="container relative z-10 py-16">
        <div className="flex flex-col">
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Latest Writeups
              </h2>
            </div>
            <p className="text-gray-400 font-mono text-sm">
              Explore a collection of security research and challenge solutions
            </p>
          </div>

          <BlogSearch
            onSearch={handleSearch}
            onTagFilter={handleTagFilter}
            selectedTag={selectedTag}
          />

          {filteredPosts.length === 0 ? (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 mb-6">
                <Sparkles className="h-10 w-10 text-cyan-400/50" />
              </div>
              <h3 className="text-xl font-display font-semibold text-cyan-300 mb-2">
                No posts found
              </h3>
              <p className="text-gray-400 font-mono text-sm">
                Try adjusting your filters or search keywords
              </p>
            </div>
          ) : (
            <div
              className="grid gap-8 md:grid-cols-2 mt-10 w-full"
              style={{ gridAutoRows: "1fr" }}
            >
              {filteredPosts.map((post) => (
                <div key={post.slug} className="flex">
                  <div className="flex-1 flex flex-col">
                    <BlogCard post={post} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-cyan-500/20 mt-24 bg-gray-950/80 backdrop-blur-sm">
        <div className="container py-6 text-center space-y-6">
          {/* Main Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-cyan-400" />
              <p className="text-base font-mono text-gray-300">
                Maintained by <span className="text-cyan-400 font-bold">Iddy Chesire</span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm font-mono">
              <span className="text-cyan-400">Learn</span>
              <span className="text-gray-600">•</span>
              <span className="text-blue-400">Understand</span>
              <span className="text-gray-600">•</span>
              <span className="text-green-400">Secure</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-3 pt-4">
            <a
              href="https://github.com/acunetix2/verve_blog.git"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 bg-gray-900/50 text-cyan-500 border border-cyan-700/50 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
            </a>
            <a
              href="https://www.linkedin.com/in/iddy-chesire-55009b264/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 bg-gray-900/50 border border-blue-700/50 rounded-lg hover:border-blue-500/50 hover:bg-blue-950/20 transition-all hover:shadow-lg hover:shadow-blue-500/20"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-blue-400 group-hover:text-blue-400 transition-colors" />
            </a>
            <a
              href="https://twitter.com/iddychesire"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 bg-gray-900/50 border border-purple-700/50 rounded-lg hover:border-purple-500/50 hover:bg-purple-950/20 transition-all hover:shadow-lg hover:shadow-purple-500/20"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
            </a>
            <a
              href="mailto:iddychesire@gmail.com"
              className="group p-3 bg-gray-900/50 border border-green-700/50 rounded-lg hover:border-green-500/50 hover:bg-green-950/20 transition-all hover:shadow-lg hover:shadow-green-500/20"
              aria-label="Email"
            >
              <Mail className="h-5 w-5 text-green-400 group-hover:text-green-400 transition-colors" />
            </a>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono pt-4 border-t border-gray-800/50">
            <Activity size={12} className="text-green-700 animate-pulse" />
            <span>All systems online</span>
            <span className="text-gray-700">•</span>
            <span>Knowledge Base</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;