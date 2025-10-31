import React, { useEffect, useState } from "react";
import axios from "axios";
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
  UserPlus,
} from "lucide-react";
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
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [form, setForm] = useState<Post>({ title: "", content: "" });
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "", role: "admin" });
  const [terminalText, setTerminalText] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

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
          toast.error("Session expired. Please log in again.");
        }
      } catch {
        localStorage.removeItem("token");
        setShowLogin(true);
        toast.error("Authentication failed. Please log in again.");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  // Terminal animation
  useEffect(() => {
    if (showLogin || showSignup) {
      const text = showSignup
        ? "ESTABLISHING NEW ADMIN REGISTRATION CHANNEL..."
        : "ESTABLISHING SECURE ADMIN LINK...";
      let i = 0;
      setTerminalText("");
      const interval = setInterval(() => {
        if (i < text.length) {
          setTerminalText((prev) => prev + text[i]);
          i++;
        } else clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }
  }, [showLogin, showSignup]);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch {
      toast.error("Failed to load posts.");
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
      toast.success("Welcome back, Admin 👑");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Signup handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/signup", signupData);
      toast.success("Admin account created successfully!");
      setShowSignup(false);
      setShowLogin(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Create / Update post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return toast.warning("All fields required.");
    try {
      if (form._id) {
        await axios.put(`http://localhost:5000/api/posts/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Entry updated 📝");
      } else {
        await axios.post("http://localhost:5000/api/posts", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("New entry published 🚀");
      }
      setForm({ title: "", content: "" });
      fetchPosts();
    } catch {
      toast.error("Failed to save entry.");
    }
  };

  // Delete post
  const handleDelete = async (id: string) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Entry deleted 🗑️");
      fetchPosts();
    } catch {
      toast.error("Failed to delete entry.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-green-400 font-mono text-xl animate-pulse">
          &gt; INITIALIZING_ADMIN_CONSOLE_
        </div>
      </div>
    );

  // LOGIN / SIGNUP UI
  if (showLogin || showSignup) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-green-500 font-mono text-[10px] leading-tight select-none">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i}>01101110 01100101 01110100 01110111 01101111 01110010 01101011</div>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-md px-4">
          <div className="bg-gray-900 border border-green-500 rounded-t-lg p-3 flex items-center gap-2">
            <Terminal className="text-green-400" size={20} />
            <span className="text-green-400 font-mono text-sm">
              root@verve-console
            </span>
          </div>

          <div className="bg-black border-x border-b border-green-500 rounded-b-lg p-6 shadow-2xl shadow-green-500/40">
            <div className="text-green-400 font-mono text-sm mb-6">
              &gt; {terminalText}
              <span className="animate-pulse">_</span>
              <div className="text-green-300 mt-3">
                {showSignup ? "CREATE NEW ADMIN ACCOUNT" : "ACCESS AUTHORIZATION REQUIRED"}
              </div>
            </div>

            <form onSubmit={showSignup ? handleSignup : handleLogin} className="space-y-4">
              <div className="flex items-center gap-2 text-green-400 font-mono text-lg mb-2">
                {showSignup ? <UserPlus size={20} /> : <Lock size={20} />}
                <span>{showSignup ? "ADMIN SIGNUP" : "ADMIN LOGIN"}</span>
              </div>

              {showSignup ? (
                <>
                  <input
                    type="email"
                    placeholder="Email"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    className="bg-gray-900 border border-green-500 text-green-400 font-mono p-3 w-full rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    className="bg-gray-900 border border-green-500 text-green-400 font-mono p-3 w-full rounded"
                    required
                  />
                </>
              ) : (
                <>
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                    placeholder="admin@verve.sec"
                    className="bg-gray-900 border border-green-500 text-green-400 font-mono p-3 w-full rounded"
                    required
                  />
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({ ...credentials, password: e.target.value })
                    }
                    placeholder="********"
                    className="bg-gray-900 border border-green-500 text-green-400 font-mono p-3 w-full rounded"
                    required
                  />
                </>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="bg-green-600 hover:bg-green-500 text-black font-mono font-bold px-6 py-3 rounded w-full transition-all flex items-center justify-center"
              >
                {authLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    PROCESSING...
                  </>
                ) : showSignup ? (
                  <>&gt; REGISTER</>
                ) : (
                  <>&gt; AUTHENTICATE</>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowSignup(!showSignup)}
                className="bg-gray-700 hover:bg-gray-600 text-green-300 font-mono px-6 py-3 rounded w-full mt-3 transition-all hover:scale-105"
              >
                {showSignup ? "← BACK TO LOGIN" : "CREATE NEW ACCOUNT"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-gray-800 hover:bg-gray-700 text-green-300 font-mono px-6 py-3 rounded w-full mt-3 transition-all"
              >
                <DoorOpen className="inline mr-2" size={16} /> EXIT TO HOME
              </button>

              <p className="text-center text-green-400 text-xs opacity-70 mt-4">
                [CONNECTION SECURE — AES256]
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      <header className="border border-green-500 rounded-lg p-4 mb-6 bg-gray-900 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="text-green-400" size={28} />
          <div>
            <h1 className="text-2xl font-bold">&gt; ADMIN_CONSOLE</h1>
            <p className="text-xs text-green-300">Access Level: ROOT | Status: ACTIVE</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-700 hover:bg-gray-600 text-green-300 px-4 py-2 rounded flex items-center gap-2 transition-all"
          >
            <DoorOpen size={16} /> EXIT
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
              setIsLoggedIn(false);
              setShowLogin(true);
              toast.info("You have been logged out.");
            }}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 transition-all"
          >
            <LogOut size={16} /> DISCONNECT
          </button>
        </div>
      </header>

      <div className="border border-green-500 rounded-lg p-6 mb-6 bg-gray-900">
        <h2 className="text-lg mb-4 flex items-center gap-2 text-green-300">
          <Plus size={18} />
          {form._id ? "EDIT_ENTRY" : "NEW_ENTRY"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Entry title..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="bg-black border border-green-500 text-green-400 p-3 w-full rounded"
            required
          />
          <textarea
            placeholder="Entry content..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="bg-black border border-green-500 text-green-400 p-3 w-full h-40 rounded resize-none"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-3 rounded transition-all"
          >
            {form._id ? "UPDATE_ENTRY" : "PUBLISH_ENTRY"}
          </button>
        </form>
      </div>

      <section>
        <h2 className="text-xl mb-4 border-b border-green-500 pb-2">
          &gt; STORED_ENTRIES [{posts.length}]
        </h2>
        {posts.length === 0 ? (
          <div className="text-center text-green-300 py-8 border border-green-500 rounded-lg bg-gray-900">
            [NO ENTRIES FOUND]
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="border border-green-500 rounded-lg p-4 bg-gray-900 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-300 mb-2">
                      &gt; {post.title}
                    </h3>
                    <p className="text-sm text-green-400 mb-3 whitespace-pre-wrap">
                      {post.content}
                    </p>
                    <div className="text-xs text-green-500 opacity-60">
                      [TIMESTAMP: {new Date(post.createdAt || "").toLocaleString()}]
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setForm(post)}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-2 rounded flex items-center gap-1"
                    >
                      <Edit size={14} /> EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(post._id!)}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded flex items-center gap-1"
                    >
                      <Trash2 size={14} /> DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPage;
