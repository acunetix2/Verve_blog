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
  Zap,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CompanyLogo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import AnalyticsCard from "@/components/AnalyticsCard";
import PostAnalyticsCard from "@/components/PostAnalyticsCard";
import DashboardAnalytics from "@/components/DashboardAnalytics";


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
  const [showAnalytics, setShowAnalytics] = useState(false);

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
  // Fetch documents
	const fetchDocuments = async () => {
	  try {
		const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/documents`);
		setDocuments(res.data);
		toast.success("Documents synchronized", {
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 px-4" style={{ fontFamily: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <div className="text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-white rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-blue-200 border-t-transparent rounded-full animate-spin" style={{ animationDuration: "1.5s" }}></div>
            <div className="absolute inset-2 border-4 border-white border-b-transparent rounded-full animate-spin" style={{ animationDuration: "1s" }}></div>
          </div>
          <div className="space-y-2">
            <p className="text-white text-sm font-semibold animate-pulse">
              Initializing Admin Dashboard
            </p>
            <p className="text-blue-100 text-xs">
              Please wait a moment...
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    );

  // Logout Confirmation Modal
  const LogoutModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-blue-100 animate-scale-in">
        <div className="bg-gradient-to-br from-red-50 via-white to-white p-6 border-b border-red-100">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/30">
            <LogOut className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 text-center">End Session</h2>
          <p className="text-gray-600 text-center mt-1 text-xs">Confirm logout action</p>
        </div>
        
        <div className="p-5 space-y-4">
          <p className="text-gray-700 text-center text-xs">
            You will be redirected to the login page and all unsaved changes will be lost.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-xl transition-all border border-gray-200 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-red-500/30 text-xs"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500" style={{ fontFamily: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {showLogoutModal && <LogoutModal />}
		<div className="w-full px-4 sm:px-6 py-4 sm:py-6">	
		<div className="flex items-center gap-3 mb-6">
		  <BarChart3 
			className="text-white text-3xl sm:text-4xl drop-shadow-lg"
		  />
		  <h2
			className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent 
					   bg-gradient-to-r from-indigo-400 via-pink-500 to-red-500 
					   drop-shadow-lg"
			style={{ fontFamily: "'Google Sans', 'Product Sans', sans-serif" }}
		  >
			Performance Analysis
		  </h2>
		</div>
		<PostAnalyticsCard
		  endpoint={`${import.meta.env.VITE_API_BASE_URL}/posts`} 
		  editing={false} 
		/>
		<AnalyticsCard
        endpoint={`${import.meta.env.VITE_API_BASE_URL}/documents`}
       />
		   <div>
		  <button
			onClick={() => setShowAnalytics((prev) => !prev)}
			className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
		  >
			View Analytics
		  </button>

		  {showAnalytics && (
			<div className="mt-4">
			  <DashboardAnalytics
				endpoints={{
				  posts: `${import.meta.env.VITE_API_BASE_URL}/posts`,
				  comments: `${import.meta.env.VITE_API_BASE_URL}/posts/comments`,
				  likes: `${import.meta.env.VITE_API_BASE_URL}/posts/likes`,
				  documents: `${import.meta.env.VITE_API_BASE_URL}/documents`,
				  users: `${import.meta.env.VITE_API_BASE_URL}/users`,
				}}
			  />
			</div>
		  )}
		</div>
       {/* Create/Edit Section */}
		<div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-lg">
		  <div className="flex items-center gap-2 mb-3">
			{editing ? (
			  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-md flex items-center justify-center shrink-0">
				<Edit className="text-amber-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
			  </div>
			) : (
			  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-md flex items-center justify-center shrink-0">
				<Plus className="text-blue-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
			  </div>
			)}
			<div className="min-w-0">
			  <h2 className="text-xs sm:text-sm font-bold text-white truncate">
				{editing ? "Edit Content" : "Create New Post"}
			  </h2>
			  <p className="text-slate-400 text-[9px] sm:text-[10px] mt-0.5 hidden xs:block uppercase tracking-wide">
				{editing ? "Update existing content" : "Add new content to platform"}
			  </p>
			</div>
		  </div>
		  
		  <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
			<div>
			  <label className="text-slate-300 font-semibold text-[9px] sm:text-[10px] mb-1 sm:mb-1.5 block flex items-center gap-1 uppercase tracking-wide">
				<FileText size={10} className="text-blue-400" />
				Post Title
			  </label>
			  <input
				type="text"
				placeholder="Enter a compelling title..."
				value={form.title}
				onChange={(e) => setForm({ ...form, title: e.target.value })}
				className="bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 p-2 sm:p-2.5 w-full rounded-md focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all text-[10px] sm:text-xs"
				required
			  />
			</div>
			
			<div>
			  <label className="text-slate-300 font-semibold text-[9px] sm:text-[10px] mb-1 sm:mb-1.5 block flex items-center gap-1 uppercase tracking-wide">
				<Edit size={10} className="text-blue-400" />
				Content Body
			  </label>
			  <textarea
				placeholder="Write your content here..."
				value={form.content}
				onChange={(e) => setForm({ ...form, content: e.target.value })}
				className="bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 p-2 sm:p-2.5 w-full h-24 sm:h-32 rounded-md resize-none focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all text-[10px] sm:text-xs"
				required
			  />
			</div>
			
			<div className="flex flex-col xs:flex-row gap-1.5 sm:gap-2 pt-1">
			  <button
				type="submit"
				className="bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-1 text-[10px] sm:text-xs hover:scale-[1.01] active:scale-[0.99] border border-blue-400/30"
			  >
				{editing ? (
				  <>
					<CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" />
					<span>Update Post</span>
				  </>
				) : (
				  <>
					<Plus size={12} className="sm:w-3.5 sm:h-3.5" />
					<span>Publish Post</span>
				  </>
				)}
			  </button>
			  
			  {editing && (
				<button
				  type="button"
				  onClick={resetForm}
				  className="bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 text-slate-300 font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-all flex items-center justify-center gap-1 text-[10px] sm:text-xs hover:scale-[1.01] active:scale-[0.99]"
				>
				  <XCircle size={12} className="sm:w-3.5 sm:h-3.5" />
				  <span>Cancel</span>
				</button>
			  )}
			</div>
		  </form>
		</div>
		{ /*  Posts List Section with Three Column Card Layout */}
		<section>
		  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 sm:mb-4">
			<div className="min-w-0">
			  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
				<div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-white to-blue-50 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50 shrink-0">
				  <Terminal size={14} className="text-blue-600 sm:w-4 sm:h-4" />
				</div>
				<span className="truncate">Content Library</span>
			  </h2>
			  <p className="text-blue-200 text-[10px] sm:text-xs mt-0.5 ml-9 sm:ml-10">{filteredPosts.length} items found</p>
			</div>           
			<div className="flex flex-wrap gap-2">
			  <div className="relative">
				  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white w-4 h-4 z-20" />

				  <input
					type="text"
					placeholder="Search posts..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="bg-white/20 backdrop-blur-sm border-2 border-blue-400/30 text-white placeholder-blue-200 pl-8 pr-3 py-2 rounded-xl focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all min-w-[180px] text-xs z-10"
				  />
				</div> 
			  {/* New Post Button */}
				<button
				  onClick={handleCreate}
				  className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-400/30 font-medium hover:scale-[1.03] active:scale-[0.97] text-sm"
				>
				  <FilePlus2 className="w-5 h-5" />
				  <span>New Post</span>
				</button>

				{/* Upload Button */}
				<button
				  onClick={() => navigate("/admin/documents")}
				  className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-green-400/30 font-medium hover:scale-[1.03] active:scale-[0.97] text-sm"
				>
				  <FilePlus2 className="w-5 h-5" />
				  <span>Upload</span>
				</button>
				{/* View Simulations Button */}
				<button
				  onClick={() => navigate("/admin/simulations")}
				  className="bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-purple-400/30 font-medium hover:scale-[1.03] active:scale-[0.97] text-sm"
				>
				  <Zap className="w-5 h-5" />
				  <span>Attack Sim</span>
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
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
			  {filteredPosts.map((post, index) => (
				<div
				  key={post._id}
				  className="group relative"
				>
				  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
				  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-xl p-3 hover:border-blue-500/50 transition-all backdrop-blur-sm h-full flex flex-col shadow-lg">
					{/* Card Header */}
					<div className="flex items-center justify-between gap-2 mb-2">
					  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
						{String(index + 1).padStart(2, '0')}
					  </div>
					  <div className="flex gap-1 shrink-0">
						<button
						  onClick={() => handleEdit(post)}
						  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 p-1.5 rounded-md transition-all hover:scale-110"
						  title="Edit post"
						>
						  <Edit size={12} />
						</button>
						<button
						  onClick={() => handleDelete(post._id!)}
						  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-1.5 rounded-md transition-all hover:scale-110"
						  title="Delete post"
						>
						  <Trash2 size={12} />
						</button>
					  </div>
					</div>

					{/* Card Content */}
					<div className="flex-1 flex flex-col min-h-0">
					  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
						{post.title}
					  </h3>
					  
					  <p className="text-xs text-slate-400 mb-2 line-clamp-2 flex-1">
						{post.content}
					  </p>

					  {/* Card Footer */}
					  <div className="flex flex-col gap-1 pt-2 border-t border-slate-700/50">
						<div className="flex items-center gap-1.5 text-[10px] text-slate-500">
						  <Calendar size={10} className="text-blue-400" />
						  <span className="truncate">{new Date(post.createdAt || "").toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
						</div>
					  </div>
					</div>
				  </div>
				</div>
			  ))}
			</div>
		  )}
		</section>
              {/* Enhanced Footer */}
		<footer className="relative border-t bg-slate-800 border-border/50 mt-20 bg-card/30 backdrop-blur-sm">
		  <div className="container max-w-7xl mx-auto py-12 px-4">
			<div className="max-w-6xl mx-auto">
			  {/* Footer Content */}
			  <div className="grid md:grid-cols-4 gap-8 mb-8">
				<div className="md:col-span-2">
				  <div className="flex items-center gap-2 mb-4">
					<div className="p-2 rounded-xl flex items-center justify-center">
					  <img 
						src={CompanyLogo} 
						alt="Company Logo" 
						className="h-10 w-10 object-contain" 
					  />
					</div>
					<span className="text-lg font-serif font-semibold text-white">Verve Hub Writeups</span>
				  </div>
				  <p className="text-sm text-white leading-relaxed mb-4">
					A modern publishing platform for developers and creators. 
					Sharing knowledge through well-crafted articles and tutorials.
				  </p>
				  <div className="flex items-center gap-2 text-xs">
					<div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
					<span className="text-emerald-400 font-medium">All systems operational</span>
				  </div>
				</div>

				<div>
				  <h4 className="text-sm font-semibold mb-4 text-white">Platform</h4>
				  <ul className="space-y-2">
					<li>
					  <Link to="/me/blog" className="text-sm text-white hover:text-cyan-400 transition-colors">
						All Articles
					  </Link>
					</li>
					<li>
					  <Link to="/me/about" className="text-sm text-white hover:text-cyan-400 transition-colors">
						About Us
					  </Link>
					</li>
					<li>
					  <a href="#" className="text-sm text-white hover:text-cyan-400 transition-colors">
						Categories
					  </a>
					</li>
					<li>
					  <a href="#" className="text-sm text-white hover:text-cyan-400 transition-colors">
						Authors
					  </a>
					</li>
				  </ul>
				</div>

				<div>
				  <h4 className="text-sm font-semibold mb-4 text-white">Resources</h4>
				  <ul className="space-y-2">
					<li>
					  <a
						href="/documentation"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-white hover:text-cyan-400 transition-colors"
					  >
						Documentation
					  </a>
					</li>
					<li>
					  <a
						href="/newsletter"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-white hover:text-cyan-400 transition-colors"
					  >
						Newsletter
					  </a>
					</li>
					<li>
					  <a
						href="/community"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-white hover:text-cyan-400 transition-colors"
					  >
						Community
					  </a>
					</li>
					<li>
					  <a
						href="/support"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-white hover:text-cyan-400 transition-colors"
					  >
						Support
					  </a>
					</li>
				  </ul>
				</div>
			  </div>

			  {/* Footer Bottom */}
			  <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
				<p className="text-xs text-white">
				  &copy; {new Date().getFullYear()} Verve Hub WriteUps. All rights reserved.
				</p>
				<div className="flex items-center gap-4">
				  <a href="#" className="text-xs text-white hover:text-cyan-400 transition-colors">
					Privacy Policy
				  </a>
				  <a href="#" className="text-xs text-white hover:text-cyan-400 transition-colors">
					Terms of Service
				  </a>
				  <a href="#" className="text-xs text-white hover:text-cyan-400 transition-colors">
					Cookie Policy
				  </a>
				</div>
			  </div>
			</div>
		  </div>
		</footer>
      </div>
    </div>
  );
};

export default AdminPage;