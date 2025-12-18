/**
 * CommandStatusBadge.tsx
 * ----------------------
 * Rotating hacker-style terminal command badge with typing animation.
 * 
 * Author / Copyright: Iddy
 * All rights reserved.
 */

import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

interface CommandStatusBadgeProps {
  speed?: number; 
  pause?: number;
  darkMode?: boolean; 
  context?: "account" | "admin" | "blog"; 
}

const baseCommands = [
  "nmap -sS -T4 -Pn -p- target.local",
  "nmap --script vuln --open target.local",
  "msfconsole -q -x 'db_status; exit'",
  "msfconsole -q -x 'search type:exploit name:http; exit'",
  "nmap -A -O --osscan-guess target.local",
];

const contextCommands: Record<string, string[]> = {
  account: [
    "nmap --script auth,target -p 80,443 target.local",
    "msfconsole -q -x 'use auxiliary/scanner/http/http_login; show options; exit'",
  ],
  admin: [
    "nmap -sU --top-ports 20 target.local",
    "msfconsole -q -x 'use auxiliary/scanner/portscan/tcp; set RHOSTS target.local; run; exit'",
  ],
  blog: [
    "nmap --script http-enum -p 80,443 target.local",
    "msfconsole -q -x 'use auxiliary/scanner/http/http_version; set RHOSTS target.local; run; exit'",
  ],
};

export default function CommandStatusBadge({
  speed = 500,
  pause = 1000,
  darkMode = false,
  context,
}: CommandStatusBadgeProps) {
  const [commands, setCommands] = useState<string[]>(baseCommands);
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (context && contextCommands[context]) {
      setCommands([...baseCommands, ...contextCommands[context]]);
    }
  }, [context]);

  useEffect(() => {
    let timer: number;
    const currentCommand = commands[index];

    if (!isDeleting && charIndex <= currentCommand.length) {
      timer = window.setTimeout(() => {
        setDisplayed(currentCommand.slice(0, charIndex));
        setCharIndex((c) => c + 1);
      }, speed);
    } else if (!isDeleting && charIndex > currentCommand.length) {
      timer = window.setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && charIndex > 0) {
      timer = window.setTimeout(() => {
        setDisplayed(currentCommand.slice(0, charIndex));
        setCharIndex((c) => c - 1);
      }, speed / 1);
    } else if (isDeleting && charIndex === 0) {
      timer = window.setTimeout(() => {
        setIsDeleting(false);
        setIndex((i) => (i + 1) % commands.length);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, index, commands, speed, pause]);

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold shadow-sm border max-w-full break-words ${
        darkMode
          ? "bg-gray-900 text-green-400 border-green-700"
          : "bg-white text-slate-700 border-slate-200"
      }`}
      style={{ fontFamily: "'Roboto Mono', monospace" }}
    >
      <Terminal
        className={`h-4 w-4 animate-pulse flex-shrink-0 ${
          darkMode ? "text-green-500" : "text-emerald-500"
        }`}
      />
      <span className="break-words max-w-full">{displayed}</span>
      <span
        className={`ml-1 inline-block w-0.5 h-4 bg-current animate-blink`}
        style={{ animation: "blink 1s steps(1) infinite" }}
      ></span>

      <style>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
