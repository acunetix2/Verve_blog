import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { Outlet } from "react-router-dom";
import { useTheme } from "./ThemeContext";

export default function AdminWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const { actualTheme } = useTheme();

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      if (desktop) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        actualTheme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ----- ADMIN SIDEBAR ----- */}
      <AdminSidebar
        collapsed={collapsed}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* ----- MAIN CONTENT ----- */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !collapsed && isDesktop ? "ml-64" : ""
        }`}
        onClick={() => {
          if (sidebarOpen) setSidebarOpen(false);
        }}
      >
        <AdminHeader
          onToggleSidebar={() => {
            if (!isDesktop) {
              setSidebarOpen((prev) => !prev);
            } else {
              setCollapsed((prev) => !prev);
            }
          }}
        />

        <main className="flex-1 w-full mt-16 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
