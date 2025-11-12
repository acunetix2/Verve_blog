import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, AlertCircle, Shield, CheckCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const endpoint = formData.isAdmin
        ? `${import.meta.env.VITE_API_BASE_URL}/auth/login`
        : `${import.meta.env.VITE_API_BASE_URL}/users/login`;

      const res = await axios.post(endpoint, {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", formData.isAdmin ? "admin" : "user");

        setMessage({
          type: "success",
          text: formData.isAdmin
            ? "Welcome back, Admin! Redirecting..."
            : "Login successful! Redirecting...",
        });

        setRedirecting(true);
        setTimeout(() => navigate(formData.isAdmin ? "/admin" : "/home"), 2000);
      } else {
        setMessage({ type: "error", text: res.data.message || "Login failed" });
      }
    } catch (err: any) {
      const msg =
        formData.isAdmin && err.response?.status === 401
          ? "Unauthorized: Admin access only."
          : err.response?.data?.message || "Invalid credentials or server error.";
      setMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-dismiss messages after 3s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 pt-20">
	  <Navbar />
	  {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className={`w-full max-w-md ${formData.isAdmin ? "bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-cyan-900/80" : "bg-slate-900/80"} backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-cyan-900/50 transition-all`}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 tracking-tight">
              Verve Hub
            </h1>
            <p className="text-cyan-200/70">{formData.isAdmin ? "Admin Access 🔐" : "Welcome back 👋"}</p>
          </div>

          {message && (
            <div className={`p-3 mb-4 rounded-lg flex items-center gap-2 text-sm transition-opacity duration-500 ${message.type === "error" ? "bg-red-900/40 text-red-400 border border-red-700/30" : "bg-green-900/40 text-green-400 border border-green-700/30"}`}>
              {message.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              {message.text}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-cyan-100 text-sm mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full p-3 rounded-lg bg-slate-800/50 border ${errors.email ? "border-red-500" : "border-cyan-900/50"} text-cyan-50 placeholder-cyan-300/30 focus:ring-2 focus:ring-cyan-500 outline-none transition`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-cyan-100 text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  className={`w-full p-3 rounded-lg bg-slate-800/50 border ${errors.password ? "border-red-500" : "border-cyan-900/50"} text-cyan-50 placeholder-cyan-300/30 focus:ring-2 focus:ring-cyan-500 outline-none transition pr-10`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-cyan-400 hover:text-cyan-300 transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.password}</p>}
            </div>

            {/* Admin toggle */}
            <div className="flex items-center justify-between text-sm mt-2">
              <label className="flex items-center text-cyan-200/70 cursor-pointer">
                <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} className="mr-2 rounded bg-slate-800/50 border-cyan-900/50 accent-cyan-500" />
                <Shield size={15} className="mr-1 text-cyan-400" /> Login as Admin
              </label>
              <button type="button" className="text-cyan-400 hover:text-cyan-300 transition">Forgot password?</button>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading || redirecting} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/30">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...
                </>
              ) : redirecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Redirecting...
                </>
              ) : (
                <>
                  <LogIn size={18} /> {formData.isAdmin ? "Sign in as Admin" : "Sign In"}
                </>
              )}
            </button>

            <p className="text-sm text-cyan-200/70 text-center mt-6">
              Don't have an account?{" "}
              <button type="button" onClick={() => navigate("/signup")} className="text-cyan-400 hover:text-cyan-300 transition font-medium">
                Signup
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
