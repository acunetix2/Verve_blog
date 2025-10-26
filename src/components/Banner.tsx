import React, { useEffect, useState } from "react";

export default function Banner() {
  const lines = [
    "------------------------ VERVE BLOG & WRITEUPS ------------------------",
  ];

  const typingSpeed = 8; 
  const pauseBetweenLines = 600; 
  const pauseAfterFullText = 1500; 

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
    width: "0.6ch",
    marginLeft: "0.15rem",
    background: "currentColor",
    animation: "typing-caret 1s steps(1) infinite",
    verticalAlign: "bottom",
    height: "1.05em",
  };

  return (
    <div className="w-full flex justify-center mt-4">
      <div className="max-w-5xl w-full px-4">
        <div className="text-center font-mono font-bold tracking-tight glow-text text-xs sm:text-sm md:text-base lg:text-lg">
          {lines.map((_, idx) => (
            <pre
              key={idx}
              className="m-0 text-center leading-tight whitespace-pre-wrap break-words"
              style={{
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
              }}
            >
              {displayedLines[idx]}
              {idx === currentLineIndex && <span style={caretStyle} />}
            </pre>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes typing-caret {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
