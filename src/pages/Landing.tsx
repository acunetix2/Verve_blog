import React, { useState, useEffect } from "react";
import { LogIn, UserPlus, Github, Linkedin, Twitter, BookOpen, Shield, TrendingUp, Users, Zap, Star, ArrowRight, Menu, X, ChevronDown, Award, Target, FileText, Lock, Code, Terminal } from "lucide-react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: "2.5K+", label: "Active Learners" },
    { number: "150+", label: "CTF Writeups" },
    { number: "80+", label: "TryHackMe Rooms" },
    { number: "50+", label: "Learning Docs" }
  ];

  const testimonials = [
    { name: "James Martinez", role: "Penetration Tester", text: "The CTF writeups here helped me pass my OSCP. The methodology breakdowns are incredibly detailed and practical." },
    { name: "Priya Sharma", role: "Security Analyst", text: "Best TryHackMe walkthroughs I've found. Clear explanations and the learning documents are gold for interview prep." },
    { name: "David Chen", role: "Bug Bounty Hunter", text: "I've landed 3 bounties using techniques learned from these writeups. The real-world application is unmatched." }
  ];

  const contentCategories = [
    { icon: Target, title: "CTF Writeups", count: "150+", color: "from-red-500 to-orange-500", description: "HackTheBox, PicoCTF, SANS Holiday Hack" },
    { icon: Shield, title: "TryHackMe Rooms", count: "80+", color: "from-green-500 to-emerald-500", description: "Complete walkthroughs with methodology" },
    { icon: FileText, title: "Learning Docs", count: "50+", color: "from-blue-500 to-cyan-500", description: "Notes, cheatsheets, study guides" },
    { icon: Terminal, title: "Tool Tutorials", count: "40+", color: "from-purple-500 to-pink-500", description: "Nmap, Burp Suite, Metasploit & more" }
  ];

  const recentContent = [
    { title: "HackTheBox - Keeper", difficulty: "Easy", category: "CTF", tags: ["Linux", "KeePass", "CVE"] },
    { title: "TryHackMe - Daily Bugle", difficulty: "Hard", category: "Room", tags: ["Web", "Joomla", "Privilege Escalation"] },
    { title: "OWASP Top 10 Deep Dive", difficulty: "Guide", category: "Learning", tags: ["Web Security", "Vulnerabilities"] }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.15), transparent 40%)`
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/5 to-transparent"></div>
      </div>

      {/* Floating particles effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className={`w-full py-4 px-6 md:px-8 flex justify-between items-center fixed top-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? "backdrop-blur-xl bg-slate-950/90 shadow-2xl border-b border-cyan-500/10" : "backdrop-blur-md bg-slate-950/50"
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Lock size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Verve Hub
          </h1>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          <a href="#content" className="hover:text-cyan-400 transition-colors font-medium">Content</a>
          <a href="#categories" className="hover:text-cyan-400 transition-colors font-medium">Categories</a>
          <a href="#stats" className="hover:text-cyan-400 transition-colors font-medium">Stats</a>
          <a href="#testimonials" className="hover:text-cyan-400 transition-colors font-medium">Reviews</a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-cyan-400 hover:text-cyan-300 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/98 backdrop-blur-2xl md:hidden pt-24 px-8 animate-in fade-in slide-in-from-top">
          <nav className="flex flex-col space-y-6 text-xl">
            <a href="#content" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400 transition-colors font-medium border-b border-slate-800 pb-4">Content</a>
            <a href="#categories" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400 transition-colors font-medium border-b border-slate-800 pb-4">Categories</a>
            <a href="#stats" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400 transition-colors font-medium border-b border-slate-800 pb-4">Stats</a>
            <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400 transition-colors font-medium border-b border-slate-800 pb-4">Reviews</a>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 pt-32 pb-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-full mb-8 backdrop-blur-sm hover:scale-105 transition-transform">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400 font-medium">Live: New HackTheBox Season 5 Writeups Added</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient">
            Verve Hub
          </span>
          <br />
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-100/90 mt-4 block">
            Master Cybersecurity Through Practice
          </span>
        </h2>
        
        <p className="max-w-3xl text-cyan-200/90 text-lg sm:text-xl mb-12 leading-relaxed">
          Deep-dive CTF writeups, TryHackMe walkthroughs, and comprehensive learning resources. 
          <span className="block mt-3 text-cyan-300 font-semibold text-xl">From reconnaissance to privilege escalation—everything documented.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 mb-16">
          <a
            href="/login"
            className="group flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-2xl shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-cyan-500/70"
          >
            <LogIn size={20} />
            <span>Start Learning</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#content"
            className="flex items-center justify-center gap-3 px-10 py-4 border-2 border-cyan-500/50 text-cyan-400 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 font-semibold rounded-2xl backdrop-blur-sm transition-all hover:scale-105"
          >
            <BookOpen size={20} />
            <span>Browse Content</span>
          </a>
        </div>

        {/* Quick Stats Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl w-full">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4 hover:border-cyan-500/50 transition-all hover:scale-105">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-cyan-200/70">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <a href="#content" className="absolute bottom-8 animate-bounce cursor-pointer">
          <ChevronDown size={32} className="text-cyan-400/70 hover:text-cyan-400 transition-colors" />
        </a>
      </section>

      {/* Recent Content Preview */}
      <section id="content" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Latest Writeups & Guides
            </h3>
            <p className="text-cyan-200/70 text-lg">Fresh content added weekly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentContent.map((item, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 hover:border-cyan-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                      item.difficulty === "Easy" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                      item.difficulty === "Hard" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                      "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}>
                      {item.difficulty}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/30">
                      {item.category}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h4>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-slate-800/50 text-cyan-300/70 rounded border border-slate-700/50">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center text-cyan-400 text-sm font-medium group-hover:translate-x-2 transition-transform">
                    <span>Read Writeup</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/writeups"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900/60 border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 font-semibold rounded-xl backdrop-blur-sm transition-all hover:scale-105"
            >
              View All Content
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Content Categories */}
      <section id="categories" className="py-20 px-6 bg-slate-950/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold mb-4">Content Categories</h3>
            <p className="text-cyan-200/70 text-lg">Organized learning paths for your cybersecurity journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contentCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="group relative bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-800/50 hover:border-cyan-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity" style={{
                    backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    backgroundSize: '200% 200%'
                  }}></div>
                  
                  <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 group-hover:scale-110 transition-all shadow-lg`}>
                    <Icon size={36} className="text-white" />
                  </div>
                  
                  <h4 className="text-2xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                    {category.title}
                  </h4>
                  
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">
                    {category.count}
                  </div>
                  
                  <p className="text-cyan-200/70 text-sm">
                    {category.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold mb-4">Why Verve Hub?</h3>
            <p className="text-cyan-200/70 text-lg">Everything you need to level up your security skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-800/50 hover:border-cyan-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-cyan-500/30">
                <Code size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">Step-by-Step Methodology</h4>
              <p className="text-cyan-200/70 leading-relaxed">Every writeup includes detailed enumeration, exploitation, and privilege escalation steps with command breakdowns.</p>
            </div>

            <div className="group bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-800/50 hover:border-cyan-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-purple-500/30">
                <Terminal size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">Tool Mastery Guides</h4>
              <p className="text-cyan-200/70 leading-relaxed">Learn to use essential tools like Nmap, Burp Suite, Metasploit, and custom scripts effectively in real scenarios.</p>
            </div>

            <div className="group bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-800/50 hover:border-cyan-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-green-500/30">
                <Award size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">Certification Prep</h4>
              <p className="text-cyan-200/70 leading-relaxed">Content aligned with OSCP, CEH, and other certifications. Practice with exam-style challenges and methodology.</p>
            </div>

            <div className="group bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-800/50 hover:border-cyan-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-yellow-500/30">
                <FileText size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">Comprehensive Notes</h4>
              <p className="text-cyan-200/70 leading-relaxed">Downloadable cheatsheets, study guides, and reference materials for quick revision and interview prep.</p>
            </div>

            <div className="group bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-800/50 hover:border-cyan-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-blue-500/30">
                <TrendingUp size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">Regular Updates</h4>
              <p className="text-cyan-200/70 leading-relaxed">New writeups added weekly covering the latest machines, challenges, and emerging attack techniques.</p>
            </div>

            <div className="group bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-800/50 hover:border-cyan-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-red-500/30">
                <Users size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">Community Driven</h4>
              <p className="text-cyan-200/70 leading-relaxed">Join discussions, share alternative solutions, and learn from a community of passionate security enthusiasts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold mb-4">Success Stories</h3>
            <p className="text-cyan-200/70 text-lg">How Verve Hub helped others level up</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm rounded-3xl p-10 md:p-16 border border-slate-800/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
              
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`relative z-10 transition-all duration-700 ${
                    index === activeTestimonial ? "opacity-100" : "opacity-0 absolute inset-0 p-10 md:p-16"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={24} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl text-cyan-100 mb-8 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-cyan-400 text-lg">{testimonial.name}</div>
                      <div className="text-cyan-200/60">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="relative z-10 flex justify-center gap-3 mt-10">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`transition-all rounded-full ${
                      index === activeTestimonial 
                        ? "bg-cyan-400 w-10 h-3" 
                        : "bg-cyan-400/30 w-3 h-3 hover:bg-cyan-400/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-8">
            <Zap size={18} className="text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Join 2,500+ Active Learners</span>
          </div>
          
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            Ready to Master Cybersecurity?
          </h3>
          <p className="text-cyan-200/90 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Access detailed CTF writeups, TryHackMe walkthroughs, and learning resources. 
            <span className="block mt-2 text-cyan-300 font-semibold">Start your journey to OSCP, CEH, and beyond.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/signup"
              className="group flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-cyan-500/70"
            >
              <span>Get Started Free</span>
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#content"
              className="flex items-center justify-center gap-3 px-10 py-5 border-2 border-cyan-500/50 text-cyan-400 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 font-bold text-lg rounded-2xl backdrop-blur-sm transition-all hover:scale-105"
            >
              <BookOpen size={22} />
              <span>Explore Content</span>
            </a>
          </div>

          <p className="mt-8 text-cyan-200/60 text-sm">
            No credit card required • Free forever • 150+ writeups
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-slate-950/70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl font-bold mb-6">Get In Touch</h3>
          <p className="text-cyan-200/80 mb-10 text-lg">
            Have questions? Want to contribute? Reach out through any channel below.
          </p>
          
          <div className="flex justify-center gap-6 mb-12">
            <a 
              href="https://github.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-16 h-16 flex items-center justify-center bg-gradient-to-br from-slate-800/80 to-slate-800/40 hover:from-slate-700 hover:to-slate-800 border border-slate-700 hover:border-cyan-500 rounded-2xl transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <Github size={28} className="text-cyan-400 group-hover:text-cyan-300" />
            </a>
            <a 
              href="https://linkedin.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-16 h-16 flex items-center justify-center bg-gradient-to-br from-slate-800/80 to-slate-800/40 hover:from-slate-700 hover:to-slate-800 border border-slate-700 hover:border-cyan-500 rounded-2xl transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <Linkedin size={28} className="text-cyan-400 group-hover:text-cyan-300" />
            </a>
            <a 
              href="https://twitter.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-16 h-16 flex items-center justify-center bg-gradient-to-br from-slate-800/80 to-slate-800/40 hover:from-slate-700 hover:to-slate-800 border border-slate-700 hover:border-cyan-500 rounded-2xl transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <Twitter size={28} className="text-cyan-400 group-hover:text-cyan-300" />
            </a>
          </div>

          <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-800/50">
            <p className="text-cyan-200/90 mb-4">
              Want to contribute your own writeups or learning materials?
            </p>
            <a
              href="mailto:contribute@vervehub.com"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              contribute@vervehub.com
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-slate-950/95 backdrop-blur-sm border-t border-cyan-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Lock size={20} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Verve Hub
                </h1>
              </div>
              <p className="text-cyan-200/70 mb-4 max-w-md">
                Your comprehensive resource for cybersecurity learning. From beginner CTF challenges to advanced penetration testing techniques.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com/" className="text-cyan-400/70 hover:text-cyan-400 transition-colors">
                  <Github size={20} />
                </a>
                <a href="https://linkedin.com/" className="text-cyan-400/70 hover:text-cyan-400 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="https://twitter.com/" className="text-cyan-400/70 hover:text-cyan-400 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Content</h4>
              <ul className="space-y-2 text-cyan-200/70">
                <li><a href="/ctf" className="hover:text-cyan-400 transition-colors">CTF Writeups</a></li>
                <li><a href="/tryhackme" className="hover:text-cyan-400 transition-colors">TryHackMe Rooms</a></li>
                <li><a href="/guides" className="hover:text-cyan-400 transition-colors">Learning Guides</a></li>
                <li><a href="/tools" className="hover:text-cyan-400 transition-colors">Tool Tutorials</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-cyan-200/70">
                <li><a href="/about" className="hover:text-cyan-400 transition-colors">About</a></li>
                <li><a href="/contribute" className="hover:text-cyan-400 transition-colors">Contribute</a></li>
                <li><a href="/community" className="hover:text-cyan-400 transition-colors">Community</a></li>
                <li><a href="/contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-cyan-800/20 text-center">
            <p className="text-cyan-400/70">
              &copy; {new Date().getFullYear()} Verve Hub. Empowering cybersecurity learners worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}