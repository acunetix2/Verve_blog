import { Link, useNavigate } from "react-router-dom";
import { Terminal, Search, PlusCircle, Shield, Activity, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    setRedirecting(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login");
    }, 1500); // 1.5s delay to show message
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-gradient-to-r from-gray-950/95 via-black/95 to-blue-950/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-cyan-500/5">
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Logo Section */}
          <Link to="/" className="group flex items-center gap-3 hover:opacity-90 transition-all">
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
            <Link to="/about" className="group text-sm font-mono text-gray-400 hover:text-cyan-400 transition-all relative">
              <span className="relative z-10">About</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/blog" className="group text-sm font-mono text-gray-400 hover:text-cyan-400 transition-all relative">
              <span className="relative z-10">Posts</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/resources" className="group text-sm font-mono text-gray-400 hover:text-cyan-400 transition-all relative">
              <span className="relative z-10">Resources</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a href="https://tryhackme.com" target="_blank" rel="noopener noreferrer" className="group text-sm font-mono text-gray-400 hover:text-cyan-400 transition-all relative">
              <span className="relative z-10 flex items-center gap-1">
                Learn
                <Activity size={12} className="text-green-500 animate-pulse" />
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 ml-2 relative">
              {/* User / Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-cyan-950/20 transition-all text-cyan-200"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover border border-cyan-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-gray-900 font-bold text-xs">U</div>
                  )}
                  <span className="hidden sm:inline text-sm">{user?.name || "Me"}</span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-gray-900/90 border border-cyan-700 rounded-lg shadow-lg flex flex-col">
                    <button
                      onClick={() => navigate("/account")}
                      className="w-full text-left px-4 py-2 hover:bg-cyan-950/50 text-cyan-200 flex items-center gap-2"
                    >
                      <Settings size={16} /> Account
                    </button>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full text-left px-4 py-2 hover:bg-red-900/50 text-red-400 flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* Animated gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-80 border border-cyan-700 shadow-xl flex flex-col gap-4">
            <h2 className="text-cyan-400 font-bold text-lg">
              {redirecting ? "Redirecting..." : "Confirm Logout"}
            </h2>
            <p className="text-gray-300 text-sm">
              {redirecting
                ? "You are being redirected to the login page."
                : "Are you sure you want to log out?"}
            </p>
            {!redirecting && (
              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
