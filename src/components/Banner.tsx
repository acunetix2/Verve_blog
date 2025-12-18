/**
 * Author / Copyright: Iddy
 * All rights reserved.
 */

import React, { useEffect, useState } from "react";
import { Terminal, AlertTriangle } from "lucide-react";

export default function HackerBanner() {
  const lines = [
    "Empowering Knowledge & Innovation...",
    "Verve Hub Research & Insights",
    "Security Research and Learning",
  ];

  const typingSpeed = 40;
  const pauseBetweenLines = 800;
  const pauseAfterFullText = 2000;

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>(lines.map(() => ""));
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const currentLine = lines[currentLineIndex];

    if (!isDeleting && charIndex <= currentLine.length) {
      timer = window.setTimeout(() => {
        setDisplayedLines((prev) => {
          const copy = [...prev];
          copy[currentLineIndex] = currentLine.slice(0, charIndex);
          return copy;
        });
        setCharIndex((c) => c + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex > currentLine.length) {
      timer = window.setTimeout(() => setIsDeleting(true), pauseAfterFullText);
    } else if (isDeleting && charIndex > 0) {
      timer = window.setTimeout(() => {
        setDisplayedLines((prev) => {
          const copy = [...prev];
          copy[currentLineIndex] = currentLine.slice(0, charIndex);
          return copy;
        });
        setCharIndex((c) => c - 1);
      }, typingSpeed / 2);
    } else if (isDeleting && charIndex === 0) {
      timer = window.setTimeout(() => {
        setIsDeleting(false);
        setCurrentLineIndex((i) => (i + 1) % lines.length);
      }, pauseBetweenLines);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [charIndex, isDeleting, currentLineIndex]);

  return (
    <div className="w-full flex justify-center mt-14 px-2 sm:px-4">
      <div className="w-full max-w-full sm:max-w-4xl">
        <div
          className="relative rounded-2xl p-6 sm:p-10 overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #0b0f14, #10151f)",
            fontFamily: "'Google Sans', system-ui, sans-serif",
            boxShadow: "0 0 60px rgba(0, 255, 127, 0.15)",
          }}
        >
          {/* Subtle hacker grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, #00ff9c 1px, transparent 1px), linear-gradient(to bottom, #00ff9c 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 space-y-4 sm:space-y-6 text-center break-words">
            {lines.map((_, idx) => (
              <div
                key={idx}
                className="flex justify-center items-center flex-wrap gap-2 sm:gap-3 font-mono text-sm sm:text-base md:text-lg font-semibold text-[#b7ffe3]"
              >
                <Terminal className="h-4 w-4 sm:h-5 sm:w-5 text-[#00ff9c] opacity-70 flex-shrink-0" />
                <span className="break-words max-w-full">
                  {displayedLines[idx]}
                  {idx === currentLineIndex && (
                    <span className="inline-block w-[0.5ch] h-[1em] bg-[#00ff9c] ml-1 animate-caret" />
                  )}
                </span>
              </div>
            ))}

            {/* Single hacker button */}
            <div className="mt-6 sm:mt-10 flex justify-center">
              <button
                className="
                  flex items-center flex-wrap gap-2
                  px-4 sm:px-6 py-2.5
                  rounded-full
                  border border-red-400/40
                  bg-red-500/10
                  text-red-300
                  font-mono text-xs sm:text-sm
                  shadow-[0_0_20px_rgba(239,68,68,0.35)]
                  hover:bg-red-500/20
                  hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]
                  transition-all duration-300
                "
              >
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                rm -rf is a bad idea
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes caret {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-caret {
          animation: caret 1s steps(1) infinite;
        }
      `}</style>
    </div>
  );
}
