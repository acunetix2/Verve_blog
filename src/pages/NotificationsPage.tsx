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
  time: string;
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
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
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

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-50 border-blue-200";
      case "course":
        return "bg-purple-50 border-purple-200";
      case "alert":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Notifications
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {notifications.length > 0 && (
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      <CheckCheck className="w-4 h-4" />
                      Mark All Read
                    </button>
                  )}
                  <button
                    onClick={deleteAllNotifications}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
              {(["all", "unread", "read"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
                    filter === f
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f !== "all" && (
                    <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
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
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No {filter !== "all" ? filter : ""} notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
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
                  className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-102 hover:shadow-md ${
                    notification.read
                      ? `${getNotificationColor(notification.type)} opacity-75`
                      : `${getNotificationColor(notification.type)} border-current shadow-md`
                  } dark:bg-gray-800/50 dark:border-gray-700`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="text-2xl mt-1">{getNotificationIcon(notification.type)}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            {new Date(notification.time).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors text-green-600 dark:text-green-400"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-600 dark:text-red-400"
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
                          className="inline-block mt-3 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          {notification.actionLabel || "View"}
                        </a>
                      )}
                    </div>

                    {/* Read Indicator */}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
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
