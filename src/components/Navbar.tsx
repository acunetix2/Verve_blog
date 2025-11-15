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
    <nav className="fixed top-0 left-0 py-3 w-full bg-gray-900/90 backdrop-blur-md border-b border-green-900/50 z-50 shadow-md">
      <div
			onClick={handleLogoClick}
			className="flex items-center gap-3 cursor-pointer"
		  >
			<div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/40">
			  <Cpu size={20} className="text-red-500" strokeWidth={2.5} />
			</div>
			<h1 className="text-2xl font-bold text-transparent bg-clip-text bg-cyan-400">
			  Verve Hub Blog
			</h1>
		  </div>

    </nav>
  );
}
