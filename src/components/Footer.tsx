import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900/90 border-t border-cyan-700/30 backdrop-blur-lg text-cyan-200 py-6 mt-10">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-6">
        <p className="text-sm">&copy; {new Date().getFullYear()} Verve Hub. All rights reserved.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="/about" className="hover:text-cyan-400 transition">About</a>
          <a href="/blog" className="hover:text-cyan-400 transition">Posts</a>
          <a href="/resources" className="hover:text-cyan-400 transition">Resources</a>
          <a href="https://tryhackme.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">Learn</a>
        </div>
      </div>
    </footer>
  );
}
