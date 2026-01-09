import React, { useState, useEffect, useCallback } from "react";
import { Heart, UserPlus, UserMinus, Bell } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface FollowSystemProps {
  userId: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

const FollowSystem: React.FC<FollowSystemProps> = ({ userId, onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const checkFollowStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/follow-status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(response.data.isFollowing);
      setNotificationsEnabled(response.data.notificationsEnabled || true);
    } catch (error) {
      console.error("Failed to check follow status:", error);
    }
  }, [userId]);

  useEffect(() => {
    checkFollowStatus();
  }, [checkFollowStatus]);

  const toggleFollow = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (isFollowing) {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/follow`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowing(false);
        toast.success("Unfollowed user");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/follow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFollowing(true);
        toast.success("Following user");
      }

      onFollowChange?.(!isFollowing);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      toast.error("Failed to update follow status");
    } finally {
      setLoading(false);
    }
  };

  const toggleNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/follow-notifications`,
        { enabled: !notificationsEnabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotificationsEnabled(!notificationsEnabled);
      toast.success(notificationsEnabled ? "Notifications disabled" : "Notifications enabled");
    } catch (error) {
      console.error("Failed to toggle notifications:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleFollow}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isFollowing
            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
        }`}
      >
        {isFollowing ? (
          <>
            <Heart size={18} className="fill-current" />
            Following
          </>
        ) : (
          <>
            <UserPlus size={18} />
            Follow
          </>
        )}
      </motion.button>

      {isFollowing && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleNotifications}
          className={`p-2 rounded-lg transition-colors ${
            notificationsEnabled
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
          title={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
        >
          <Bell size={18} />
        </motion.button>
      )}
    </div>
  );
};

export default FollowSystem;
