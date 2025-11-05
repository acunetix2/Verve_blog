import React, { useEffect, useState } from "react";
import { Shield, Terminal, Lock } from "lucide-react";

export default function Banner() {
  const lines = [
    " A LEARNING PLATFORM ...",
    " VERVE HUB BLOG & WRITEUPS SYSTEM",
    " LEARN • UNDERSTAND • SECURE",
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
      // Typing forward
      timer = window.setTimeout(() => {
        setDisplayedLines((prev) => {
          const copy = [...prev];
          copy[currentLineIndex] = currentLine.slice(0, charIndex);
          return copy;
        });
        setCharIndex((c) => c + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex > currentLine.length) {
      // Pause before deleting
      timer = window.setTimeout(() => setIsDeleting(true), pauseAfterFullText);
    } else if (isDeleting && charIndex > 0) {
      // Deleting backward
      timer = window.setTimeout(() => {
        setDisplayedLines((prev) => {
          const copy = [...prev];
          copy[currentLineIndex] = currentLine.slice(0, charIndex);
          return copy;
        });
        setCharIndex((c) => c - 1);
      }, typingSpeed / 2);
    } else if (isDeleting && charIndex === 0) {
      // Move to next line
      timer = window.setTimeout(() => {
        setIsDeleting(false);
        setCurrentLineIndex((i) => (i + 1) % lines.length);
      }, pauseBetweenLines);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [charIndex, isDeleting, currentLineIndex]);

  const caretStyle: React.CSSProperties = {
    display: "inline-block",
    width: "0.5ch",
    marginLeft: "0.15rem",
    background: "currentColor",
    animation: "typing-caret 1s steps(1) infinite",
    verticalAlign: "bottom",
    height: "1em",
  };

  return (
    <div className="w-full flex justify-center mt-6">
      <div className="max-w-4xl w-full px-4">
        {/* Terminal Window */}
        <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-b border-cyan-500/30">
            <div className="flex items-center gap-3">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-300 font-semibold tracking-wider">
                TERMINAL://VERVE_HUB WRITEUPS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 animate-pulse"></div>
              </div>
              <div className="ml-2 flex items-center gap-1">
                <Lock className="h-3 w-3 text-green-400" />
                <span className="text-[10px] text-green-400 font-mono">SECURE</span>
              </div>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="relative px-6 py-6 min-h-[120px] flex items-center">
            {/* Scan line effect */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                background: 'linear-gradient(transparent 50%, rgba(6, 182, 212, 0.1) 50%)',
                backgroundSize: '100% 4px',
                animation: 'scan 8s linear infinite'
              }}
            ></div>

            <div className="relative z-10 w-full">
              <div className="space-y-2 font-mono text-cyan-300 font-bold text-sm sm:text-base md:text-lg">
                {lines.map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center"
                  >
                    {/* Prompt indicator */}
                    <span className="text-green-400 mr-2 flex-shrink-0">#</span>
                    
                    <pre
                      className="m-0 leading-tight whitespace-pre-wrap break-words flex-1"
                      style={{
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
                      }}
                    >
                      {displayedLines[idx]}
                      {idx === currentLineIndex && (
                        <span 
                          style={caretStyle} 
                          className="bg-cyan-400"
                        />
                      )}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Status bar at bottom */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-cyan-500/20">
                <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-400">ONLINE</span>
                  </span>
                  <span>•</span>
                  <span className="text-cyan-400">LEARN</span>
                  <span>•</span>
                  <span className="text-blue-400">PROTECT</span>
                </div>
                <Shield className="h-4 w-4 text-cyan-400/70" />
              </div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none"></div>
        </div>
      </div>

      <style>{`
        @keyframes typing-caret {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}