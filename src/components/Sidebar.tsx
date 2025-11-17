import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Archive,
  GraduationCap,
  ExternalLink,
  Settings,
  LogOut,
  Sparkles,
  Layers,
} from "lucide-react";

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  external?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/me", icon: <Home size={20} /> },
  { label: "About", path: "/me/about", icon: <BookOpen size={20} /> },
  { label: "Posts", path: "/blog", icon: <Archive size={20} /> },
  { label: "Resources", path: "/resources", icon: <Layers size={16} /> },
  { label: "Learn", path: "https://tryhackme.com", external: true, icon: <GraduationCap size={20} /> },
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

  useEffect(() => {
    if (!containerRef.current) return;
    const active = containerRef.current.querySelector(".verve-nav-item-active") as HTMLElement | null;
    if (!active) return;
    const rect = active.getBoundingClientRect();
    const top = active.offsetTop;
    const height = rect.height;
    if (activeRef.current) {
      activeRef.current.style.transform = `translateY(${top}px)`;
      activeRef.current.style.height = `${height}px`;
      activeRef.current.style.opacity = "1";
    }
  }, [location.pathname, collapsed]);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && onCloseSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={containerRef}
        className={`fixed left-0 z-50 transition-transform duration-300 ease-in-out w-60
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${collapsed ? "-translate-x-full" : "lg:translate-x-0"}
		  ${collapsed ? "w-14" : "w-48"}
        `}
        style={{ top: "4rem", height: "calc(100% - 4rem)", fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
      >
        <div className="relative h-full flex flex-col bg-white border-r border-gray-200">
          {/* Navigation */}
          <nav className="relative flex-1 px-6 py-8 overflow-y-auto">
            <div
              ref={activeRef}
              aria-hidden
              className="absolute left-0 top-0 w-0.5 rounded-full bg-black transform transition-all duration-200 opacity-0"
            />

            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = !item.external && location.pathname.startsWith(item.path);
                const baseClasses = `verve-nav-item flex items-center gap-3 w-full px-3 py-2 rounded-md cursor-pointer select-none transition-colors duration-150`;
                const activeClasses = "verve-nav-item-active text-black font-normal";
                const inactiveClasses = "text-gray-600 hover:text-black";

                return (
                  <li key={item.label} className="relative">
                    {item.external ? (
                      <a
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                      >
                        <div className="flex items-center justify-center min-w-[20px]">{item.icon}</div>
                        <span className="truncate text-sm">{item.label}</span>
                        <ExternalLink size={14} className="ml-auto opacity-40" />
                      </a>
                    ) : (
                      <Link
                        to={item.path}
                        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                      >
                        <div className="flex items-center justify-center min-w-[20px]">{item.icon}</div>
                        <span className="truncate text-sm">{item.label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="relative px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-medium text-gray-700 group">
                <Sparkles size={14} className="group-hover:text-yellow-600" />
                <span>Upgrade</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/me/account"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-black"
                title="Settings"
              >
                <Settings size={18} />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className={`hidden lg:block transition-all duration-300 ${collapsed ? "w-0" : "w-60"}`} />
    </>
  );
}