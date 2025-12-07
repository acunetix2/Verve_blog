import React, { useState, useEffect } from "react";
import { LogIn, Mail, Cpu, Github, Linkedin, Twitter, BookOpen, Shield, TrendingUp, Users, Zap, Star, ArrowRight, Menu, X, ChevronDown, Award, Target, FileText, Lock, Code, Terminal } from "lucide-react";
import CompanyLogo from "@/assets/logo.png";
import { Link } from "react-router-dom";

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
    { number: "100+", label: "Active Users" },
    { number: "20+", label: "CTF Writeups" },
    { number: "30+", label: "TryHackMe Rooms" },
    { number: "40+", label: "Learning Docs" }
  ];

const scrollToSection = (id) => {
	  const section = document.getElementById(id);
	  if (section) {
		section.scrollIntoView({ behavior: "smooth" });
	  }
	};
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
    <div className="min-h-screen bg-gray-100 text-gray-900 overflow-x-hidden relative text-sm" style={{ fontFamily: "'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Product+Sans:wght@400;500;700&display=swap');
      `}</style>
      
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-gray-100 to-blue-200"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/30 via-gray-100/5 to-transparent"></div>
      </div>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <header className={`w-full py-3 px-6 md:px-8 flex justify-between items-center fixed top-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? "backdrop-blur-xl bg-gray-100/95 shadow-xl border-b border-blue-200" : "backdrop-blur-md bg-gray-100/80"
      }`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href='/'}>
		  <div className="w-10 h-10 flex items-center justify-center">
			<img 
			  src={CompanyLogo} 
			  alt="Company Logo" 
			  className="h-10 w-10 object-contain" 
			/>
		  </div>
		  <h1 className="text-lg font-bold text-blue-600">
			Verve Hub WriteUps
		  </h1>
		</div>
        <nav className="hidden md:flex items-center space-x-6 text-xs tracking-wide">
		  <button
			onClick={() => scrollToSection("content")}
			className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
		  >
			Content
		  </button>

		  <button
			onClick={() => scrollToSection("categories")}
			className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
		  >
			Categories
		  </button>

		  <button
			onClick={() => scrollToSection("stats")}
			className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
		  >
			Stats
		  </button>

		  <button
			onClick={() => scrollToSection("testimonials")}
			className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
		  >
			Reviews
		  </button>

		  {/* Sign In Button */}
		  <Link
			to="/login"
			className="ml-4 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors"
		  >
			Sign In
		  </Link>
		</nav>
        <button 
          className="md:hidden text-blue-600 hover:text-blue-700 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isMenuOpen && (
		  <div className="fixed inset-0 z-40 bg-gray-100/98 backdrop-blur-2xl md:hidden pt-24 px-8 animate-in fade-in slide-in-from-top">
			<nav className="flex flex-col space-y-6 text-base">
			  <a href="#content" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium border-b border-gray-200 pb-4">Content</a>
			  <a href="#categories" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium border-b border-gray-200 pb-4">Categories</a>
			  <a href="#stats" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium border-b border-gray-200 pb-4">Stats</a>
			  <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium border-b border-gray-200 pb-4">Reviews</a>

			  {/* Mobile Sign In */}
			  <Link
				to="/login"
				onClick={() => setIsMenuOpen(false)}
				className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors"
			  >
				Sign In
			  </Link>
			</nav>
		  </div>
		)}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 pt-32 pb-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 border border-green-300 rounded-full mb-8 backdrop-blur-sm hover:scale-105 transition-transform">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 font-medium">Live: New Writeups coming up</span>
        </div>

        <h2 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-8 leading-tight">
          <span className="text-blue-600">
            Verve Hub WriteUps
          </span>
          <br />
          <span className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-700 mt-4 block">
            Master Cybersecurity Through Practice
          </span>
        </h2>
        
        <p className="max-w-3xl text-gray-600 text-lg sm:text-xl mb-12 leading-relaxed">
          Deep-dive CTF writeups, TryHackMe walkthroughs, and comprehensive learning resources. 
          <span className="block mt-3 text-gray-800 font-semibold text-xl">From reconnaissance to privilege escalation everything documented.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-5 mb-16">
          <a
            href="/login"
            className="group flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-2xl shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50"
          >
            <LogIn size={20} />
            <span>Start Learning</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#content"
            className="flex items-center justify-center gap-3 px-10 py-4 border-2 border-blue-300 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-semibold rounded-2xl backdrop-blur-sm transition-all hover:scale-105"
          >
            <BookOpen size={20} />
            <span>Browse Content</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl w-full">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-100/80 backdrop-blur-sm border border-blue-200 rounded-xl p-4 hover:border-blue-400 transition-all hover:scale-105 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <a href="#content" className="absolute bottom-8 animate-bounce cursor-pointer">
          <ChevronDown size={32} className="text-blue-500 hover:text-blue-600 transition-colors" />
        </a>
      </section>

      <section id="content" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold mb-4 text-blue-600">
              Latest Writeups & Guides
            </h3>
            <p className="text-gray-600 text-lg">New content added weekly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentContent.map((item, index) => (
              <div key={index} className="group relative bg-white backdrop-blur-sm rounded-2xl p-6 border border-blue-200 hover:border-blue-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl group-hover:bg-blue-200/50 transition-colors"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                      item.difficulty === "Easy" ? "bg-green-100 text-green-700 border border-green-300" :
                      item.difficulty === "Hard" ? "bg-red-100 text-red-700 border border-red-300" :
                      "bg-blue-100 text-blue-700 border border-blue-300"
                    }`}>
                      {item.difficulty}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-lg border border-blue-300">
                      {item.category}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded border border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-2 transition-transform">
                    <span>Read Writeup</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 font-semibold rounded-xl backdrop-blur-sm transition-all hover:scale-105"
            >
              View All Content
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      <section id="categories" className="py-20 px-6 bg-blue-50/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">Content Categories</h3>
            <p className="text-gray-600 text-lg">Organized learning paths for your cybersecurity journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contentCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="group relative bg-white backdrop-blur-sm rounded-2xl p-8 border border-blue-200 hover:border-blue-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 text-center overflow-hidden">
                  <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 group-hover:scale-110 transition-all shadow-lg`}>
                    <Icon size={36} className="text-white" />
                  </div>
                  
                  <h4 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h4>
                  
                  <div className="text-4xl font-bold text-blue-600 mb-3">
                    {category.count}
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">Why Verve Hub?</h3>
            <p className="text-gray-600 text-lg">Everything you need to level up your security skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Code, color: "from-blue-500 to-blue-600", title: "Step-by-Step Methodology", desc: "Writeups includes detailed enumeration, exploitation, and privilege escalation steps with command breakdowns." },
              { icon: Terminal, color: "from-purple-500 to-pink-600", title: "Tool Mastery Guides", desc: "Learn to use essential tools like Nmap, Burp Suite, Metasploit, and custom scripts effectively in practical scenarios." },
              { icon: Award, color: "from-green-500 to-emerald-600", title: "Certification Prep", desc: "Content aligned with OSCP, CEH, and other certifications. Practice with exam-style challenges and methodology." },
              { icon: FileText, color: "from-yellow-500 to-orange-600", title: "Comprehensive Notes", desc: "Downloadable cheatsheets, study guides, and reference materials for quick revision and interview prep." },
              { icon: TrendingUp, color: "from-blue-500 to-cyan-600", title: "Regular Updates", desc: "New writeups added weekly covering the latest challenges and emerging attack techniques." },
              { icon: Users, color: "from-red-500 to-pink-600", title: "Community Driven", desc: "Verve Hub is free for every passionate security enthusiasts." }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group bg-white backdrop-blur-sm rounded-2xl p-8 border border-blue-200 hover:border-blue-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-6 bg-blue-50/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">Success Stories</h3>
            <p className="text-gray-600 text-lg">How Verve Hub helped others level up</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white backdrop-blur-sm rounded-3xl p-6 md:p-16 border border-blue-200 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>
              
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
                  <p className="text-xl md:text-2xl text-gray-800 mb-8 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-xl font-bold text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-blue-600 text-lg">{testimonial.name}</div>
                      <div className="text-gray-600">{testimonial.role}</div>
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
                        ? "bg-blue-600 w-10 h-3" 
                        : "bg-blue-300 w-3 h-3 hover:bg-blue-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-blue-50/50 to-blue-100/50"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-100 border border-blue-300 rounded-full mb-8">
            <Zap size={18} className="text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">Join 100+ Active Users</span>
          </div>
          
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-blue-600">
            Ready to Master Cybersecurity?
          </h3>
          <p className="text-gray-700 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Access detailed CTF writeups, TryHackMe walkthroughs, and learning resources. 
            <span className="block mt-2 text-gray-900 font-semibold">Start your journey today.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/login"
              className="group flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50"
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#content"
              className="flex items-center justify-center gap-3 px-10 py-5 border-2 border-blue-300 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-bold text-lg rounded-2xl backdrop-blur-sm transition-all hover:scale-105"
            >
              <BookOpen size={16} />
              <span>Explore Content</span>
            </a>
          </div>

          <p className="mt-8 text-gray-600 text-sm">
            No credit card required • Free forever • 100+ writeups
          </p>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 bg-blue-50/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">Get In Touch</h3>
          <p className="text-gray-600 mb-10 text-lg">
            Have questions? Want to contribute? Reach out through any channel below.
          </p>
          
          <div className="flex justify-center gap-6 mb-12">
            <a 
              href="https://github.com/verveblog.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-16 h-16 flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-400 rounded-2xl transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <Github size={28} className="text-gray-700 group-hover:text-blue-600" />
            </a>
            <a 
              href="https://linkedin.com/in/iddy-chesire-55009b264/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-16 h-16 flex items-center justify-center bg-white hover:bg-gray-50 border border-blue-200 hover:border-blue-400 rounded-2xl transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <Linkedin size={28} className="text-blue-600 group-hover:text-blue-700" />
            </a>
            <a 
              href="https://twitter.com/iddychesire" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-16 h-16 flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-400 rounded-2xl transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <Twitter size={28} className="text-gray-700 group-hover:text-blue-600" />
            </a>
			<a 
              href="mailto:iddychesire@gmail.com" 
              target="_blank" 
              className="group w-16 h-16 flex items-center justify-center bg-white hover:bg-gray-50 border border-green-200 hover:border-blue-400 rounded-2xl transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <Mail size={28} className="text-green-600 group-hover:text-blue-600" />
            </a>
          </div>

          <div className="bg-white backdrop-blur-sm rounded-2xl p-8 border border-blue-200">
            <p className="text-gray-700 mb-4">
              Want to contribute your own writeups or learning materials?
            </p>
            <a
              href="mailto:vervehubwriteups@gmail.com"
              className="inline-flex items-center gap-2 text-red-600 hover:text-green-700 font-semibold transition-colors"
            >
              vervehubwriteups@gmail.com
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <footer className="py-10 px-6 bg-white backdrop-blur-sm border-t border-blue-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Lock size={20} className="text-white" />
                </div>
                <h1 className="text-1xl font-bold text-blue-600">
                  Verve Hub Writeups
                </h1>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Your comprehensive resource for cybersecurity learning. From beginner CTF challenges to advanced penetration testing techniques.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com/verveblog.git" className="text-blue-500 hover:text-blue-600 transition-colors">
                  <Github size={20} />
                </a>
                <a href="https://linkedin.com/in/iddy-chesire-55009b264/" className="text-blue-500 hover:text-blue-600 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="https://twitter.com/iddychesire" className="text-blue-500 hover:text-blue-600 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Content</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/login" className="hover:text-blue-600 transition-colors">CTF Writeups</a></li>
                <li><a href="https://tryhackme.com" className="hover:text-blue-600 transition-colors">TryHackMe Rooms</a></li>
                <li><a href="/signup" className="hover:text-blue-600 transition-colors">Learning Guides</a></li>
                <li><a href="/signup" className="hover:text-blue-600 transition-colors">Tool Tutorials</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/about" className="hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="/contribute" className="hover:text-blue-600 transition-colors">Contribute</a></li>
                <li><a href="/community" className="hover:text-blue-600 transition-colors">Community</a></li>
                <li><a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-200 text-center">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} Verve Hub. Empowering cybersecurity learners worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}