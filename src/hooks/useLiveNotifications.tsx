import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

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
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(import.meta.env.VITE_API_BASE_URL2); // e.g. ws://localhost:4000
    setSocket(s);

    s.on("new-document", (doc: any) => {
      const newNotification: Notification = {
        id: doc._id,
        type: "document",
        title: "New Document Uploaded",
        message: doc.title,
        time: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotification, ...prev]);
    });

    s.on("new-post", (post: any) => {
      const newNotification: Notification = {
        id: post._id,
        type: "post",
        title: "New Blog Post",
        message: post.title,
        time: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // Optional: call API to mark read
  };

  return { notifications, markAsRead };
};
