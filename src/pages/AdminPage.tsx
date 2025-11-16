import React, { useEffect, useState } from "react";
import {
  Terminal,
  Lock,
  Trash2,
  Edit,
  LogOut,
  Plus,
  Shield,
  DoorOpen,
  Loader2,
  FilePlus2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Eye,
  Server,
  Activity,
  X,
  TrendingUp,
  Calendar,
  Clock,
  BarChart3,
  Zap,
  FileText,
  Search,
  Filter,
  MoreVertical,
  Cpu,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Post {
  _id?: string;
  title: string;
  content: string;
  createdAt?: string;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(!token);
  const [form, setForm] = useState<Post>({ title: "", content: "" });
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [authLoading, setAuthLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreate = () => {
    navigate("/admin/create");
  };

  // Verify token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.valid) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("token");
          setShowLogin(true);
          toast.error("Session expired - authentication required", {
            icon: <XCircle className="text-red-500" />,
            duration: 3000,
          });
        }
      } catch {
        localStorage.removeItem("token");
        setShowLogin(true);
        toast.error("Authentication failed - please verify credentials", {
          icon: <AlertTriangle className="text-amber-500" />,
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts`);
      setPosts(res.data);
      toast.success("Posts synchronized", {
        icon: <CheckCircle2 className="text-green-500" />,
        duration: 3000,
      });
    } catch {
      toast.error("Connection failed - check server status", {
        icon: <AlertTriangle className="text-amber-500" />,
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchPosts();
  }, [isLoggedIn]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, credentials);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setIsLoggedIn(true);
      setShowLogin(false);
      toast.success("Authentication successful - access granted", {
        icon: <CheckCircle2 className="text-green-500" />,
        duration: 1000,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Authentication denied - invalid credentials", {
        icon: <XCircle className="text-red-500" />,
        duration: 1000,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setToken(null);
    setIsLoggedIn(false);
    setShowLogin(true);
    setShowLogoutModal(false);
    toast.success("Logged out successfully", {
      icon: <CheckCircle2 className="text-green-500" />,
      duration: 2000,
    });
  };

  // Create or Update post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content)
      return toast.warning("Missing required fields", {
        icon: <AlertTriangle className="text-amber-500" />,
        duration: 1000,
      });
    try {
      if (editing && form._id) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/posts/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Entry updated successfully", {
          icon: <CheckCircle2 className="text-green-500" />,
          duration: 1000,
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/posts`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Post created successfully", {
          icon: <FilePlus2 className="text-blue-500" />,
          duration: 1000,
        });
      }
      setForm({ title: "", content: "" });
      setEditing(false);
      fetchPosts();
    } catch {
      toast.error("Operation failed - please retry", {
        icon: <XCircle className="text-red-500" />,
        duration: 1000,
      });
    }
  };

  // Delete post
  const handleDelete = async (id: string) => {
    if (!window.confirm("Confirm permanent deletion of this post?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted successfully", {
        icon: <CheckCircle2 className="text-green-500" />,
        duration: 3000,
      });
      fetchPosts();
    } catch {
      toast.error("Deletion failed - please retry", {
        icon: <XCircle className="text-red-500" />,
        duration: 3000,
      });
    }
  };

  // Edit post
  const handleEdit = (post: Post) => {
    setForm(post);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("Edit mode enabled", {
      icon: <Info className="text-blue-500" />,
      duration: 3000,
    });
  };

  // Reset form
  const resetForm = () => {
    setForm({ title: "", content: "" });
    setEditing(false);
    toast.info("Changes discarded", {
      icon: <Info className="text-blue-500" />,
      duration: 3000,
    });
  };

  // Calculate analytics
  const getAnalytics = () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentPosts = posts.filter(p => new Date(p.createdAt || "") > lastWeek).length;
    const monthlyPosts = posts.filter(p => new Date(p.createdAt || "") > lastMonth).length;
    const growthRate = posts.length > 0 ? ((recentPosts / posts.length) * 100).toFixed(1) : "0";
    
    return { recentPosts, monthlyPosts, growthRate };
  };

  const analytics = getAnalytics();

  // Filter posts by search
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading Screen
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500" />
            </div>
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/50">
              <Cpu className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-white font-semibold text-xl tracking-wide">
              Initializing Admin Dashboard
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{animationDelay: '0ms'}} />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: '150ms'}} />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay: '300ms'}} />
            </div>
          </div>
        </div>
      </div>
    );

  // Logout Confirmation Modal
  const LogoutModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-br from-red-500/20 via-red-600/10 to-transparent p-8 border-b border-red-500/20">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/50">
            <LogOut className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">End Session</h2>
          <p className="text-slate-400 text-center mt-2 text-sm">Confirm logout action</p>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-slate-300 text-center">
            You will be redirected to the login page and all unsaved changes will be lost.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-6 py-3 rounded-xl transition-all border border-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-500/30"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {showLogoutModal && <LogoutModal />}
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800  to-gray-900 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 hover:text-green-700">
                  <Cpu className="text-red-700 w-6 h-6" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 shadow-lg shadow-green-400/50"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Verve Hub Admin Dashboard
                </h1>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-green-400 flex items-center gap-1 font-medium">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Live
                  </span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-red-400">
                    Secure Access
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <FileText className="text-white w-6 h-6" />
                </div>
                <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                  <TrendingUp size={14} />
                  Active
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1 font-medium">Total Posts</p>
                <p className="text-4xl font-bold text-white mb-1">{posts.length}</p>
                <p className="text-xs text-slate-500">All time content</p>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Calendar className="text-white w-6 h-6" />
                </div>
                <span className="text-purple-400 text-sm font-semibold">7 days</span>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1 font-medium">Recent Activity</p>
                <p className="text-4xl font-bold text-white mb-1">{analytics.recentPosts}</p>
                <p className="text-xs text-slate-500">Posts this week</p>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-amber-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/50">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
                <span className="text-amber-400 text-sm font-semibold">Growth</span>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1 font-medium">Growth Rate</p>
                <p className="text-4xl font-bold text-white mb-1">{analytics.growthRate}%</p>
                <p className="text-xs text-slate-500">Weekly performance</p>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-green-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50">
                  <Zap className="text-white w-6 h-6 animate-pulse" />
                </div>
                <span className="text-green-400 text-sm font-semibold">Status</span>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1 font-medium">System Health</p>
                <p className="text-2xl font-bold text-white mb-1">Optimal</p>
                <p className="text-xs text-slate-500">{editing ? "Edit mode" : "Ready to create"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            {editing ? (
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/50">
                <Edit className="text-white w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                <Plus className="text-white w-6 h-6" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">
                {editing ? "Edit Content" : "Create New Post"}
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">
                {editing ? "Update existing content" : "Add new content to your platform"}
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-slate-300 font-medium text-sm mb-3 block flex items-center gap-2">
                <FileText size={16} className="text-blue-400" />
                Post Title
              </label>
              <input
                type="text"
                placeholder="Enter a compelling title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 p-4 w-full rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="text-slate-300 font-medium text-sm mb-3 block flex items-center gap-2">
                <Edit size={16} className="text-cyan-400" />
                Content Body
              </label>
              <textarea
                placeholder="Write your content here..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 p-4 w-full h-48 rounded-xl resize-none focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                required
              />
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center gap-2"
              >
                {editing ? (
                  <>
                    <CheckCircle2 size={20} />
                    <span>Update Post</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Publish Post</span>
                  </>
                )}
              </button>
              
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium px-8 py-3 rounded-xl transition-all flex items-center gap-2"
                >
                  <XCircle size={20} />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Posts List */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <Terminal size={20} className="text-white" />
                </div>
                Content Library
              </h2>
              <p className="text-slate-400 text-sm mt-1 ml-13">{filteredPosts.length} items found</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all min-w-[200px]"
                />
              </div>
              
              <button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 font-medium"
              >
                <FilePlus2 size={18} />
                <span className="hidden sm:inline">New Post</span>
              </button>
              
              <button
                onClick={() => navigate("/admin/documents")}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-green-500/30 font-medium"
              >
                <FilePlus2 size={18} />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/30">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FilePlus2 className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-300 font-semibold text-xl mb-2">
                {searchTerm ? "No results found" : "No posts yet"}
              </p>
              <p className="text-slate-500 text-sm">
                {searchTerm ? "Try adjusting your search terms" : "Create your first post to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post, index) => (
                <div
                  key={post._id}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all backdrop-blur-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                            {post.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400 ml-14">
                          <span className="flex items-center gap-2">
                            <Calendar size={14} className="text-blue-400" />
                            {new Date(post.createdAt || "").toLocaleDateString()}
                          </span>
                          <span className="text-slate-700">•</span>
                          <span className="flex items-center gap-2">
                            <Clock size={14} className="text-cyan-400" />
                            {new Date(post.createdAt || "").toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleEdit(post)}
                          className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                          title="Edit post"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id!)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                          title="Delete post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-800/50">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                <Shield className="text-white w-5 h-5" />
              </div>
              <span className="text-white font-bold text-xl">Iddy Chesire</span>
            </div>
            <p className="text-sm text-slate-400">
              <span className="text-blue-400 font-medium">Analyze</span> •{" "}
              <span className="text-cyan-400 font-medium">Optimize</span> •{" "}
              <span className="text-green-400 font-medium">Scale</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span>All systems operational • Verve Hub v2.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminPage;