import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle, ArrowLeft, Search, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-white to-blue-900 text-gray-900 relative overflow-hidden px-4">
      {/* Animated grid background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
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
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.6); }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      `}</style>

      <div className="text-center space-y-6 sm:space-y-8 relative z-10 max-w-2xl">
        {/* 404 Icon */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* 404 Text with glitch effect */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 mb-4 font-mono tracking-wider">
          404
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-cyan-400/50"></div>
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-cyan-400/50"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Oops! Page Not Found
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 font-mono max-w-md mx-auto leading-relaxed px-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          {/* Attempted Path */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-950/20 border border-red-500/30 rounded-lg text-xs sm:text-sm font-mono text-red-300">
            <Search className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate max-w-[200px] sm:max-w-xs">{location.pathname}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-4 sm:pt-6">
          <Link to="/me" className="w-full sm:w-auto">
            <button className="group w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-sm sm:text-base rounded-lg border border-cyan-400/50 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
              Return to Home
            </button>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-900/50 hover:bg-gray-800/50 text-cyan-300 font-mono text-sm sm:text-base rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>

        {/* Helper Text */}
        <div className="pt-8 sm:pt-12 border-t border-cyan-500/20 mt-8 sm:mt-12">
          <p className="text-xs sm:text-sm text-gray-500 font-mono">
            <span className="text-cyan-400">404_NOT_FOUND</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;