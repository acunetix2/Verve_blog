import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Eye,
  MessageSquare,
  Heart,
  BookOpen,
  Calendar,
  Clock,
  User,
  Zap,
  Target,
  Award,
  ArrowRight,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface DashboardStats {
  totalViews: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  viewsThisMonth: number;
  commentsThisMonth: number;
  recentPosts: Array<{
    _id: string;
    title: string;
    views: number;
    likes: number;
    createdAt: string;
  }>;
  readingStats: {
    articlesRead: number;
    hoursSpent: number;
    averageReadTime: number;
  };
}

interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  totalPosts: number;
  totalViews: number;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

const EnhancedDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>({
    totalViews: 0,
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    viewsThisMonth: 0,
    commentsThisMonth: 0,
    recentPosts: [],
    readingStats: {
      articlesRead: 0,
      hoursSpent: 0,
      averageReadTime: 0,
    },
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch user stats
      const statsResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/dashboard-stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(statsResponse.data);

      // Fetch user profile
      const profileResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserProfile(profileResponse.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "from-blue-500 to-cyan-500";
      case "intermediate":
        return "from-purple-500 to-pink-500";
      case "advanced":
        return "from-orange-500 to-red-500";
      case "expert":
        return "from-yellow-500 to-orange-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Quick Stats Grid */}
      {stats && (
        <>
          {/* Reading Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-silver-800 dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-1xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Google Sans', sans-serif" }}>Reading Activity</p>
                <BookOpen className="text-blue-500" style={{ fontFamily: "'Google Sans', sans-serif" }} size={20} />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Google Sans', sans-serif" }}>Articles Read</span>
                    <span className="font-bold text-gray-900 dark:text-white">{stats?.readingStats?.articlesRead || 0}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{width: `${Math.min(((stats?.readingStats?.articlesRead || 0) / 100) * 100, 100)}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Google Sans', sans-serif" }}>Learning Hours</span>
                    <span className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Google Sans', sans-serif" }}>{stats?.readingStats?.hoursSpent || 0}h</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{width: `${Math.min(((stats?.readingStats?.hoursSpent || 0) / 100) * 100, 100)}%`}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-orange-300 text-0.5xl dark:bg-blue-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-1xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Google Sans', sans-serif" }}>Performance</p>
                <TrendingUp className="text-pink-500" size={20} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Google Sans', sans-serif" }}>Avg. Read Time</span>
                  <span className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Google Sans', sans-serif" }}>{stats?.readingStats?.averageReadTime || 0} min</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Google Sans', sans-serif" }}>Engagement Rate</span>
                  <span className="font-bold text-green-600">{Math.round(((stats?.totalLikes || 0) / Math.max(stats?.totalViews || 1, 1)) * 100)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Google Sans', sans-serif" }}>Avg. Views/Post</span>
                  <span className="font-bold text-gray-900 dark:text-white">{Math.round((stats?.totalViews || 0) / Math.max(stats?.totalPosts || 1, 1))}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Google Sans', sans-serif" }}>Next Steps</p>
                <Zap className="text-green-500" size={20} />
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 "style={{ fontFamily: "'Google Sans', sans-serif" }}>
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: "'Google Sans', sans-serif" }}>Write your next article</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: "'Google Sans', sans-serif" }}>Share with community</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: "'Google Sans', sans-serif" }}>Engage with readers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          {(stats?.recentPosts || []).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {(stats?.recentPosts || []).map((post) => (
                  <div key={post._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {post?.title || 'Untitled'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {post?.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Views</p>
                          <p className="font-bold text-gray-900 dark:text-white">{post?.views || 0}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
                          <p className="font-bold text-pink-600">{post?.likes || 0}</p>
                        </div>
                        <ArrowRight className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  subtitle: string;
  bgGradient: string;
}> = ({ icon, label, value, subtitle, bgGradient }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
      <div className={`bg-gradient-to-br ${bgGradient} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div>{icon}</div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
