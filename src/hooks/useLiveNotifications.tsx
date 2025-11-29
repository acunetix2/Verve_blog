import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

export type Notification = {
  id: string;
  type: "document" | "post";
  title: string;
  message: string;
  time: string;
  read?: boolean; // local read status per client
};

export const useLiveNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Fetch all global notifications from backend
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(
        res.data
          .sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .map((n: any) => ({
            id: n._id,
            type: n.type,
            title: n.title,
            message: n.message,
            time: n.time,
            read: false, // each client tracks local read status
          }))
      );
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Mark notification as read locally
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  useEffect(() => {
    fetchNotifications(); // load existing notifications on mount

    // Connect to Socket.IO server
    const s = io(import.meta.env.VITE_API_BASE_URL2, {
      auth: { token: localStorage.getItem("token") || "" },
    });
    setSocket(s);

    // Listen for new global notifications
    const handleNewNotification = (data: any, type: "document" | "post") => {
      const newNotification: Notification = {
        id: data._id,
        type,
        title: type === "document" ? "New Resource Uploaded" : "New WriteUp Post",
        message: data.title,
        time: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    };

    s.on("new-document", (doc: any) => handleNewNotification(doc, "document"));
    s.on("new-post", (post: any) => handleNewNotification(post, "post"));

    return () => {
      s.disconnect();
    };
  }, []);

  return { notifications, markAsRead, fetchNotifications };
};
