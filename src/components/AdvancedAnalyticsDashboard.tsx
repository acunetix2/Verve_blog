import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  Eye,
  MessageSquare,
  Heart,
  Calendar,
  ArrowUp,
  ArrowDown,
  Clock,
  Target,
  Zap,
} from "lucide-react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsData {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  readTime: number;
}

interface TimeSeriesData {
  date: string;
  views: number;
  engagement: number;
  readTime: number;
}

interface TopPostData {
  title: string;
  views: number;
  engagement: number;
  trend: "up" | "down";
}

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    readTime: 0,
  });

  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [topPosts, setTopPosts] = useState<TopPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/analytics?range=${dateRange}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setAnalyticsData(response.data.summary);
      setTimeSeriesData(response.data.timeSeries);
      setTopPosts(response.data.topPosts);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    trend,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    trend?: number;
    color: string;
  }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2 text-gray-900">{value.toLocaleString()}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
              {trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span>{Math.abs(trend)}% vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{Icon}</div>
      </div>
    </div>
  );

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          Array(5)
            .fill(0)
            .map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)
        ) : (
          <>
            <StatCard icon={<Eye className="text-blue-600" />} label="Total Views" value={analyticsData.views} trend={12} color="bg-blue-50" />
            <StatCard icon={<Heart className="text-red-600" />} label="Total Likes" value={analyticsData.likes} trend={8} color="bg-red-50" />
            <StatCard icon={<MessageSquare className="text-green-600" />} label="Comments" value={analyticsData.comments} trend={-2} color="bg-green-50" />
            <StatCard icon={<Zap className="text-yellow-600" />} label="Shares" value={analyticsData.shares} trend={15} color="bg-yellow-50" />
            <StatCard icon={<Clock className="text-purple-600" />} label="Avg Read Time" value={analyticsData.readTime} color="bg-purple-50" />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views Over Time */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Views Over Time</h2>
          {loading ? (
            <Skeleton className="h-80 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                  labelStyle={{ color: "#000" }}
                />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Engagement Breakdown */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Engagement Mix</h2>
          {loading ? (
            <Skeleton className="h-80 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Views", value: analyticsData.views },
                    { name: "Likes", value: analyticsData.likes },
                    { name: "Comments", value: analyticsData.comments },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Top Performing Posts</h2>
        {loading ? (
          <div className="space-y-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
          </div>
        ) : (
          <div className="space-y-3">
            {topPosts.map((post, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{post.title}</p>
                  <p className="text-sm text-gray-600">{post.views.toLocaleString()} views</p>
                </div>
                <div className={`flex items-center gap-1 ${post.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {post.trend === "up" ? <TrendingUp size={18} /> : <ArrowDown size={18} />}
                  <span className="text-sm font-medium">{post.engagement}% engagement</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
