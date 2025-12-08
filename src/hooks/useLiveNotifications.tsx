import { useState, useEffect, useRef, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

export type Notification = {
  id: string;
  type: "document" | "post";
  title: string;
  message: string;
  time: string;
  read?: boolean;
};

export const useLiveNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const READ_KEY = "read_notifications_ids";

  // -----------------------------
  // LocalStorage helpers
  // -----------------------------
  const getReadIds = () => {
    try {
      return JSON.parse(localStorage.getItem(READ_KEY) || "[]") as string[];
    } catch {
      return [];
    }
  };

  const saveReadIds = (ids: string[]) => {
    localStorage.setItem(READ_KEY, JSON.stringify(ids));
  };

  // -----------------------------
  // Fetch all notifications
  // -----------------------------
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const readIds = getReadIds();

      setNotifications(
        res.data
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((n: any) => ({
            id: n._id,
            type: n.type,
            title: n.title,
            message: n.message,
            time: n.createdAt,
            read: readIds.includes(n._id),
          }))
      );
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // -----------------------------
  // Handle new socket notification
  // -----------------------------
  const handleNewNotification = (data: any, type: "document" | "post") => {
    const readIds = getReadIds();

    const newNotification: Notification = {
      id: data._id,
      type,
      title:
        type === "document"
          ? "New Resource Uploaded"
          : "New WriteUp Post",
      message: data.title,
      time: data.createdAt || new Date().toISOString(),
      read: readIds.includes(data._id),
    };

    setNotifications((prev) => {
      if (prev.some((n) => n.id === newNotification.id)) return prev;
      return [newNotification, ...prev];
    });
  };

  // -----------------------------
  // Initialize socket (ONLY ONCE)
  // -----------------------------
  useEffect(() => {
    fetchNotifications();

    const token = localStorage.getItem("token") || "";

    if (!socketRef.current) {
      const socket = io(import.meta.env.VITE_API_BASE_URL2, {
        auth: { token },
      });

      socketRef.current = socket;

      socket.on("new-document", (doc) =>
        handleNewNotification(doc, "document")
      );
      socket.on("new-post", (post) =>
        handleNewNotification(post, "post")
      );
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("new-document");
        socketRef.current.off("new-post");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // IMPORTANT: Only run ONCE

  // -----------------------------
  // Mark one as read
  // -----------------------------
  const markAsRead = (id: string) => {
    const readIds = getReadIds();
    if (!readIds.includes(id)) saveReadIds([...readIds, id]);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // -----------------------------
  // Mark all as read
  // -----------------------------
  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    saveReadIds(allIds);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // -----------------------------
  // Unread count
  // -----------------------------
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    unreadCount,
  };
};
