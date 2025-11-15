// components/Navbar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Cpu } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-900/90 backdrop-blur-md border-b border-cyan-900/50 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 text-sm md:text-base font-semibold text-cyan-400 hover:text-cyan-200 transition-colors"
        >
          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center shadow-md shadow-cyan-500/40 group-hover:shadow-cyan-400/60 transition-shadow">
            <Cpu className="h-4 w-4 text-cyan-400" strokeWidth={2.5} />
          </div>
          <span className="tracking-tight select-none">
            Verve Hub Blog
          </span>
        </button>
      </div>
    </nav>
  );
}
