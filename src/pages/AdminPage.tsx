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
        const res = await axios.get("http://localhost:5000/api/auth/verify", {
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
      const res = await axios.get("http://localhost:5000/api/posts");
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
      const res = await axios.post("http://localhost:5000/api/auth/login", credentials);
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
        await axios.put(`http://localhost:5000/api/posts/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Entry updated successfully", {
          icon: <CheckCircle2 className="text-green-500" />,
          duration: 1000,
        });
      } else {
        await axios.post("http://localhost:5000/api/posts", form, {
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
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
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

  // Loading Screen
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20">
              <Shield className="w-16 h-16 text-blue-600 mx-auto" />
            </div>
            <Shield className="w-16 h-16 text-blue-600 mx-auto animate-pulse" />
          </div>
          <div className="text-slate-700 font-medium text-lg tracking-wide">
            <span className="inline-block animate-pulse">●</span> Initializing System
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    );

  
  // Logout Confirmation Modal
  const LogoutModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <LogOut className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Confirm Logout</h2>
        </div>
        
        <div className="p-6">
          <p className="text-slate-600 text-center mb-6">
            Are you sure you want to log out? You'll need to sign in again to access the admin panel.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 py-3 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg shadow-red-500/30"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {showLogoutModal && <LogoutModal />}
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Shield className="text-white w-7 h-7" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Admin Dashboard
                </h1>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                    <Activity size={12} />
                    Online
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-600">
                    Authorized Access
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/40 font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1 font-medium">Total Posts</p>
                <p className="text-3xl font-bold text-slate-900">{posts.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FilePlus2 className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1 font-medium">System Status</p>
                <p className="text-xl font-bold text-green-600">Operational</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Activity className="text-green-600 animate-pulse" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1 font-medium">Mode</p>
                <p className="text-xl font-bold text-slate-900">{editing ? "Editing" : "Ready"}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                {editing ? <Edit className="text-indigo-600" size={24} /> : <Shield className="text-indigo-600" size={24} />}
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            {editing ? (
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Edit className="text-amber-600" size={20} />
              </div>
            ) : (
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Plus className="text-blue-600" size={20} />
              </div>
            )}
            <h2 className="text-xl font-bold text-slate-900">
              {editing ? "Edit Post" : "Create New Post"}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-slate-700 font-medium text-sm mb-2 block">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter post title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-slate-50 border border-slate-300 text-slate-900 p-3 w-full rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="text-slate-700 font-medium text-sm mb-2 block">
                Content
              </label>
              <textarea
                placeholder="Enter post content..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="bg-slate-50 border border-slate-300 text-slate-900 p-3 w-full h-40 rounded-lg resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 flex items-center gap-2"
              >
                {editing ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Update Post</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Publish Post</span>
                  </>
                )}
              </button>
              
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-medium px-6 py-2.5 rounded-lg transition-all flex items-center gap-2"
                >
                  <XCircle size={18} />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Posts List */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Terminal size={24} className="text-blue-600" />
              Posts ({posts.length})
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 font-medium"
              >
                <FilePlus2 size={18} />
                <span className="hidden sm:inline">New Post</span>
              </button>
              <button
                onClick={() => navigate("/admin/documents")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-green-500/30 font-medium"
              >
                <FilePlus2 size={18} />
                <span className="hidden sm:inline">Upload Document</span>
              </button>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
              <FilePlus2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium text-lg">No posts yet</p>
              <p className="text-slate-500 text-sm mt-2">Create your first post to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <div
                  key={post._id}
                  className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-slate-400 text-sm font-medium">#{String(index + 1).padStart(2, '0')}</span>
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Activity size={12} className="text-blue-500" />
                          {new Date(post.createdAt || "").toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{new Date(post.createdAt || "").toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg flex items-center gap-1 transition-all border border-blue-200"
                        title="Edit post"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id!)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg flex items-center gap-1 transition-all border border-red-200"
                        title="Delete post"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Shield className="text-blue-600" size={24} />
              <span className="text-slate-900 font-bold text-lg">Iddy Chesire</span>
            </div>
            <p className="text-sm text-slate-600">
              <span className="text-blue-600 font-medium">Learn</span> •{" "}
              <span className="text-indigo-600 font-medium">Understand</span> •{" "}
              <span className="text-green-600 font-medium">Secure</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminPage;