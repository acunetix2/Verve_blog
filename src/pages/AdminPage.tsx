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
  const [terminalText, setTerminalText] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleCreate = () => {
	  navigate("/admin/create");
  };

   const validateFields = () => {
		const newErrors: { [key: string]: boolean } = {};
		if (!formData.title.trim()) newErrors.title = true;
		if (!formData.content.trim()) newErrors.content = true;
		return newErrors;
	  };

  // ✅ Verify token
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
          icon: <AlertTriangle className="text-yellow-400" />,
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);


  // ✅ Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
      toast.success("Posts synchronized", {
        icon: <CheckCircle2 className="text-green-400" />,
        duration: 3000,
      });
    } catch {
      toast.error("Connection failed - check server status", {
        icon: <AlertTriangle className="text-yellow-400" />,
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchPosts();
  }, [isLoggedIn]);

  // ✅ Login handler
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
        icon: <CheckCircle2 className="text-green-400" />,
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

  // ✅ Create or Update post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content)
      return toast.warning("Missing required fields", {
        icon: <AlertTriangle className="text-yellow-400" />,
        duration: 1000,
      });
    try {
      if (editing && form._id) {
        await axios.put(`http://localhost:5000/api/posts/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Entry updated successfully", {
          icon: <CheckCircle2 className="text-green-400" />,
          duration: 1000,
        });
      } else {
        await axios.post("http://localhost:5000/api/posts", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Post created successfully", {
          icon: <FilePlus2 className="text-blue-400" />,
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

  // ✅ Delete post
  const handleDelete = async (id: string) => {
    if (!toast.success("Confirm permanent deletion of this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted successfully", {
        icon: <CheckCircle2 className="text-green-400" />,
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

  // ✅ Edit post
  const handleEdit = (post: Post) => {
    setForm(post);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("Edit mode enabled", {
      icon: <Info className="text-blue-400" />,
      duration: 3000,
    });
  };

  // ✅ Reset form
  const resetForm = () => {
    setForm({ title: "", content: "" });
    setEditing(false);
    toast.info("Changes discarded", {
      icon: <Info className="text-blue-400" />,
      duration: 3000,
    });
  };

  // ✅ Loading Screen
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-950 via-black to-blue-950">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20">
              <Shield className="w-16 h-16 text-cyan-400 mx-auto" />
            </div>
            <Shield className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
          </div>
          <div className="text-cyan-400 font-mono text-lg tracking-wider">
            <span className="inline-block animate-pulse">&gt;</span> INITIALIZING SYSTEM
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    );

  // ✅ LOGIN UI
  if (showLogin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-950 relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-40px) translateX(-10px); }
            75% { transform: translateY(-20px) translateX(10px); }
          }
        `}</style>

        <div className="relative z-10 w-full max-w-md px-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 backdrop-blur-sm border border-cyan-500/50 rounded-t-lg p-4 flex items-center justify-between shadow-lg shadow-cyan-500/20">
            <div className="flex items-center gap-3">
              <Activity className="text-green-500 animate-pulse" size={24} />
              <span className="text-cyan-300 font-mono animate-pulse text-sm font-bold tracking-wider">
                SECURE ACCESS POINT
              </span>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-gray-950/90 backdrop-blur-sm border-x border-b border-cyan-500/50 rounded-b-lg p-8 shadow-2xl shadow-cyan-500/30">
            <div className="mb-8">
              <div className="flex items-center gap-2 animate-pulse text-yellow-400 font-mono text-xs bg-yellow-950/20 border border-yellow-500/30 rounded p-3">
                <AlertTriangle size={16} />
                <span>AUTHORIZED ACCESS ONLY</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-cyan-400 font-mono text-xs mb-2 block tracking-wide">
                    IDENTITY VERIFICATION
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials({ ...credentials, email: e.target.value })
                      }
                      placeholder="***************"
                      className="bg-gray-900/50 border border-cyan-500/50 text-cyan-300 font-mono p-3 pl-10 w-full rounded-full focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                      required
                    />
                    <Server className="absolute left-3 top-3.5 text-cyan-500/50" size={16} />
                  </div>
                </div>

                <div>
                  <label className="text-cyan-400 font-mono text-xs mb-2 block tracking-wide">
                    AUTHENTICATION KEY
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({ ...credentials, password: e.target.value })
                      }
                      placeholder="********"
                      className="bg-gray-900/50 border border-cyan-500/50 text-cyan-300 font-mono p-3 pl-10 w-full rounded-full focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                      required
                    />
                    <Lock className="absolute left-3 top-3.5 text-cyan-500/50" size={16} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold px-6 py-3 rounded-full w-full transition-all flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    <span>AUTHENTICATING</span>
                  </>
                ) : (
                  <>
                    <Shield size={18} className="mr-2 rounded-full shadow-lg shadow-cyan-500/20" />
                    <span>AUTHENTICATE</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 text-cyan-300 font-mono px-6 py-3 rounded-full w-full transition-all flex items-center justify-center"
              >
                <DoorOpen className="mr-2" size={16} />
                <span>HOME</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono mt-6">
                <Activity size={16} className="text-green-500 animate-pulse" />
                <span>CONNECTION SECURED</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-950 text-cyan-300 font-mono">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/30 bg-gray-950/80 backdrop-blur-md shadow-lg shadow-cyan-500/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Shield className="text-cyan-400 w-12 h-12" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  ADMIN CONTROL CENTER
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <Activity size={12} className="animate-pulse" />
                    SYSTEM ONLINE
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-cyan-400">
                    ACCESS PRIVILLEDGE: Authorized
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setToken(null);
                setIsLoggedIn(false);
                setShowLogin(true);
                toast.info("Session terminated securely", {
                  icon: <Info className="text-blue-400" />,
                  duration: 3000,
                });
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-2 py-1 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-cyan-400/70 mb-1">TOTAL POSTS</p>
                <p className="text-2xl font-bold text-cyan-300">{posts.length}</p>
              </div>
              <FilePlus2 className="text-cyan-400/30" size={32} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-400/70 mb-1">SYSTEM STATUS</p>
                <p className="text-lg font-bold text-green-300">OPERATIONAL</p>
              </div>
              <Activity className="text-green-500/30 animate-pulse" size={32} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-950/80 to-red-950/80 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs animate-pulse hover:cyan-500 mb-1">OPERATION MODE</p>
                <p className="text-lg font-bold text-blue-300">{editing ? "EDITING" : "READY"}</p>
              </div>
              {editing ? <Edit className="text-blue-400/30" size={32} /> : <Shield className="text-blue-400/90" size={32} />}
            </div>
          </div>
        </div>

        {/* Create/Edit Section */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 mb-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            {editing ? <Edit className="text-yellow-400" size={24} /> : <Plus className="text-cyan-400" size={24} />}
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              {editing ? "EDIT POST" : "ADMIN CONSOLE"}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-cyan-400 font-mono text-xs mb-2 block tracking-wide">
                TITLE
              </label>
              <input
                type="text"
                placeholder="Enter title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-black/50 border border-cyan-500/50 text-cyan-200 p-3 w-full rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                required
              />
            </div>
            <div>
              <label className="text-cyan-400 font-mono text-xs mb-2 block tracking-wide">
                CONTENT
              </label>
              <textarea
                placeholder="Enter content..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="bg-black/50 border border-cyan-500/50 text-cyan-200 p-3 w-full h-40 rounded-lg resize-none focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                required
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 flex items-center gap-2"
              >
                {editing ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Save</span>
                  </>
                ) : (
                  <>
                    <span>Publish</span>
                  </>
                )}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-red-700/100 hover:bg-gray-600/50 border border-gray-600 text-gray-300 px-4 py-2.5 rounded-full transition-all flex items-center gap-2"
                >
                  <XCircle size={14} />
                  <span>Cancel</span>
                </button>
              )}           
            </div>
          </form>
        </div>

        {/* Posts List */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center gap-2">
              <Terminal size={24} />
              DATABASE POSTS [{posts.length}]
            </h2>
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              <FilePlus2 size={18} />
              <span className="hidden sm:inline">New Post</span>
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 border border-cyan-500/30 rounded-lg bg-gradient-to-br from-gray-900/30 to-gray-950/30 backdrop-blur-sm">
              <FilePlus2 className="w-16 h-16 text-cyan-400/30 mx-auto mb-4" />
              <p className="text-cyan-400/70 font-mono">NO ENTRIES FOUND</p>
              <p className="text-gray-500 text-sm mt-2">Create your first entry to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <div
                  key={post._id}
                  className="group bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-5 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-cyan-500/50 font-mono text-sm">#{String(index + 1).padStart(3, '0')}</span>
                        <h3 className="text-lg font-bold text-cyan-200 group-hover:text-cyan-100 transition-colors">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Activity size={12} className="text-blue-400" />
                          {new Date(post.createdAt || "").toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{new Date(post.createdAt || "").toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="bg-blue-600/80 hover:bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center gap-1 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id!)}
                        className="bg-red-600/80 hover:bg-red-500 text-white px-3 py-2 rounded-lg flex items-center gap-1 transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                        title="Delete entry"
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
        <footer className="mt-16 pt-8 border-t border-cyan-500/20">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Shield className="text-cyan-400" size={24} />
              <span className="text-cyan-300 font-bold">Iddy Chesire</span>
            </div>
            <p className="text-xs text-gray-500 font-mono">
              <span className="text-cyan-400">Learn</span> •{" "}
              <span className="text-blue-400">Understand</span> •{" "}
              <span className="text-green-400">Secure</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <Activity size={12} className="text-green-500 animate-pulse" />
              <span>System operational • All systems secure</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminPage;