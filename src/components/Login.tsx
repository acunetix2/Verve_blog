import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, AlertCircle, Shield,BarChart3, CheckCircle,Cpu, Loader2, Sparkles } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { FcGoogle } from "react-icons/fc";

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
  const [processingAuth, setProcessingAuth] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [showSuccessTransition, setShowSuccessTransition] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Handle Google OAuth 
  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        // Detect token in URL
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const role = params.get("role") || "user";
        const error = params.get("error");

        // Check for OAuth errors
        if (error) {
          setLoadingMessage("Authentication failed");
          await new Promise(resolve => setTimeout(resolve, 500));
          setMessage({ 
            type: "error", 
            text: decodeURIComponent(error) || "Google authentication failed. Please try again." 
          });
          setProcessingAuth(false);
          
          // Clean URL
          window.history.replaceState({}, document.title, location.pathname);
          return;
        }

        const existingToken = localStorage.getItem("token");

        // If URL has token then Save to localStorage & Redirect immediately
        if (token) {
          setLoadingMessage("🔐 Authenticating with Google...");
          
          // Save token to localStorage immediately
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          
          console.log("✅ Token saved to localStorage:", { token: token.substring(0, 20) + "...", role });
		  
          window.history.replaceState({}, document.title, location.pathname);

          setLoadingMessage(`✨ Welcome! Redirecting to ${role === "admin" ? "admin panel" : "dashboard"}...`);
          
          // Small delay for smooth UX
          await new Promise(resolve => setTimeout(resolve, 600));
          
          // Immediate redirect - No manual refresh needed
          console.log("✅ Redirecting to:", role === "admin" ? "/admin" : "/me");
          navigate(role === "admin" ? "/admin" : "/me", { replace: true });
          return;
        }

        // 🔹 If already logged in → redirect
        if (existingToken) {
          const savedRole = localStorage.getItem("role") || "user";
          setLoadingMessage(`Already authenticated. Redirecting to ${savedRole === "admin" ? "admin panel" : "dashboard"}...`);
          
          console.log("✅ Existing session found, redirecting...");
          
          // Ensure smooth redirect
          await new Promise(resolve => setTimeout(resolve, 400));
          
          navigate(savedRole === "admin" ? "/admin" : "/me", { replace: true });
          return;
        }

        // ✅ No token found → Show login page
        console.log("ℹ️ No authentication token found, showing login form");
        setProcessingAuth(false);
        
      } catch (error) {
        console.error("❌ Authentication error:", error);
        setMessage({ 
          type: "error", 
          text: "An error occurred during authentication. Please try again." 
        });
        setProcessingAuth(false);
      }
    };

    handleAuthentication();
  }, [location, navigate]);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleLogin = () => {
    setLoadingMessage("Redirecting to Google...");
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
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
        localStorage.setItem("role", formData.isAdmin ? "admin" : res.data.user?.role || "user");

        // Show success message
        setMessage({
          type: "success",
          text: formData.isAdmin
            ? "Welcome back, Admin!"
            : "Login successful!",
        });

        // Show transition screen
        setSuccessMessage(formData.isAdmin ? "Initializing Verve Admin Panel!" : "Welcome back to Verve Hub Blog!");
        setShowSuccessTransition(true);

        // Wait for transition animation
        await new Promise(resolve => setTimeout(resolve, 1800));

        setRedirecting(true);

        // Navigate after transition
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate(formData.isAdmin ? "/admin" : "/me", { replace: true });
      } else {
        setMessage({ type: "error", text: res.data.message || "Login failed" });
      }
    } catch (err: any) {
      const msg =
        formData.isAdmin && err.response?.status === 401
          ? "Unauthorized: Admin access only."
          : err.response?.data?.message || "Incorrect username or password";

      setMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (message && message.type === "error") {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // While processing OAuth token or existing session
  if (processingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950">
        <div className="text-center space-y-6">
          {/* Animated logo/icon */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-red-600 rounded-full" style={{ animationDirection: "normal", animationDuration: "1.5s" }}></div>
            <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin" style={{ animationDirection: "normal", animationDuration: "1.5s" }}></div>
            <div className="absolute inset-2 border-4 border-blue-600 border-b-transparent rounded-full animate-spin" style={{ animationDirection: "normal", animationDuration: "1.5s" }}></div>
          </div>
          
          {/* Loading message */}
          <div className="space-y-2">
            <p className="text-green-400 text-lg font-semibold animate-pulse">
              {loadingMessage}
            </p>
            <p className="text-cyan-300/60 text-sm">
              Please wait a moment...
            </p>
          </div>

          {/* Loading dots animation */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Success Transition Screen
  if (showSuccessTransition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-cyan-400/20 rounded-full animate-float"
              style={{
                width: Math.random() * 60 + 20 + "px",
                height: Math.random() * 60 + 20 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animationDelay: Math.random() * 2 + "s",
                animationDuration: Math.random() * 3 + 3 + "s",
              }}
            />
          ))}
        </div>

        <div className="text-center space-y-8 z-10 animate-scale-in">
          {/* Success Icon with pulse animation */}
          <div className="relative w-28 h-28 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-white rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50">
              <BarChart3 className="text-green-500" size={56} strokeWidth={2.5} />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 animate-gradient">
              {successMessage}
            </h2>
            <p className="text-green-700 text-lg font-medium flex items-center justify-center gap-2">
              <Cpu size={20} className="animate-pulse text-red-700" />
              Taking you to your dashboard
              <Cpu size={20} className="animate-pulse text-red-700" />
            </p>
          </div>

          {/* Animated progress bar */}
          <div className="w-64 mx-auto">
            <div className="h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-full animate-progress shadow-lg shadow-cyan-500/50"></div>
            </div>
          </div>

          {/* Loading spinner */}
          <div className="flex justify-center gap-2 pt-4">
            <Loader2 className="text-cyan-400 animate-spin" size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 pt-20">
      {/*  Navbar */}
      <Navbar />

      {/* BACKGROUND ORBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* AUTH CARD */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div
          className={`w-full max-w-md transform transition-all duration-700 ease-out ${
            formData.isAdmin
              ? "bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-cyan-900/85 scale-[1.02]"
              : "bg-slate-900/85 scale-100"
          } backdrop-blur-xl rounded-3xl shadow-2xl p-8 border ${
            formData.isAdmin ? "border-cyan-500/40 shadow-cyan-500/20" : "border-cyan-900/30"
          }`}
        >
          {/* HEADER */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 mb-2 tracking-tight animate-gradient">
              Verve Hub Blog
            </h1>
            <p
              className={`text-sm transition-all duration-500 ${
                formData.isAdmin ? "text-cyan-300 font-medium" : "text-cyan-200/70"
              }`}
            >
              {formData.isAdmin ? "🔐 Admin Access Panel" : "👋 Welcome back"}
            </p>
          </div>

          {/* ERROR / SUCCESS ALERT  */}
          {message && (
            <div
              className={`p-4 mb-6 rounded-xl flex items-center gap-3 text-sm font-medium transition-all duration-500 transform ${
                message.type === "error"
                  ? "bg-red-900/40 text-red-300 border border-red-700/40 shadow-lg shadow-red-900/20"
                  : "bg-green-900/40 text-green-300 border border-green-700/40 shadow-lg shadow-green-900/20"
              } animate-in slide-in-from-top-2`}
            >
              {message.type === "error" ? (
                <AlertCircle className="flex-shrink-0" size={18} />
              ) : (
                <CheckCircle className="flex-shrink-0" size={18} />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* FORM */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-cyan-100 text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-xl bg-slate-800/60 border-2 ${
                  errors.email ? "border-red-500/60" : "border-cyan-900/40 focus:border-cyan-500/60"
                } text-cyan-50 placeholder-cyan-300/30 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-300`}
              />

              {errors.email && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5 animate-in slide-in-from-left-1">
                  <AlertCircle size={13} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-cyan-100 text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/60 border-2 ${
                    errors.password ? "border-red-500/60" : "border-cyan-900/40 focus:border-cyan-500/60"
                  } text-cyan-50 placeholder-cyan-300/30 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-300 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-cyan-400 hover:text-cyan-300 transition-all duration-200 hover:scale-110"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5 animate-in slide-in-from-left-1">
                  <AlertCircle size={13} /> {errors.password}
                </p>
              )}
            </div>

            {/* Admin toggle */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center text-cyan-200/80 cursor-pointer group">
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4 rounded bg-slate-800/50 border-cyan-900/50 accent-cyan-500 cursor-pointer transition-transform duration-200 group-hover:scale-110"
                />
                <Shield
                  size={16}
                  className="mr-1.5 text-cyan-400 transition-transform duration-200 group-hover:scale-110"
                />
                <span className="font-medium">Login as Admin</span>
              </label>

              <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-all duration-200 font-medium hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || redirecting}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading || redirecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{redirecting ? "Redirecting..." : "Signing in..."}</span>
                </>
              ) : (
                <>
                  <LogIn size={19} />
                  <span>{formData.isAdmin ? "Sign in as Admin" : "Sign In"}</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-cyan-800/40"></div>
              <span className="mx-4 text-cyan-300/50 text-xs font-medium">OR</span>
              <div className="flex-grow border-t border-cyan-800/40"></div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-slate-800/60 border-2 border-cyan-700/40 hover:bg-slate-800/80 hover:border-cyan-600/60 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <FcGoogle size={22} />
              <span>Continue with Google</span>
            </button>

            {/* Sign up */}
            <p className="text-sm text-cyan-200/70 text-center mt-6">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-cyan-400 hover:text-cyan-300 transition-all duration-200 font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes slide-in-from-top-2 {
          from { transform: translateY(-0.5rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slide-in-from-left-1 {
          from { transform: translateX(-0.25rem); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes fade-in-up {
          from { transform: translateY(1rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-30px) translateX(20px); opacity: 0.6; }
        }

        .animate-in { animation-duration: 0.3s; animation-fill-mode: both; }
        .slide-in-from-top-2 { animation-name: slide-in-from-top-2; }
        .slide-in-from-left-1 { animation-name: slide-in-from-left-1; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out 0.2s both; }
        .animate-progress { animation: progress 1.8s ease-out; }
        .animate-float { animation: float linear infinite; }
      `}</style>
    </div>
  );
}