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
  Github,
  Wallet,
  Zap,
  Activity,
} from "lucide-react";

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  external?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/v", icon: <Home size={20} /> },
  { label: "About", path: "/v/about", icon: <BookOpen size={20} /> },
  { label: "WriteUps", path: "/v/blog", icon: <Archive size={20} /> },
  { label: "Resources", path: "/v/resources", icon: <Layers size={16} /> },
  { label: "Billing", path: "/v/billing", icon: <Wallet size={16} /> },
  { label: "Simulations", path: "/v/simulations", icon: <Activity size={16} /> },
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={containerRef}
        className={`fixed left-0 z-50 transition-transform duration-300 ease-in-out w-60
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${collapsed ? "-translate-x-full" : "lg:translate-x-0"}
          ${collapsed ? "w-14" : "w-60"}
        `}
        style={{ 
          top: "4rem", 
          height: "calc(100% - 4rem)", 
          fontFamily: '"Product Sans", "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
        }}
      >
        <div className="relative h-full flex flex-col bg-white border-r border-slate-200 shadow-lg lg:shadow-none">
          {/* Navigation */}
          <nav className="relative flex-1 px-6 py-8 overflow-y-auto">
            <div
              ref={activeRef}
              aria-hidden
              className="absolute left-0 top-0 w-1 rounded-r-full bg-gradient-to-b from-indigo-600 to-violet-600 transform transition-all duration-200 opacity-0"
            />

            <ul className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive = !item.external && location.pathname.startsWith(item.path);
                const baseClasses = `verve-nav-item flex items-center gap-3 w-full px-3 py-2.5 rounded-xl cursor-pointer select-none transition-all duration-200`;
                const activeClasses = "verve-nav-item-active text-slate-900 font-semibold bg-gradient-to-r from-indigo-50 to-violet-50 shadow-sm";
                const inactiveClasses = "text-slate-600 hover:text-slate-900 hover:bg-slate-50";

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
			<div className="relative px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex flex-col items-center">
			  <div className="flex items-center justify-center mb-3 w-full">
				<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 text-xs font-semibold text-white shadow-md hover:shadow-lg group w-full justify-center">
				  <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
				  <span>Upgrade</span>
				</button>
			  </div>
			  <div className="flex items-center justify-center gap-2 mb-2">
				<Link
				  to="/v/account"
				  className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all duration-200 text-slate-600 hover:text-slate-900"
				  title="Settings"
				>
				  <Settings size={18} />
				</Link>
				<a
				  href="https://github.com/acunetix2/verve_blog.git"
				  target="_blank"
				  rel="noopener noreferrer"
				  className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all duration-200 text-slate-600 hover:text-slate-900"
				  title="GitHub"
				>
				  <Github size={18} />
				</a>
			  </div>

			  {/* Copyright */}
			  <p className="text-[10px] text-slate-800 text-bold mt-2 text-center">
				&copy; {new Date().getFullYear()} Verve Hub WriteUps.
			  </p>
			</div>

        </div>
      </aside>
      {/* Spacer for desktop */}
      <div className={`hidden lg:block transition-all duration-300 ${collapsed ? "w-0" : "w-60"}`} />
    </>
  );
}