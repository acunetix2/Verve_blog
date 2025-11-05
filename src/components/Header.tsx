import { Link } from "react-router-dom";
import { Terminal, Search, PlusCircle, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-gradient-to-r from-gray-950/95 via-black/95 to-blue-950/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-cyan-500/5">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo Section */}
        <Link 
          to="/" 
          className="group flex items-center gap-3 hover:opacity-90 transition-all"
        >
          <div className="relative">
            <Activity className="h-7 w-7 text-green-500 group-hover:text-cyan-300 transition-colors" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-[length:200%_auto] animate-gradient">
              VERVE HUB WRITEUPS
            </span>
            <span className="text-[10px] font-mono text-cyan-500/70 -mt-1">
              SECURITY • RESEARCH • KNOWLEDGE
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            to="/about"
            className="group text-sm font-mono text-gray-400 hover:text-cyan-400 transition-all relative"
          >
            <span className="relative z-10">About</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          <Link
            to="/blog"
            className="group text-sm font-mono text-gray-400 hover:text-cyan-400 transition-all relative"
          >
            <span className="relative z-10">Posts</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          <a
            href="https://tryhackme.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-sm font-mono text-gray-400 hover:text-cyan-400 transition-all relative"
          >
            <span className="relative z-10 flex items-center gap-1">
              Learn
              <Activity size={12} className="text-green-500 animate-pulse" />
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
          </a>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 ml-2">
            <Button
              variant="outline"
              size="sm"
              className="group font-mono rounded-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/50 transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>
        </nav>
      </div>

      {/* Animated gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </header>
  );
};