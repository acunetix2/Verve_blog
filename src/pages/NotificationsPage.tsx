import React, { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Bell, Trash2, Check, CheckCheck, Filter, Clock, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "document" | "course" | "general" | "alert";
  read: boolean;
  time?: string;
  createdAt?: string;
  actionUrl?: string;
  actionLabel?: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const applyFilter = useCallback(() => {
    if (filter === "unread") {
      setFilteredNotifications(notifications.filter((n) => !n.read));
    } else if (filter === "read") {
      setFilteredNotifications(notifications.filter((n) => n.read));
    } else {
      setFilteredNotifications(notifications);
    }
  }, [filter, notifications]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/notifications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      toast.success("Marked as read");
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(notifications.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const deleteAllNotifications = async () => {
    if (!window.confirm("Are you sure you want to delete all notifications?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications([]);
      toast.success("All notifications deleted");
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
      toast.error("Failed to delete notifications");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "document":
        return "📄";
      case "course":
        return "📚";
      case "alert":
        return "⚠️";
      default:
        return "📢";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Just now";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Just now";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Just now";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-gray-950 pt-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="p-3 bg-red-900/40 rounded-lg">
                  <Bell className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Notifications
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {notifications.length > 0 && (
                <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Mark All Read</span>
                      <span className="sm:hidden">Mark Read</span>
                    </button>
                  )}
                  <button
                    onClick={deleteAllNotifications}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear All</span>
                    <span className="sm:hidden">Clear</span>
                  </button>
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-red-600/20 overflow-x-auto pb-2 sm:pb-0">
              {(["all", "unread", "read"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    filter === f
                      ? "border-red-500 text-red-500"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f !== "all" && (
                    <span className="ml-2 text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                      {f === "unread"
                        ? unreadCount
                        : notifications.filter((n) => n.read).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <Clock className="w-8 h-8 text-red-600/50" />
              </div>
              <p className="mt-4 text-gray-400">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-16 bg-gray-900/50 border border-red-600/20 rounded-2xl">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No {filter !== "all" ? filter : ""} notifications
              </h3>
              <p className="text-gray-400">
                {filter === "unread" && "All caught up! You have no unread notifications."}
                {filter === "read" && "You haven't read any notifications yet."}
                {filter === "all" && "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 ${
                    notification.read
                      ? "bg-gray-900/30 border-gray-800 opacity-75"
                      : "bg-gray-900/60 border-red-600/30 shadow-lg shadow-red-600/10"
                  } hover:border-red-600/50 hover:shadow-md hover:shadow-red-600/20`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className="text-2xl mt-1 flex-shrink-0">{getNotificationIcon(notification.type)}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white break-words">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>{formatDate(notification.time || notification.createdAt)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-red-500 hover:text-red-400 active:scale-95"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 hover:bg-orange-600/20 rounded-lg transition-colors text-orange-500 hover:text-orange-400 active:scale-95"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Action Link */}
                      {notification.actionUrl && (
                        <a
                          href={notification.actionUrl}
                          className="inline-block mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          {notification.actionLabel || "View"}
                        </a>
                      )}
                    </div>

                    {/* Read Indicator */}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2 animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
