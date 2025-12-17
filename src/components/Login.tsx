/**
 * Author / Copyright: Iddy
 * All rights reserved.
 */
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle, Cpu, Loader2, BarChart3 } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import CompanyLogo from "@/assets/logo.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const endpoint = `${import.meta.env.VITE_API_BASE_URL}/users/login`;

      const res = await axios.post(endpoint, {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.token) {
        // Use the role from backend response
        const userRole = res.data.user?.role || "user";
        
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", userRole);

        // Show success message
        setMessage({
          type: "success",
          text: "Login successful!",
        });

        // Show transition screen
        setSuccessMessage(userRole === "admin" ? "Initializing Verve Admin Panel!" : "Welcome back to Verve Hub WriteUps!");
        setShowSuccessTransition(true);

        // Wait for transition animation
        await new Promise(resolve => setTimeout(resolve, 1800));

        setRedirecting(true);

        // Navigate based on backend role
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate(userRole === "admin" ? "/admin" : "/me", { replace: true });
      } else {
        setMessage({ type: "error", text: res.data.message || "Login failed" });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Incorrect username or password";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500" style={{ fontFamily: "'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <div className="text-center space-y-6">
          {/* Animated logo/icon */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-white rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-blue-200 border-t-transparent rounded-full animate-spin" style={{ animationDuration: "1.5s" }}></div>
            <div className="absolute inset-2 border-4 border-white border-b-transparent rounded-full animate-spin" style={{ animationDuration: "1s" }}></div>
          </div>
          
          {/* Loading message */}
          <div className="space-y-2">
            <p className="text-white text-xs font-medium animate-pulse">
              {loadingMessage}
            </p>
            <p className="text-blue-100 text-xs">
              Please wait a moment...
            </p>
          </div>

          {/* Loading dots animation */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Success Transition Screen
  if (showSuccessTransition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 relative overflow-hidden" style={{ fontFamily: "'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/10 rounded-full animate-float"
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
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-900/50">
              <BarChart3 className="text-blue-600" size={56} strokeWidth={2.5} />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white">
              {successMessage}
            </h2>
            <p className="text-blue-100 text-base font-medium flex items-center justify-center gap-2">
              <Eye size={16} className="animate-pulse" />
              Taking you to your dashboard
              <Eye size={16} className="animate-pulse" />
            </p>
          </div>

          {/* Animated progress bar */}
          <div className="w-64 mx-auto">
            <div className="h-1.5 bg-blue-800/60 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full animate-progress shadow-lg shadow-white/50"></div>
            </div>
          </div>

          {/* Loading spinner */}
          <div className="flex justify-center gap-2 pt-4">
            <Loader2 className="text-white animate-spin" size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500" style={{ fontFamily: "'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* BACKGROUND ORBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* AUTH CARD */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md transform transition-all duration-700 ease-out bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-blue-100">
          {/* HEADER */}
			<div className="flex flex-col items-center mb-6 space-y-2">
			  {/* Logo */}
			  <Link to="/">
				<div className="flex items-center justify-center cursor-pointer">
				  <img 
					src={CompanyLogo} 
					alt="Company Logo" 
					className="h-10 w-10 object-contain" 
				  />
				</div>
			  </Link>

			  {/* Text */}
			  <div className="text-center space-y-1">
				<h1 className="text-2xl font-bold text-blue-600 mb-1 tracking-tight">
				  Verve Hub WriteUps
				</h1>
				<p className="text-xs text-gray-600">
				  👋 Welcome back
				</p>
			  </div>
			</div>

          {/* ERROR / SUCCESS ALERT  */}
          {message && (
            <div
              className={`p-3 mb-4 rounded-xl flex items-center gap-2 text-xs font-medium transition-all duration-500 transform ${
                message.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-200 shadow-lg"
                  : "bg-green-50 text-green-700 border border-green-200 shadow-lg"
              } animate-in slide-in-from-top-2`}
            >
              {message.type === "error" ? (
                <AlertCircle className="flex-shrink-0" size={14} />
              ) : (
                <CheckCircle className="flex-shrink-0" size={14} />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-gray-700 text-xs font-medium">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-3 py-2 text-sm rounded-xl bg-gray-50 border-2 ${
                  errors.email ? "border-red-300" : "border-gray-200 focus:border-blue-500"
                } text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300`}
              />

              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-left-1">
                  <AlertCircle size={11} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-gray-700 text-xs font-medium">
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
                  className={`w-full px-3 py-2 text-sm rounded-xl bg-gray-50 border-2 ${
                    errors.password ? "border-red-300" : "border-gray-200 focus:border-blue-500"
                  } text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-blue-600 hover:text-blue-700 transition-all duration-200 hover:scale-110"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-left-1">
                  <AlertCircle size={11} /> {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end text-xs pt-1">
			  <Link
				to="/forgot-password"
				className="text-blue-600 hover:text-blue-700 transition-all duration-200 font-medium hover:underline"
			  >
				Forgot password?
			  </Link>
			</div>
            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || redirecting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading || redirecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{redirecting ? "Redirecting..." : "Signing in..."}</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-3 text-gray-400 text-xs font-medium">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-blue-300 text-gray-700 text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <FcGoogle size={18} />
              <span>Continue with Google</span>
            </button>

            {/* Sign up */}
            <p className="text-xs text-gray-600 text-center mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:text-blue-700 transition-all duration-200 font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
			<p className="text-[10px] text-gray-400 mt-6 text-center select-none">
			  &copy; {new Date().getFullYear()} Verve Hub WriteUps. All rights reserved.
			</p>
          </form>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Product+Sans:wght@400;500;700&display=swap');
        
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