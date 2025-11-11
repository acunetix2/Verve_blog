// components/Navbar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

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
    <nav className="fixed top-0 left-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-cyan-900/50 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
        <button
          onClick={handleLogoClick}
          className="text-cyan-400 hover:text-cyan-300 text-xl font-bold tracking-tight"
        >
          Verve Hub
        </button>
      </div>
    </nav>
  );
}
