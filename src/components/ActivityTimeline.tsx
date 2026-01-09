import React, { useState, useEffect, useCallback } from "react";
import { Activity, Heart, MessageSquare, Pen, Share2, Award, Users } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

interface ActivityEvent {
  _id: string;
  type: "post_published" | "comment_made" | "post_liked" | "user_followed" | "achievement_unlocked" | "post_shared";
  actor: {
    _id: string;
    name: string;
    profileImage: string;
  };
  target?: {
    _id: string;
    title: string;
    type: string;
  };
  createdAt: string;
  metadata?: Record<string, unknown>;
}

interface ActivityTimelineProps {
  userId?: string;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ userId }) => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const endpoint = userId ? `/users/${userId}/activity` : "/users/activity";

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActivities(response.data);
    } catch (error) {
      console.error("Failed to fetch activity:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const getActivityIcon = (type: ActivityEvent["type"]) => {
    const icons: Record<ActivityEvent["type"], React.ReactNode> = {
      post_published: <Pen size={20} className="text-blue-500" />,
      comment_made: <MessageSquare size={20} className="text-green-500" />,
      post_liked: <Heart size={20} className="text-red-500 fill-red-500" />,
      user_followed: <Users size={20} className="text-purple-500" />,
      achievement_unlocked: <Award size={20} className="text-yellow-500" />,
      post_shared: <Share2 size={20} className="text-cyan-500" />,
    };
    return icons[type];
  };

  const getActivityDescription = (activity: ActivityEvent): string => {
    const actor = activity.actor.name;
    switch (activity.type) {
      case "post_published":
        return `${actor} published "${activity.target?.title}"`;
      case "comment_made":
        return `${actor} commented on "${activity.target?.title}"`;
      case "post_liked":
        return `${actor} liked "${activity.target?.title}"`;
      case "user_followed":
        return `${actor} started following this user`;
      case "achievement_unlocked":
        return `${actor} unlocked achievement: ${activity.target?.title}`;
      case "post_shared":
        return `${actor} shared "${activity.target?.title}"`;
      default:
        return "Activity";
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const eventDate = new Date(date);
    const diff = now.getTime() - eventDate.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return eventDate.toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading activity...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity size={24} className="text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Feed</h2>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, idx) => (
            <motion.div
              key={activity._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative"
            >
              {/* Timeline dot and line */}
              <div className="absolute left-0 top-0 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                {idx < activities.length - 1 && (
                  <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-800 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="ml-16 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={activity.actor.profileImage}
                      alt={activity.actor.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getActivityDescription(activity)}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-11">
                  {formatTime(activity.createdAt)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Activity size={48} className="mx-auto mb-3 opacity-50" />
          <p>No activity yet</p>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
