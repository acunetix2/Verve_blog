import { Link, useNavigate } from "react-router-dom";
import { Terminal, Search, PlusCircle, Shield, Activity, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface NavItem {
  label: string;
  path: string;
  external?: boolean;
  icon?: JSX.Element;
}

const NAV_ITEMS: NavItem[] = [
  { label: "About", path: "/about" },
  { label: "Posts", path: "/blog" },
  { label: "Resources", path: "/resources" },
  {
    label: "Learn",
    path: "https://tryhackme.com",
    external: true,
    icon: <Activity size={12} className="text-green-500 animate-pulse" />,
  },
];

export const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = () => {
    setRedirecting(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login");
    }, 1500);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-gradient-to-r from-gray-950/95 via-black/95 to-blue-950/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-cyan-500/5">
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3 hover:opacity-90 transition-all"
            aria-label="Go to homepage"
          >
            <div className="relative">
              <Activity className="h-7 w-7 text-green-500 group-hover:text-cyan-300 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
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
            {NAV_ITEMS.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-sm font-mono text-gray-400 hover:text-cyan-400 transition-all relative flex items-center gap-1"
                >
                  {item.label} {item.icon}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  className="group text-sm font-mono text-gray-400 hover:text-cyan-400 transition-all relative"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )
            )}

            {/* User Dropdown */}
            <UserDropdown
              user={user}
              open={dropdownOpen}
              setOpen={setDropdownOpen}
              onLogout={() => setLogoutModalOpen(true)}
            />
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </header>

      {logoutModalOpen && (
        <LogoutModal
          redirecting={redirecting}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
};

// Reusable User Dropdown Component
const UserDropdown = ({
  user,
  open,
  setOpen,
  onLogout,
}: {
  user: User | null;
  open: boolean;
  setOpen: (val: boolean) => void;
  onLogout: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative ml-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-cyan-950/20 transition-all text-cyan-200"
        aria-label="User menu"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.name}'s avatar`}
            className="w-6 h-6 rounded-full object-cover border border-cyan-600"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-gray-900 font-bold text-xs">
            U
          </div>
        )}
        <span className="hidden sm:inline text-sm">{user?.name || "Me"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-gray-900/90 border border-cyan-700 rounded-lg shadow-lg flex flex-col animate-fade-in">
          <button
            onClick={() => navigate("/account")}
            className="w-full text-left px-4 py-2 hover:bg-cyan-950/50 text-cyan-200 flex items-center gap-2 transition"
          >
            <Settings size={16} /> Account
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 hover:bg-red-900/50 text-red-400 flex items-center gap-2 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

// Reusable Logout Modal Component
const LogoutModal = ({
  redirecting,
  onClose,
  onConfirm,
}: {
  redirecting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-xl p-6 w-80 border border-cyan-700 shadow-xl flex flex-col gap-4 animate-fade-in">
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
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
);
