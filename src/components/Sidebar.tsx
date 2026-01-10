import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  external?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/v", icon: <Home size={20} /> },
  { label: "WriteUps", path: "/v/blog", icon: <Archive size={20} /> },
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
  const activeRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

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

      {/* Sidebar */}
      <aside
        ref={containerRef}
        className={`fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out h-screen flex flex-col overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div
            ref={activeRef}
            aria-hidden
            className="absolute left-0 top-0 w-1 rounded-r-full bg-gradient-to-b from-blue-600 to-cyan-600 transform transition-all duration-300 opacity-0"
          />

          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = !item.external && location.pathname.startsWith(item.path);
              const baseClasses = `verve-nav-item group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg cursor-pointer select-none transition-all duration-200`;
              const activeClasses = "verve-nav-item-active text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-md";
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
                      <span className="flex-1 truncate text-sm font-medium">{item.label}</span>
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
                      <span className="flex-1 truncate text-sm font-medium">{item.label}</span>
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
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </Link>
            <a
              href="https://github.com/acunetix2/verve_blog.git"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              title="GitHub Repository"
            >
              <Github size={18} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-gray-500 dark:text-gray-500 text-center mt-3 leading-tight">
            &copy; {new Date().getFullYear()} Verve Hub
          </p>
        </div>
      </aside>
    </>
  );
}