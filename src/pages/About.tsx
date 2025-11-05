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
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Back Button */}
        <div className="flex justify-start mb-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 font-mono text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400/50 bg-gray-900/50 hover:bg-cyan-500/10 transition-all"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 mb-6">
            <Shield className="h-10 w-10 text-cyan-400" />
          </div>

          <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400">
              About Verve Hub WriteUps
            </span>
          </h1>

          <div className="flex items-center justify-center gap-2 text-cyan-400/50">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-400/50"></div>
            <Shield className="h-5 w-5" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-400/50"></div>
          </div>

          <p className="text-lg md:text-xl text-gray-300 font-mono leading-relaxed max-w-2xl mx-auto">
            A modern space dedicated to sharing insights in cybersecurity, programming, and technology. 
            Built to inspire, educate, and empower tech enthusiasts through practical knowledge and 
            write-ups that make complex concepts simple.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 text-center">
            <Target className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-cyan-300 font-mono font-semibold mb-2">Mission</h3>
            <p className="text-gray-400 text-sm">Simplify complex security concepts</p>
          </div>
          <div className="bg-gradient-to-br from-blue-950/30 to-indigo-950/30 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 text-center">
            <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-blue-300 font-mono font-semibold mb-2">Vision</h3>
            <p className="text-gray-400 text-sm">Empower continuous learning</p>
          </div>
          <div className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 text-center">
            <Zap className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-green-300 font-mono font-semibold mb-2">Impact</h3>
            <p className="text-gray-400 text-sm">Build secure digital experiences</p>
          </div>
        </div>

        {/* Owner Section */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm shadow-lg shadow-cyan-500/10 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/30">
                <Code className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-display font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Iddy Chesire
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <span className="px-3 py-1 bg-cyan-950/30 border border-cyan-500/30 rounded-full text-xs font-mono text-cyan-300">
                  Cybersecurity Researcher
                </span>
                <span className="px-3 py-1 bg-blue-950/30 border border-blue-500/30 rounded-full text-xs font-mono text-blue-300">
                  Software Developer
                </span>
                <span className="px-3 py-1 bg-green-950/30 border border-green-500/30 rounded-full text-xs font-mono text-green-300">
                  Founder
                </span>
				<span className="px-3 py-1 bg-green-950/30 border border-green-500/30 rounded-full text-xs font-mono text-cyan-300">
				Network Associate
				</span>
				<span className="px-3 py-1 bg-cyan-950/30 border border-green-500/30 rounded-full text-xs font-mono text-red-300">
				RedHat Certified Sys Admin
				</span>
              </div>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                Passionate about building secure, user-focused digital experiences and 
                promoting continuous learning in technology. Dedicated to making cybersecurity 
                accessible through practical write-ups, walkthroughs, and hands-on guides.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <p className="text-gray-400 font-mono text-lg">
            Explore the latest write-ups, walkthroughs, and cybersecurity guides.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/blog">
              <Button className="group px-8 py-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-base hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/50 rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all">
                <PenTool className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                View All Posts
              </Button>
            </Link>
            
            <Link to="/">
              <Button 
                variant="outline"
                className="px-8 py-6 bg-gray-900/50 text-cyan-300 font-mono text-base border border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400/50 rounded-lg transition-all"
              >
                <Shield className="h-5 w-5 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-3 gap-4 mt-16 pt-8 border-t border-cyan-500/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400 mb-1">24/7</p>
            <p className="text-xs text-gray-500 font-mono">Available</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400 mb-1">Active</p>
            <p className="text-xs text-gray-500 font-mono">Community</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400 mb-1">Secure</p>
            <p className="text-xs text-gray-500 font-mono">Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}