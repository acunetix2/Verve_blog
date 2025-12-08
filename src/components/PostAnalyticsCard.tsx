import React, { useEffect, useState } from "react";
import { FileText, Calendar, TrendingUp, Zap } from "lucide-react";

interface PostAnalyticsCardProps {
  endpoint: string; // backend API to fetch posts
  editing?: boolean;
}

const PostAnalyticsCard: React.FC<PostAnalyticsCardProps> = ({ endpoint, editing = false }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [endpoint]);

  // Calculate analytics
  const analytics = React.useMemo(() => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentPosts = posts.filter(p => new Date(p.createdAt || "") > lastWeek).length;
    const growthRate = posts.length > 0 ? ((recentPosts / posts.length) * 100).toFixed(1) : "0";

    return { recentPosts, growthRate };
  }, [posts]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6" style={{ fontFamily: "'Google Sans', 'Product Sans', sans-serif" }}>
      
      {/* Total Posts */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 to-indigo-600/15 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-white backdrop-blur-xl border border-indigo-200/60 rounded-xl p-3 sm:p-3.5 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-lg blur opacity-20" />
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                <FileText className="text-white w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            <span className="text-emerald-600 text-[9px] sm:text-[10px] font-semibold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60">
              <TrendingUp size={9} className="sm:w-2.5 sm:h-2.5" />
              <span className="hidden xs:inline">Active</span>
            </span>
          </div>
          <div>
            <p className="text-gray-600 text-[9px] sm:text-[10px] mb-0.5 font-medium uppercase tracking-wide">Total Posts</p>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-indigo-700 to-indigo-500 bg-clip-text text-transparent mb-0.5">{loading ? "..." : posts.length}</p>
            <p className="text-[8px] sm:text-[9px] text-gray-500 hidden xs:block">All time content</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/15 to-rose-600/15 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-white backdrop-blur-xl border border-rose-200/60 rounded-xl p-3 sm:p-3.5 hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-rose-500 rounded-lg blur opacity-20" />
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-105 transition-transform duration-300">
                <Calendar className="text-white w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            <span className="text-rose-600 text-[9px] sm:text-[10px] font-semibold bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200/60">
              <span className="hidden xs:inline">7 days</span><span className="xs:hidden">7d</span>
            </span>
          </div>
          <div>
            <p className="text-gray-600 text-[9px] sm:text-[10px] mb-0.5 font-medium uppercase tracking-wide">Recent<span className="hidden xs:inline"> Activity</span></p>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-rose-700 to-rose-500 bg-clip-text text-transparent mb-0.5">{loading ? "..." : analytics.recentPosts}</p>
            <p className="text-[8px] sm:text-[9px] text-gray-500 hidden xs:block">Posts this week</p>
          </div>
        </div>
      </div>

      {/* Growth Rate */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 to-orange-600/15 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-white backdrop-blur-xl border border-orange-200/60 rounded-xl p-3 sm:p-3.5 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 rounded-lg blur opacity-20" />
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform duration-300">
                <TrendingUp className="text-white w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            <span className="text-orange-600 text-[9px] sm:text-[10px] font-semibold bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-200/60 hidden xs:inline">Growth</span>
          </div>
          <div>
            <p className="text-gray-600 text-[9px] sm:text-[10px] mb-0.5 font-medium uppercase tracking-wide">Growth<span className="hidden xs:inline"> Rate</span></p>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-orange-700 to-orange-500 bg-clip-text text-transparent mb-0.5">{loading ? "..." : analytics.growthRate}%</p>
            <p className="text-[8px] sm:text-[9px] text-gray-500 hidden xs:block">Weekly performance</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/15 to-teal-600/15 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-white backdrop-blur-xl border border-teal-200/60 rounded-xl p-3 sm:p-3.5 hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-500 rounded-lg blur opacity-20 animate-pulse" />
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md shadow-teal-500/30 group-hover:scale-105 transition-transform duration-300">
                <Zap className="text-white w-4 h-4 sm:w-4.5 sm:h-4.5 animate-pulse" />
              </div>
            </div>
            <span className="text-teal-600 text-[9px] sm:text-[10px] font-semibold bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-200/60 hidden xs:inline">Status</span>
          </div>
          <div>
            <p className="text-gray-600 text-[9px] sm:text-[10px] mb-0.5 font-medium uppercase tracking-wide">System<span className="hidden xs:inline"> Health</span></p>
            <p className="text-sm sm:text-base font-bold bg-gradient-to-br from-teal-700 to-teal-500 bg-clip-text text-transparent mb-0.5">Optimal</p>
            <p className="text-[8px] sm:text-[9px] text-gray-500 hidden xs:block">{editing ? "Edit mode" : "Ready to create"}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PostAnalyticsCard;
