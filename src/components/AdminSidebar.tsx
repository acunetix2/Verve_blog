import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  HardDrive,
  Settings,
  ChevronLeft,
  Github,
  LogOut,
  X,
  Shield,
  AlertCircle,
  BarChart3,
  Users,
  Zap,
  Activity,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  external?: boolean;
};

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
  { label: "Create Content", path: "/admin/create", icon: <FileText size={20} /> },
  { label: "Documents", path: "/admin/documents", icon: <HardDrive size={20} /> },
  { label: "Simulations", path: "/admin/simulations", icon: <Activity size={20} /> },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onCollapse?: () => void;
  sidebarOpen: boolean;
  onCloseSidebar?: () => void;
}

export default function AdminSidebar({ collapsed = false, onCollapse, sidebarOpen, onCloseSidebar }: AdminSidebarProps) {
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
    const active = containerRef.current.querySelector(".admin-nav-item-active") as HTMLElement | null;
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
    localStorage.removeItem("role");
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
              You will be redirected to the login page.
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

      {/* Admin Sidebar */}
      <aside
        ref={containerRef}
        className={`fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out h-screen flex flex-col overflow-hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 shadow-2xl`}
        style={{
          fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
          paddingTop: '3.5rem',
        }}
      >
        {/* Close Button (Mobile Only) */}
        {sidebarOpen && onCloseSidebar && (
          <button
            onClick={onCloseSidebar}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-700/50 lg:hidden text-slate-400"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}

        {/* Admin Badge */}
        <div className="px-4 py-3 mx-3 mb-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg flex items-center gap-2">
          <Shield size={16} className="text-blue-400" />
          <span className="text-xs font-semibold text-blue-300">Admin Panel</span>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div
            ref={activeRef}
            aria-hidden
            className="absolute left-0 top-0 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-purple-600 transform transition-all duration-300 opacity-0"
          />

          <ul className="flex flex-col gap-2">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = !item.external && location.pathname === item.path;
              const baseClasses = `admin-nav-item group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg cursor-pointer select-none transition-all duration-200 text-xs`;
              const activeClasses = "admin-nav-item-active text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20";
              const inactiveClasses = "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100";

              return (
                <li key={item.label} className="relative" title={isCollapsed ? item.label : ""}>
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
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="my-4 px-2">
            <div className="h-px bg-slate-700/50" />
          </div>

          {/* Admin Info Section */}
          <div className="px-3 py-3 bg-slate-700/20 border border-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-xs font-semibold text-slate-200">System Status</span>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="px-3 py-4 space-y-3 border-t border-slate-700">
          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <Link
              to="/admin/account"
              onClick={onCloseSidebar}
              className="p-2.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors group relative"
              title="Account Settings"
            >
              <Settings size={18} />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-slate-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Settings</span>
            </Link>
            <a
              href="https://github.com/verveblog.git"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors group relative"
              title="GitHub Repository"
            >
              <Github size={18} />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-slate-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">GitHub</span>
            </a>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-red-400 transition-colors group relative"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-slate-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Logout</span>
            </button>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-slate-500 text-center mt-2 leading-tight">
            &copy; {new Date().getFullYear()} Verve Admin
          </p>
        </div>
      </aside>
    </>
  );
}
