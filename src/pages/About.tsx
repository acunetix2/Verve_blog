import { PenTool, Shield, Code, Zap, Target, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function About() {
const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900">
      {/* Animated grid background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(37, 99, 235, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.15) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              background: `radial-gradient(circle, rgba(37, 99, 235, ${0.3 + Math.random() * 0.3}) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(30px, -40px) scale(1.1); opacity: 0.5; }
          50% { transform: translate(-20px, -80px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(40px, -40px) scale(1.05); opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.2), 0 0 40px rgba(37, 99, 235, 0.1); }
          50% { box-shadow: 0 0 30px rgba(37, 99, 235, 0.3), 0 0 60px rgba(37, 99, 235, 0.15); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #2563eb 0%, #3b82f6 25%, #60a5fa 50%, #3b82f6 75%, #2563eb 100%);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/30 mb-6" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
            <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight px-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shimmer-text">
              About Verve Hub WriteUps
            </span>
          </h1>

          <div className="flex items-center justify-center gap-3 text-blue-500">
            <div className="h-0.5 w-12 sm:w-16 bg-gradient-to-r from-transparent via-blue-500 to-blue-500 rounded-full"></div>
            <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
            <div className="h-0.5 w-12 sm:w-16 bg-gradient-to-l from-transparent via-blue-500 to-blue-500 rounded-full"></div>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto px-4 font-medium">
            A modern space dedicated to sharing insights in cybersecurity, programming, and technology. 
            Built to inspire, educate, and empower tech enthusiasts through practical knowledge and 
            write-ups that make complex concepts simple.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 px-2">
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 sm:p-8 text-center hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl inline-flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-blue-600 font-bold mb-2 text-lg">Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Simplify complex security concepts for everyone</p>
          </div>
          
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 sm:p-8 text-center hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl inline-flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-blue-600 font-bold mb-2 text-lg">Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Empower continuous learning and growth</p>
          </div>
          
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 sm:p-8 text-center hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 group cursor-pointer sm:col-span-2 md:col-span-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl inline-flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-blue-600 font-bold mb-2 text-lg">Impact</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Build secure digital experiences</p>
          </div>
        </div>

        {/* Owner Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-blue-500/40 mb-12 sm:mb-16 mx-2 sm:mx-0 border border-blue-400/30">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-blue-900/30 ring-4 ring-blue-400/50">
                <Code className="h-12 w-12 sm:h-14 sm:w-14 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-black mb-4 text-white">
                Iddy Chesire
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-xs font-semibold text-white">
                  Founder
                </span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-xs font-semibold text-white">
                  Software Developer
                </span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-xs font-semibold text-white">
                  Cybersecurity Researcher
                </span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-xs font-semibold text-white">
                  Network Associate
                </span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-xs font-semibold text-white">
                  RedHat Certified Sys Admin
                </span>
              </div>
              <p className="text-blue-50 text-sm sm:text-base leading-relaxed">
                Passionate about building secure, user-focused digital experiences and 
                promoting continuous learning in technology. Dedicated to making cybersecurity 
                accessible through practical write-ups, walkthroughs, and hands-on guides.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
       <div className="text-center space-y-6 px-4 mb-12">
		  <p className="text-gray-700 text-base sm:text-lg font-medium">
			Explore the latest write-ups, walkthroughs, and cybersecurity guides.
		  </p>

		  <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
			<button
			  onClick={() => navigate("/me/blog")} // redirect to posts page
			  className="w-full sm:w-auto group px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 border-2 border-blue-500"
			>
			  <PenTool className="h-5 w-5 mr-2 inline group-hover:rotate-12 transition-transform" />
			  View All Posts
			</button>

			<button
			  onClick={() => navigate("/me")} // redirect to home page
			  className="w-full sm:w-auto px-8 py-6 bg-white text-blue-600 font-bold text-base border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-500 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
			>
			  <Shield className="h-5 w-5 mr-2 inline" />
			  Return Home
			</button>
		  </div>
		</div>

        {/* Stats Footer */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 pt-8 border-t-2 border-blue-200 mx-2">
          <div className="text-center p-5 sm:p-6 bg-white border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <p className="text-3xl sm:text-4xl font-black text-blue-600 mb-2">24/7</p>
            <p className="text-xs sm:text-sm text-gray-600 font-semibold">Available</p>
          </div>
          <div className="text-center p-5 sm:p-6 bg-white border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <p className="text-3xl sm:text-4xl font-black text-blue-600 mb-2">Active</p>
            <p className="text-xs sm:text-sm text-gray-600 font-semibold">Community</p>
          </div>
          <div className="text-center p-5 sm:p-6 bg-white border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <p className="text-3xl sm:text-4xl font-black text-blue-600 mb-2">Secure</p>
            <p className="text-xs sm:text-sm text-gray-600 font-semibold">Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}