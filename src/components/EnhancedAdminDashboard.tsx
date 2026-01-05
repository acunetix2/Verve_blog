import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  FileText,
  TrendingUp,
  Eye,
  MessageSquare,
  AlertCircle,
  Settings,
  Lock,
  Trash2,
  Edit,
  Search,
  Filter,
  Plus,
  MoreVertical,
  ChevronDown,
  CheckCircle2,
  Clock,
  Calendar,
  Server,
  Database,
  Activity,
  Shield,
  Mail,
  Flag,
  Download,
  Zap,
  BarChart3,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  totalViews: number;
  totalComments: number;
  avgEngagementRate: number;
  activeUsers: number;
}

interface PostData {
  _id: string;
  title: string;
  author: string;
  views: number;
  likes: number;
  comments: number;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
  category: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  posts: number;
  joinDate: string;
  lastActive: string;
  status: "active" | "inactive";
}

interface ActivityLog {
  id: string;
  type: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
}

const EnhancedAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalUsers: 0,
    totalViews: 0,
    totalComments: 0,
    avgEngagementRate: 0,
    activeUsers: 0,
  });

  const [posts, setPosts] = useState<PostData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "posts" | "users" | "activity" | "settings"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel
      const [statsRes, postsRes, usersRes, logsRes] = await Promise.all([
        axios.get("/api/admin/stats", { headers }),
        axios.get("/api/admin/posts", { headers }),
        axios.get("/api/admin/users", { headers }),
        axios.get("/api/admin/activity-logs", { headers }),
      ]).catch((err) => {
        // Fallback to mock data for development
        console.warn("Using mock data:", err);
        return [
          { data: mockStats },
          { data: mockPosts },
          { data: mockUsers },
          { data: mockActivityLogs },
        ];
      });

      setStats(statsRes.data);
      setPosts(postsRes.data);
      setUsers(usersRes.data);
      setActivityLogs(logsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p._id !== postId));
      toast.success("Post deleted successfully");
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const changeUserRole = async (userId: string, newRole: "admin" | "user") => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      toast.success("User role updated");
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/admin/users/${userId}/status`,
        { status: "inactive" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, status: "inactive" } : u
        )
      );
      toast.success("User deactivated");
    } catch (error) {
      toast.error("Failed to deactivate user");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterStatus === "all" || user.role === filterStatus;
    return matchesSearch && matchesRole;
  });

  const StatCard = ({
    icon: Icon,
    label,
    value,
    change,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    change?: string;
    color: string;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className="text-xs text-green-600 mt-2">
              ↑ {change} from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{Icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Activity className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download size={18} className="mr-2" />
                Export Report
              </Button>
              <Button
                onClick={fetchDashboardData}
                variant="outline"
                size="sm"
              >
                <Zap size={18} className="mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-200 -mx-6 px-6">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "posts", label: "Posts", icon: FileText },
            { id: "users", label: "Users", icon: Users },
            { id: "activity", label: "Activity", icon: Activity },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab: any) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors font-medium ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                icon={<FileText className="text-blue-600" />}
                label="Total Posts"
                value={stats.totalPosts}
                color="bg-blue-50"
              />
              <StatCard
                icon={<Users className="text-green-600" />}
                label="Total Users"
                value={stats.totalUsers}
                color="bg-green-50"
              />
              <StatCard
                icon={<Eye className="text-purple-600" />}
                label="Total Views"
                value={stats.totalViews.toLocaleString()}
                color="bg-purple-50"
              />
              <StatCard
                icon={<MessageSquare className="text-orange-600" />}
                label="Total Comments"
                value={stats.totalComments}
                color="bg-orange-50"
              />
              <StatCard
                icon={<TrendingUp className="text-red-600" />}
                label="Avg Engagement"
                value={`${stats.avgEngagementRate.toFixed(1)}%`}
                color="bg-red-50"
              />
              <StatCard
                icon={<Activity className="text-cyan-600" />}
                label="Active Users"
                value={stats.activeUsers}
                color="bg-cyan-50"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Over Time */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Post Categories */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Posts by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement Metrics */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="likes" fill="#ef4444" />
                    <Bar dataKey="comments" fill="#3b82f6" />
                    <Bar dataKey="shares" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* User Growth */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus size={18} className="mr-2" />
                New Post
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Engagement
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {post.title}
                          </p>
                          <p className="text-sm text-gray-500">{post.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {post.author}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={post.status === "published" ? "default" : "outline"}
                          className="capitalize"
                        >
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1">
                            <Eye size={14} /> {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={14} /> {post.comments}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowDeleteConfirm(post._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Delete Post?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deletePost(showDeleteConfirm)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {user.name}
                          </h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FileText size={14} /> {user.posts} posts
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> Joined{" "}
                          {new Date(user.joinDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> Last active{" "}
                          {new Date(user.lastActive).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                      >
                        {user.status}
                      </Badge>
                      <Select
                        value={user.role}
                        onValueChange={(role: any) =>
                          changeUserRole(user._id, role)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      {user.status === "active" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deactivateUser(user._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Lock size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Activity Log</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        By {log.user} • {log.timestamp}
                      </p>
                    </div>
                    <Badge variant="outline">{log.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-blue-600" />
                <h3 className="text-lg font-semibold">Security</h3>
              </div>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  Change Password
                </Button>
                <Button className="w-full" variant="outline">
                  Manage Sessions
                </Button>
                <Button className="w-full" variant="outline">
                  Two-Factor Authentication
                </Button>
              </div>
            </div>

            {/* Email Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="text-green-600" />
                <h3 className="text-lg font-semibold">Email Notifications</h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700">
                    New user registrations
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700">
                    Comment moderation alerts
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700">
                    System alerts
                  </span>
                </label>
              </div>
            </div>

            {/* Database Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="text-purple-600" />
                <h3 className="text-lg font-semibold">Database</h3>
              </div>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  Backup Database
                </Button>
                <Button className="w-full" variant="outline">
                  Optimize Database
                </Button>
                <Button className="w-full" variant="outline">
                  View Logs
                </Button>
              </div>
            </div>

            {/* Server Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Server className="text-orange-600" />
                <h3 className="text-lg font-semibold">Server</h3>
              </div>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  View System Status
                </Button>
                <Button className="w-full" variant="outline">
                  Cache Management
                </Button>
                <Button className="w-full" variant="outline">
                  Performance Metrics
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Mock data for development
const mockStats: DashboardStats = {
  totalPosts: 152,
  totalUsers: 1250,
  totalViews: 45230,
  totalComments: 890,
  avgEngagementRate: 7.8,
  activeUsers: 342,
};

const mockPosts: PostData[] = [
  {
    _id: "1",
    title: "Getting Started with Cybersecurity",
    author: "John Doe",
    views: 1250,
    likes: 145,
    comments: 32,
    status: "published",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-05",
    category: "Tutorials",
  },
  {
    _id: "2",
    title: "Advanced Penetration Testing",
    author: "Jane Smith",
    views: 890,
    likes: 98,
    comments: 24,
    status: "published",
    createdAt: "2025-01-02",
    updatedAt: "2025-01-04",
    category: "Advanced",
  },
];

const mockUsers: UserData[] = [
  {
    _id: "1",
    name: "John Administrator",
    email: "admin@verve.com",
    role: "admin",
    posts: 45,
    joinDate: "2024-06-01",
    lastActive: "2025-01-05",
    status: "active",
  },
  {
    _id: "2",
    name: "Jane Contributor",
    email: "jane@verve.com",
    role: "user",
    posts: 12,
    joinDate: "2024-08-15",
    lastActive: "2025-01-04",
    status: "active",
  },
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    type: "POST",
    user: "Jane Contributor",
    action: "Published new article",
    timestamp: "2025-01-05 14:32",
    details: 'Published "Advanced Penetration Testing"',
  },
  {
    id: "2",
    type: "USER",
    user: "John Administrator",
    action: "Deleted user account",
    timestamp: "2025-01-05 10:15",
    details: 'Deleted account for "Inactive User"',
  },
];

const CHART_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
];

const chartData = {
  viewsData: [
    { date: "Mon", views: 2400 },
    { date: "Tue", views: 1398 },
    { date: "Wed", views: 9800 },
    { date: "Thu", views: 3908 },
    { date: "Fri", views: 4800 },
    { date: "Sat", views: 3800 },
    { date: "Sun", views: 4300 },
  ],
  categoryData: [
    { name: "Tutorials", value: 45 },
    { name: "Advanced", value: 30 },
    { name: "Tools", value: 25 },
    { name: "News", value: 52 },
  ],
  engagementData: [
    { day: "Mon", likes: 125, comments: 32, shares: 28 },
    { day: "Tue", likes: 98, comments: 24, shares: 15 },
    { day: "Wed", likes: 175, comments: 45, shares: 38 },
    { day: "Thu", likes: 142, comments: 38, shares: 24 },
    { day: "Fri", likes: 158, comments: 42, shares: 31 },
    { day: "Sat", likes: 98, comments: 28, shares: 18 },
    { day: "Sun", likes: 112, comments: 35, shares: 22 },
  ],
  userGrowthData: [
    { month: "Jan", users: 450 },
    { month: "Feb", users: 620 },
    { month: "Mar", users: 840 },
    { month: "Apr", users: 1050 },
    { month: "May", users: 1250 },
  ],
};

export default EnhancedAdminDashboard;
