import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function VerveHubWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  // Auto-close mobile sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">

      {/* ----- SIDEBAR ----- */}
      <Sidebar
        collapsed={collapsed}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* ----- MAIN CONTENT WRAPPER ----- */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
          ${collapsed ? "lg:ml-0" : "lg:ml-64"}`}
      >
        <Header
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              setSidebarOpen((prev) => !prev); // mobile drawer
            } else {
              setCollapsed((prev) => !prev); // desktop collapse
            }
          }}
        />

        <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
