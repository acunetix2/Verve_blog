import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Outlet } from "react-router-dom";
import { useTheme } from "./ThemeContext";

export default function VerveHubWrapper() {
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
          ? "bg-[#0a0a0f] text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ----- SIDEBAR ----- */}
      <Sidebar
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
        <Header
          onToggleSidebar={() => {
            if (!isDesktop) {
              setSidebarOpen((prev) => !prev);
            } else {
              setCollapsed((prev) => !prev);
            }
          }}
        />

        <main className="flex-1 p-0 mt-16">
          <Outlet />
        </main>
      </div>

      {/* ----- FLOATING ACTION BUTTON ----- */}
    </div>
  );
}
