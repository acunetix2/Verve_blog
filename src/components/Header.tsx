import { Link, useNavigate } from "react-router-dom";
import { Terminal, Search,Cpu, PlusCircle, Shield, Activity, LogOut, Settings, ChevronDown, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useRef } from "react";
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
  },
];

export const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setRedirecting(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login");
    }, 1500);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/80 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-800/50" 
            : "bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
			  to="/home"
			  className="flex items-center gap-3 group"
			  aria-label="Go to homepage"
			>
			  <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center shadow-md shadow-red-500/40 group-hover:shadow-cyan-400/60 transition-shadow">
				<Cpu className="h-5 w-5 text-red-700 group-hover:text-green-700" strokeWidth={2.5} />
			  </div>
			  <div className="flex flex-col">
				<span className="text-sm md:text-base font-semibold text-red-700 dark:text-white tracking-tight">
				  Verve Hub DashBoard
				</span>
				<span className="text-[10px] md:text-xs font-medium text-green-700 dark:text-gray-500 tracking-wider uppercase">
				  Security Research
				</span>
			  </div>
			</Link>
            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {item.label}
                    <ExternalLink size={14} className="opacity-50" />
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}

              {/* Divider */}
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2" />

              {/* GitHub Button */}
              <a
                href="https://github.com/acunetix2/verve_blog.git"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Github size={16} />
                GitHub
              </a>

              {/* User Dropdown */}
              <UserDropdown
                user={user}
                open={dropdownOpen}
                setOpen={setDropdownOpen}
                onLogout={() => setLogoutModalOpen(true)}
                dropdownRef={dropdownRef}
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content jump */}
      <div className="h-16" />

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

// User Dropdown Component
const UserDropdown = ({
  user,
  open,
  setOpen,
  onLogout,
  dropdownRef,
}: {
  user: User | null;
  open: boolean;
  setOpen: (val: boolean) => void;
  onLogout: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="User menu"
        aria-expanded={open}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.name}'s avatar`}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
            {user?.name ? getInitials(user.name) : "U"}
          </div>
        )}
        <ChevronDown 
          size={16} 
          className={`text-gray-500 dark:text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} 
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden">
          {user && (
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {user.email}
              </p>
            </div>
          )}

          <div className="py-1">
            <button
              onClick={() => {
                navigate("/account");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings size={16} className="text-gray-500 dark:text-gray-400" />
              <span>Account Settings</span>
            </button>
            <button
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Logout Modal Component
const LogoutModal = ({
  redirecting,
  onClose,
  onConfirm,
}: {
  redirecting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {redirecting ? "Logging out..." : "Confirm Logout"}
        </h2>
      </div>
      <div className="px-6 py-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {redirecting
            ? "You are being redirected to the login page."
            : "Are you sure you want to log out of your account?"}
        </p>
      </div>
      {!redirecting && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>
      )}
      {redirecting && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Redirecting...</span>
          </div>
        </div>
      )}
    </div>
  </div>
);
