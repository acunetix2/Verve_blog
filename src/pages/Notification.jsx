import React, { useState, useEffect } from "react";
import { Bell, XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Notification type
type Notification = {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  time: string;
};

const generateRandomNotification = (): Notification => {
  const types: Notification["type"][] = ["success", "error", "info"];
  const type = types[Math.floor(Math.random() * types.length)];
  const messages = {
    success: "Your action was successful!",
    error: "Something went wrong.",
    info: "Here's some information.",
  };
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    title: type.charAt(0).toUpperCase() + type.slice(1),
    message: messages[type],
    time: new Date().toLocaleTimeString(),
  };
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);

  // Simulate live notifications every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = generateRandomNotification();
      setNotifications((prev) => [newNotification, ...prev]);
      setToasts((prev) => [newNotification, ...prev]);
      // Remove toast automatically after 4s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newNotification.id));
      }, 4000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Page Header */}
      <div className="flex items-center mb-6">
        <Bell className="w-6 h-6 text-cyan-400 mr-2" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {/* Notification List */}
      <div className="flex flex-col gap-4">
        {notifications.length === 0 && (
          <div className="text-slate-400 text-center mt-20">
            No notifications yet
          </div>
        )}
        {notifications.map((n) => {
          const bgColor =
            n.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20"
              : n.type === "error"
              ? "bg-red-500/10 border-red-500/20"
              : "bg-cyan-500/10 border-cyan-500/20";

          const textColor =
            n.type === "success"
              ? "text-emerald-400"
              : n.type === "error"
              ? "text-red-400"
              : "text-cyan-400";

          const Icon =
            n.type === "success"
              ? CheckCircle2
              : n.type === "error"
              ? AlertCircle
              : Bell;

          return (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-4 rounded-xl border ${bgColor} shadow-lg`}
            >
              <Icon className={`w-6 h-6 ${textColor} mt-1`} />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100">{n.title}</h3>
                <p className={`text-sm ${textColor} mt-1`}>{n.message}</p>
                <span className="text-xs text-slate-500 mt-1">{n.time}</span>
              </div>
              <button
                onClick={() => dismissNotification(n.id)}
                className="text-slate-400 hover:text-red-400"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Toasts */}
      <div className="fixed top-6 right-6 flex flex-col gap-3 z-50">
        <AnimatePresence>
          {toasts.map((toast) => {
            const bgColor =
              toast.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/30"
                : toast.type === "error"
                ? "bg-red-500/20 border-red-500/30"
                : "bg-cyan-500/20 border-cyan-500/30";

            const textColor =
              toast.type === "success"
                ? "text-emerald-500"
                : toast.type === "error"
                ? "text-red-500"
                : "text-cyan-500";

            const Icon =
              toast.type === "success"
                ? CheckCircle2
                : toast.type === "error"
                ? AlertCircle
                : Bell;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg ${bgColor} ${textColor}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{toast.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
