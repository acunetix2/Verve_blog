import React, { useState, useEffect, useCallback } from "react";
import { Trophy, Lock, Sparkles, Target, BookOpen, Heart, Users, TrendingUp } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

interface Achievement {
  _id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: "posts" | "views" | "followers" | "days" | "comments" | "likes";
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  progressPercentage?: number;
}

interface AchievementsBadgesProps {
  userId?: string;
}

const BADGE_COLORS: Record<string, string> = {
  posts: "from-blue-500 to-blue-600",
  views: "from-purple-500 to-purple-600",
  followers: "from-pink-500 to-pink-600",
  days: "from-green-500 to-green-600",
  comments: "from-yellow-500 to-yellow-600",
  likes: "from-red-500 to-red-600",
};

const AchievementsBadges: React.FC<AchievementsBadgesProps> = ({ userId }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const endpoint = userId ? `/users/${userId}/achievements` : "/users/achievements";

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAchievements(response.data);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === "unlocked") return achievement.unlocked;
    if (filter === "locked") return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const completionPercentage = Math.round((unlockedCount / achievements.length) * 100);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading achievements...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={20} className="text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Unlocked</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{unlockedCount}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">of {achievements.length}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Progress</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{completionPercentage}%</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Streak</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">7</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">days active</p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "unlocked", "locked"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {f} ({achievements.filter((a) => (f === "unlocked" ? a.unlocked : f === "locked" ? !a.unlocked : true)).length})
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredAchievements.map((achievement, idx) => (
          <motion.div
            key={achievement._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`relative group cursor-pointer ${
              achievement.unlocked ? "" : "opacity-60 hover:opacity-100 transition-opacity"
            }`}
          >
            <div
              className={`aspect-square rounded-xl flex flex-col items-center justify-center p-4 text-center transition-all group-hover:scale-105 ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${BADGE_COLORS[achievement.requirement.type]} text-white shadow-lg`
                  : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="text-xs font-bold mb-1 line-clamp-2">{achievement.name}</h3>

              {!achievement.unlocked && (
                <div className="mt-auto w-full">
                  <div className="bg-black/20 rounded-full h-1.5 mb-1">
                    <div
                      className="bg-white/60 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${achievement.progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] opacity-75">
                    {achievement.progress}/{achievement.requirement.value}
                  </p>
                </div>
              )}

              {achievement.unlocked && (
                <p className="text-[10px] opacity-75 mt-auto">
                  {new Date(achievement.unlockedAt!).toLocaleDateString()}
                </p>
              )}
            </div>

            {!achievement.unlocked && (
              <Lock size={16} className="absolute top-1 right-1 text-gray-400" />
            )}

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 dark:bg-gray-950 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
              <p className="font-semibold mb-1">{achievement.name}</p>
              <p className="text-gray-300">{achievement.description}</p>
              {!achievement.unlocked && (
                <p className="text-gray-400 mt-1 text-[10px]">
                  {achievement.progress}/{achievement.requirement.value} {achievement.requirement.type}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsBadges;
