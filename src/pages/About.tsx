import { Link, useNavigate } from "react-router-dom";
import { PenTool, ArrowLeft, Shield, Terminal, Code, Zap, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  const navigate = useNavigate();

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
        {[...Array(12)].map((_, i) => (
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
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 50%, #06b6d4 100%);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Back Button */}
        <div className="flex justify-start mb-8 sm:mb-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 font-mono text-xs sm:text-sm text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400/50 bg-gray-900/50 hover:bg-cyan-500/10 transition-all px-3 sm:px-4 py-2"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 mb-4 sm:mb-6">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight px-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 shimmer-text">
              About Verve Hub WriteUps
            </span>
          </h1>

          <div className="flex items-center justify-center gap-2 text-cyan-400/50">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cyan-400/50"></div>
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cyan-400/50"></div>
          </div>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 font-mono leading-relaxed max-w-2xl mx-auto px-4">
            A modern space dedicated to sharing insights in cybersecurity, programming, and technology. 
            Built to inspire, educate, and empower tech enthusiasts through practical knowledge and 
            write-ups that make complex concepts simple.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12 px-2">
          <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 sm:p-6 text-center hover:border-cyan-500/40 transition-all group">
            <div className="p-2 sm:p-3 bg-cyan-500/10 rounded-lg inline-flex mb-3 group-hover:bg-cyan-500/20 transition-colors">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
            </div>
            <h3 className="text-cyan-300 font-mono font-semibold mb-2 text-sm sm:text-base">Mission</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Simplify complex security concepts</p>
          </div>
          <div className="bg-gradient-to-br from-blue-950/30 to-indigo-950/30 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4 sm:p-6 text-center hover:border-blue-500/40 transition-all group">
            <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg inline-flex mb-3 group-hover:bg-blue-500/20 transition-colors">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
            </div>
            <h3 className="text-blue-300 font-mono font-semibold mb-2 text-sm sm:text-base">Vision</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Empower continuous learning</p>
          </div>
          <div className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 backdrop-blur-sm border border-green-500/20 rounded-lg p-4 sm:p-6 text-center hover:border-green-500/40 transition-all group sm:col-span-2 md:col-span-1">
            <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg inline-flex mb-3 group-hover:bg-green-500/20 transition-colors">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
            </div>
            <h3 className="text-green-300 font-mono font-semibold mb-2 text-sm sm:text-base">Impact</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Build secure digital experiences</p>
          </div>
        </div>

        {/* Owner Section */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-cyan-500/30 rounded-xl p-5 sm:p-6 md:p-8 backdrop-blur-sm shadow-lg shadow-cyan-500/10 mb-8 sm:mb-12 mx-2 sm:mx-0">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/30">
                <Code className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl font-display font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Iddy Chesire
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <span className="px-2 sm:px-3 py-1 bg-cyan-950/30 border border-cyan-500/30 rounded-full text-[10px] sm:text-xs font-mono text-cyan-300">
                  Founder
                </span>
                <span className="px-2 sm:px-3 py-1 bg-blue-950/30 border border-blue-500/30 rounded-full text-[10px] sm:text-xs font-mono text-blue-300">
                  Software Developer
                </span>
                <span className="px-2 sm:px-3 py-1 bg-green-950/30 border border-green-500/30 rounded-full text-[10px] sm:text-xs font-mono text-green-300">
                  Cybersecurity Researcher
                </span>
                <span className="px-2 sm:px-3 py-1 bg-green-950/30 border border-green-500/30 rounded-full text-[10px] sm:text-xs font-mono text-cyan-300">
                  Network Associate
                </span>
                <span className="px-2 sm:px-3 py-1 bg-cyan-950/30 border border-green-500/30 rounded-full text-[10px] sm:text-xs font-mono text-red-300">
                  RedHat Certified Sys Admin
                </span>
              </div>
              <p className="text-gray-300 font-mono text-xs sm:text-sm leading-relaxed">
                Passionate about building secure, user-focused digital experiences and 
                promoting continuous learning in technology. Dedicated to making learning cybersecurity 
                accessible through practical write-ups, walkthroughs, and hands-on guides.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4 sm:space-y-6 px-4">
          <p className="text-gray-400 font-mono text-sm sm:text-base md:text-lg">
            Explore the latest write-ups, walkthroughs, and cybersecurity guides.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <Link to="/blog" className="w-full sm:w-auto">
              <Button className="w-full group px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-sm sm:text-base hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/50 rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all">
                <PenTool className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-12 transition-transform" />
                View All Posts
              </Button>
            </Link>
            
            <Link to="/me/home" className="w-full sm:w-auto">
              <Button 
                variant="outline"
                className="w-full px-6 sm:px-8 py-4 sm:py-6 bg-gray-900/50 text-cyan-300 font-mono text-sm sm:text-base border border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400/50 rounded-lg transition-all"
              >
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-cyan-500/20 mx-2">
          <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-500/10 rounded-lg hover:border-cyan-500/30 transition-all">
            <p className="text-xl sm:text-2xl font-bold text-cyan-400 mb-1">24/7</p>
            <p className="text-[10px] sm:text-xs text-gray-500 font-mono">Available</p>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border border-blue-500/10 rounded-lg hover:border-blue-500/30 transition-all">
            <p className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">Active</p>
            <p className="text-[10px] sm:text-xs text-gray-500 font-mono">Community</p>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-green-950/20 to-emerald-950/20 border border-green-500/10 rounded-lg hover:border-green-500/30 transition-all">
            <p className="text-xl sm:text-2xl font-bold text-green-400 mb-1">Secure</p>
            <p className="text-[10px] sm:text-xs text-gray-500 font-mono">Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}