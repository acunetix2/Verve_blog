import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import axios from "axios";

interface WelcomeBannerProps {
  onLoadingChange?: (loading: boolean) => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onLoadingChange }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!userName;
  
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserName(res.data.name || res.data.email?.split("@")[0] || "User");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    };
    
    fetchUserName();
  }, [onLoadingChange]);
  
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-700 dark:via-purple-700 dark:to-blue-700 rounded-2xl border-b-2 border-indigo-400/50 dark:border-indigo-600 shadow-xl"
      style={{ fontFamily: "'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-white/15 to-transparent rounded-full -mr-40 -mt-40 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-white/15 to-transparent rounded-full -ml-20 -mb-20 blur-3xl"></div>

      <div className="relative z-10 px-6 sm:px-8 py-5 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-yellow-300" />
              </motion.div>
              <span className="text-xs font-bold text-yellow-200 uppercase tracking-wider">
                {getTimeGreeting()}
              </span>
            </div>
            
            {!loading && isLoggedIn ? (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                  {getTimeGreeting()}, <span className="text-yellow-300">{userName}</span> 👋
                </h2>
                <p className="text-indigo-100 text-xs sm:text-sm mt-1 font-medium">
                  Continue exploring cybersecurity challenges and level up your hacking skills.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                  Welcome to <span className="text-yellow-300">Verve Hub</span> 🚀
                </h2>
                <p className="text-indigo-100 text-xs sm:text-sm mt-1 font-medium">
                  Explore writeups, hacking tutorials, and security challenges.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
