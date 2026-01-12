import { Link, useNavigate } from "react-router-dom";
import { Menu, Cpu, ChevronDown, BookOpen, HelpCircle, Home, ExternalLink, Github, CheckCircle2, Bell, Settings, LogOut, TrendingUp, Award } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { VerveHubLogo } from "./VerveHubLogo";
import { useLiveNotifications } from "@/hooks/useLiveNotifications";
import ThemeSwitcherIcon from "./ThemeSwitcherIcon";
import GlobalSearch from "./GlobalSearch";

interface User {
  name: string;
  email: string;
  profileImage: string;
}

interface NavItem {
  label: string;
  path: string;
  external?: boolean;
  icon?: JSX.Element;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Courses", path: "/v/courses", icon: <HelpCircle size={16} /> },
  { label: "My Progress", path: "/v/my-progress", icon: <TrendingUp size={16} /> },
  { label: "My Certificates", path: "/v/my-certificates", icon: <Award size={16} /> },
  { label: "Resources", path: "/v/resources" },
  {
    label: "Learn",
    path: "https://tryhackme.com",
    external: true,
    icon: <HelpCircle size={16} />
  },
];

// Custom hook for click outside detection
const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, handler]);
};

export const Header = ({ onToggleSidebar }: { onToggleSidebar?: () => void }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Enhanced hook usage with unreadCount
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useLiveNotifications();

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

  // Optimized scroll handler with useCallback
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  
  // Click outside handlers using custom hook
  useClickOutside(notificationRef, () => setShowNotifications(false));
  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  // Enhanced mark all as read with auto-close
  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead();
    // Optional: Auto-close after marking all as read
    setTimeout(() => setShowNotifications(false), 500);
  }, [markAllAsRead]);
	
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
          scrolled ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg shadow-md border-b border-gray-200/60 dark:border-gray-800/60" 
            : "bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-left justify-between h-16">
            {/* Left side: Hamburger + Logo */}
            <div className="flex items-center gap-3 ml-2">
              {/* Hamburger Menu Button (always visible, fixed before logo) */}
              <button
                onClick={onToggleSidebar}
                className="p-0.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 mr-2"
                aria-label="Toggle sidebar"
              >
                <Menu size={20} />
              </button>

              {/* Logo */}
              <Link
                to="/v"
                className="flex items-center gap-2 group"
                aria-label="Go to homepage"
              >
                <VerveHubLogo size="md" />
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                    Verve Hub Academy
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                    Security Hub
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Navigation Links (hidden on mobile, shown on lg) */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                item.external ? (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {item.icon}
                    {item.label}
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Right side: Actions */}
            <nav className="flex items-center gap-2">
              {/* Global Search */}
              <GlobalSearch />

              {/* Divider */}
              <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1" />
              <div className="hidden md:block w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2" />

              {/* Theme Switcher */}
              <ThemeSwitcherIcon />

              {/* Divider */}
              <div className="hidden md:block w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2" />

              {/* Enhanced Notification Dropdown */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                  aria-label="Toggle notifications"
                >
                  <Bell size={20} />
                  {/* Numeric badge instead of just ping */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold px-1 shadow-lg animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-96 max-h-[32rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col"
                  >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                        Notifications
                        {unreadCount > 0 && (
                          <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                            ({unreadCount} new)
                          </span>
                        )}
                      </h3>
                      {notifications.length > 0 && unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Notification list */}
                    <div className="flex-1 overflow-y-auto">
                      {notifications.length === 0 && (
                        <div className="px-4 py-12 text-center">
                          <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No notifications</p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">You're all caught up!</p>
                        </div>
                      )}

                      <AnimatePresence mode="popLayout">
                        {notifications.map((n) => {
                          const Icon = n.type === "document" ? Bell : CheckCircle2;
                          const isNew = new Date().getTime() - new Date(n.time).getTime() < 60000; // New if < 1 min old
                          
                          return (
                            <motion.div
                              key={n.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className={`relative flex items-start gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
                                !n.read ? "bg-blue-50/30 dark:bg-blue-900/10" : "bg-transparent"
                              }`}
                              onClick={() => {
                                if (!n.read) markAsRead(n.id);
                              }}
                            >
                              {/* Unread indicator dot */}
                              {!n.read && (
                                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                              
                              <Icon
                                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                  n.type === "document"
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-green-600 dark:text-green-400"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-gray-900 dark:text-white text-sm md:text-[15px] truncate">
                                    {n.title}
                                  </h4>
                                  {isNew && (
                                    <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-semibold rounded">
                                      NEW
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mt-0.5">
                                  {n.message}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 inline-block">
                                  {new Date(n.time).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                                </span>
                              </div>
                              {!n.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(n.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg leading-none flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                  aria-label="Mark as read"
                                >
                                  ×
                                </button>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-center text-xs text-gray-500 dark:text-gray-400">
                        {unreadCount > 0 ? (
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-green-600 dark:text-green-400">All caught up! ✓</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

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
      {/* Removed - WelcomeBanner sits directly below header */}

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
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={`${user.name}'s profileImage`}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-700 to-green-700 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
            {user?.name ? getInitials(user.name) : "U"}
          </div>
        )}
        <ChevronDown 
          size={16} 
          className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} 
        />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
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
                navigate("/v/account");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings size={16} className="text-gray-500 dark:text-gray-400" />
              <span>Settings</span>
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
        </motion.div>
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-red-700 dark:text-white">
          {redirecting ? "Logging out..." : "Confirm Logout"}
        </h2>
      </div>
      <div className="px-6 py-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {redirecting
            ? "You are being redirected to the login page."
            : "Are you sure you want to logout of your account?"}
        </p>
      </div>
      {!redirecting && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
    </motion.div>
  </div>
);