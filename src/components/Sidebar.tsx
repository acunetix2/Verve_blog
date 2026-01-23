import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Archive,
  GraduationCap,
  ExternalLink,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Github,
  Wallet,
  Activity,
  Menu,
  HelpCircle,
  X,
  Award,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  external?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/v", icon: <Home size={20} /> },
  { label: "WriteUps", path: "/v/blog", icon: <Archive size={20} /> },
  { label: "Courses", path: "/v/courses", icon: <BookOpen size={20} /> },
  { label: "My Progress", path: "/v/my-progress", icon: <TrendingUp size={20} /> },
  { label: "My Certificates", path: "/v/my-certificates", icon: <Award size={20} /> },
  { label: "Resources", path: "/v/resources", icon: <Layers size={16} /> },
  { label: "Billing", path: "/v/billing", icon: <Wallet size={16} /> },
  { label: "Simulations", path: "/v/simulations", icon: <Activity size={16} /> },
  { label: "Learn", path: "https://tryhackme.com", external: true, icon: <HelpCircle size={20} /> },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: () => void;
  sidebarOpen: boolean;
  onCloseSidebar?: () => void;
}

export default function Sidebar({ collapsed = false, onCollapse, sidebarOpen, onCloseSidebar }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fontStyle = {
    fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
    fontSize: "0.8125rem",
  };

  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  useEffect(() => {
    if (!containerRef.current) return;
    const active = containerRef.current.querySelector(".verve-nav-item-active") as HTMLElement | null;
    if (!active) return;
    const top = active.offsetTop;
    const height = active.offsetHeight;
    if (activeRef.current) {
      activeRef.current.style.transform = `translateY(${top}px)`;
      activeRef.current.style.height = `${height}px`;
      activeRef.current.style.opacity = "1";
    }
  }, [location.pathname, isCollapsed]);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapse?.();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
    setShowLogoutModal(false);
    onCloseSidebar?.();
  };

  // Hide sidebar completely if collapsed on desktop
  if (isCollapsed && window.innerWidth >= 1024) {
    return null;
  }

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && onCloseSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseSidebar}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
              <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
              Sign Out?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to sign out? You'll be redirected to the login page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        ref={containerRef}
        className={`fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out h-screen flex flex-col overflow-hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg`}
        style={{
          fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
          paddingTop: '4rem',
        }}
      >
        {/* Close Button (Mobile Only) */}
        {sidebarOpen && onCloseSidebar && (
          <button
            onClick={onCloseSidebar}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden text-gray-600 dark:text-gray-400"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}

        {/* Navigation - Scrollable */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div
            ref={activeRef}
            aria-hidden
            className="absolute left-0 top-0 w-1 rounded-r-full bg-green-600 dark:bg-green-500 transform transition-all duration-300 opacity-0"
          />

          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = !item.external && location.pathname.startsWith(item.path);
              const baseClasses = `verve-nav-item group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg cursor-pointer select-none transition-all duration-200 text-xs`;
              const activeClasses = "verve-nav-item-active text-white bg-green-600 dark:bg-green-600 shadow-md";
              const inactiveClasses = "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";

              return (
                <li key={item.label} className="relative" title={isCollapsed ? item.label : ""}>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                    >
                      <div className="flex items-center justify-center min-w-[20px] flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="flex-1 truncate font-medium">{item.label}</span>
                      <ExternalLink size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={onCloseSidebar}
                      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                    >
                      <div className="flex items-center justify-center min-w-[20px] flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="flex-1 truncate font-medium">{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Divider */}
        <div className="px-3 mb-3">
          <div className="h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Footer Actions */}
        <div className="px-3 py-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <Link
              to="/v/account"
              onClick={onCloseSidebar}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </Link>
            <a
              href="https://github.com/acunetix2/verve_blog.git"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
              title="GitHub Repository"
            >
              <Github size={18} />
            </a>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-gray-500 dark:text-gray-500 text-center mt-3 leading-tight" style={{fontSize: "0.75rem"}}>
            &copy; {new Date().getFullYear()} Verve Hub Academy
          </p>
        </div>
      </aside>
    </>
  );
}