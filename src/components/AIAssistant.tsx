import React, { useState, useRef, useEffect } from "react";
import { Terminal, Send, X, AlertCircle, Sparkles, GripVertical, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const AIAssistant: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep window within viewport bounds
      const windowWidth = 400; // max-w-md is ~384px
      const windowHeight = 512; // max-h-[32rem] is 512px
      const maxX = Math.max(0, window.innerWidth - windowWidth);
      const maxY = Math.max(0, window.innerHeight - windowHeight);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      
      const windowWidth = 400;
      const windowHeight = 512;
      const maxX = Math.max(0, window.innerWidth - windowWidth);
      const maxY = Math.max(0, window.innerHeight - windowHeight);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, dragStart]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // Check if logged in before sending
    if (!isLoggedIn) {
      toast.error("Please log in to use the AI Assistant");
      navigate("/login");
      return;
    }

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      
      const res = await fetch(`${apiBaseUrl}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
        throw new Error("AI server error");
      }

      const data = await res.json();
      const aiMsg: Message = {
        sender: "ai",
        text: data.reply || "I couldn't generate a response right now.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Oops! I'm having trouble connecting right now. Please check your connection and try again in a moment. 🔌",
        },
      ]);
    }

    setLoading(false);
  };

  const handleOpenChat = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to use the AI Assistant");
      navigate("/login");
      return;
    }
    setOpen(!open);
  };

  const chatStyle = position.x !== 0 || position.y !== 0
    ? {
        position: "fixed" as const,
        left: `${position.x}px`,
        top: `${position.y}px`,
        bottom: "auto",
        right: "auto",
      }
    : {};

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={handleOpenChat}
        className={`fixed bottom-6 right-6 ${isLoggedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'} text-white p-3 rounded-full shadow-2xl hover:shadow-green-600/50 hover:scale-110 transition-all duration-300 z-50 group`}
        aria-label="Open AI Assistant"
        title={isLoggedIn ? "AI Assistant" : "Log in to use AI Assistant"}
      >
        <Terminal className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        {messages.length > 0 && !open && isLoggedIn && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            {messages.filter((m) => m.sender === "ai").length}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={chatStyle}
          className={`${
            position.x === 0 && position.y === 0
              ? "fixed bottom-24 right-6"
              : ""
          } w-full max-w-md h-[90vh] max-h-[32rem] bg-white shadow-2xl rounded-2xl flex flex-col border border-green-200 z-50 ${
            !isDragging ? "animate-in fade-in slide-in-from-bottom-4 duration-300" : ""
          }`}
        >
          {/* Header - Draggable */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl flex items-center justify-between select-none touch-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 opacity-70" />
              <div className="relative">
                <Sparkles className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full border-2 border-white animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Verve AI Assistant</h3>
                <p className="text-xs text-green-100">Cybersecurity guidance</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-white">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                  Welcome! 👋
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  I'm your Verve AI Assistant. Ask me anything about cybersecurity, courses, or how to get started!
                </p>
              </div>
            )}

            <div className="space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                      m.sender === "user"
                        ? "bg-green-600 text-white rounded-br-sm font-medium"
                        : m.text.includes("Oops!") ||
                          m.text.includes("trouble")
                        ? "bg-red-50 text-red-800 border border-red-200 rounded-bl-sm flex items-start gap-2"
                        : "bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-sm"
                    }`}
                  >
                    {m.sender === "ai" &&
                      (m.text.includes("Oops!") ||
                        m.text.includes("trouble")) && (
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                    <span>{m.text}</span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-4 border-t border-green-100 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading || !isLoggedIn}
                className="flex-1 px-3 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-xs text-gray-900 placeholder:text-gray-400"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading || !isLoggedIn}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-1"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AIAssistant;