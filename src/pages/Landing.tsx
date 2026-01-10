import React, { useState, useEffect } from "react";
import { LogIn, Mail, Github, Linkedin, Twitter, BookOpen, Shield, TrendingUp, Users, Zap, ArrowRight, Menu, X, Award, Target, FileText, Lock, Code, Terminal } from "lucide-react";
import CompanyLogo from "@/assets/logo.png";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { number: "100+", label: "Active Users" },
    { number: "20+", label: "CTF Writeups" },
    { number: "30+", label: "TryHackMe Rooms" },
    { number: "40+", label: "Learning Docs" }
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

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
            <img 
              src={CompanyLogo} 
              alt="Company Logo" 
              className="h-14 w-14 object-contain" 
            />
          </div>
          <h1 className="text-sm font-semibold text-gray-900">
            Verve Hub 
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
          <a 
            href="/login"
            className="ml-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow"
          >
            Sign In
          </a>
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
            <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700 transition-colors shadow-sm">
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
            <a 
              href="/login"
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 text-sm"
            >
              <LogIn size={18} />
              <span>Start Learning</span>
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a 
              href="/login"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg transition-all text-sm"
            >
              <BookOpen size={18} />
              <span>Browse Content</span>
            </a>
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">Latest Writeups & Guides</h2>
            <p className="text-gray-600 text-sm">New content added weekly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentContent.map((item, index) => (
              <div key={index} className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                    item.difficulty === "Easy" ? "bg-green-50 text-green-700 border border-green-200" :
                    item.difficulty === "Hard" ? "bg-red-50 text-red-700 border border-red-200" :
                    "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}>
                    {item.difficulty}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md border border-gray-200">
                    {item.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-gray-50 text-gray-600 rounded border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-blue-600 text-xs font-medium group-hover:translate-x-1 transition-transform">
                  <span>Read Writeup</span>
                  <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg transition-all text-sm">
              View All Content
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">Why Verve Hub?</h2>
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
            <a 
              href="/login"
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg shadow-lg transition-all text-sm"
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a 
              href="/login"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white hover:bg-white/10 font-medium rounded-lg backdrop-blur-sm transition-all text-sm"
            >
              <BookOpen size={16} />
              <span>Explore Content</span>
            </a>
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
                  <img 
                    src={CompanyLogo} 
                    alt="Company Logo" 
                    className="h-8 w-8 object-contain" 
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Verve Hub Writeups</h3>
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
              © {new Date().getFullYear()} Verve Hub. Empowering cybersecurity learners worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}