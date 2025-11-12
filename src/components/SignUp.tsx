import React, { useState, useEffect } from "react";
import { Eye, EyeOff, UserPlus, AlertCircle, Check } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-cyan-500";
    if (strength <= 3) return "bg-cyan-400";
    return "bg-emerald-500";
  };

  const getStrengthLabel = (strength: number) => {
    if (strength <= 1) return "Weak";
    if (strength <= 2) return "Fair";
    if (strength <= 3) return "Good";
    return "Strong";
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    else if (formData.fullName.trim().length < 2) newErrors.fullName = "Name must be at least 2 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));

    if (name === "password") setPasswordStrength(calculatePasswordStrength(value));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/signup`, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      setMessage({ type: "success", text: response.data.message || "Account created successfully!" });
      setRedirecting(true);

      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Signup failed. Try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-dismiss messages after 3s
  useEffect(() => {
    if (message && message.type === "error") {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 pt-20">
	  <Navbar />
	  {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-cyan-900/50">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 tracking-tight">
              Join Verve Hub
            </h1>
            <p className="text-cyan-200/70">Create your free account 🚀</p>
          </div>

          {message && (
            <div className={`p-3 mb-4 rounded-lg flex items-center gap-2 text-sm transition-opacity duration-500 ${message.type === "error" ? "bg-red-900/40 text-red-400 border border-red-700/30" : "bg-green-900/40 text-green-400 border border-green-700/30"}`}>
              {message.type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
              {message.text}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-cyan-100 text-sm mb-2">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full p-3 rounded-lg bg-slate-800/50 border ${errors.fullName ? "border-red-500" : "border-cyan-900/50"} text-cyan-50 placeholder-cyan-300/30 focus:ring-2 focus:ring-cyan-500 outline-none transition`}
              />
              {errors.fullName && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-cyan-100 text-sm mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Valid email"
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
                  placeholder="••••••••"
                  className={`w-full p-3 rounded-lg bg-slate-800/50 border ${errors.password ? "border-red-500" : "border-cyan-900/50"} text-cyan-50 placeholder-cyan-300/30 focus:ring-2 focus:ring-cyan-500 outline-none transition pr-10`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-cyan-400 hover:text-cyan-300 transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded ${i < passwordStrength ? getStrengthColor(passwordStrength) : "bg-slate-700"} transition-all`} />
                    ))}
                  </div>
                  <p className="text-xs text-cyan-200/70">
                    Password strength: <span className={passwordStrength >= 4 ? "text-emerald-400" : passwordStrength >= 3 ? "text-cyan-400" : "text-cyan-500"}>{getStrengthLabel(passwordStrength)}</span>
                  </p>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-cyan-100 text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full p-3 rounded-lg bg-slate-800/50 border ${errors.confirmPassword ? "border-red-500" : "border-cyan-900/50"} text-cyan-50 placeholder-cyan-300/30 focus:ring-2 focus:ring-cyan-500 outline-none transition pr-10`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center text-cyan-400 hover:text-cyan-300 transition">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1"><Check size={12} /> Passwords match</p>
              )}
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start text-cyan-200/70 cursor-pointer text-sm">
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="mt-1 mr-2 rounded bg-slate-800/50 border-cyan-900/50" />
                <span>
                  I agree to the{" "}
                  <button type="button" className="text-cyan-400 hover:text-cyan-300 transition">Terms of Service</button>{" "}
                  and{" "}
                  <button type="button" className="text-cyan-400 hover:text-cyan-300 transition">Privacy Policy</button>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.agreeToTerms}</p>}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading || redirecting} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-cyan-500/50 disabled:to-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/30">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : redirecting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} /> Sign Up
                </>
              )}
            </button>

            <p className="text-sm text-cyan-200/70 text-center mt-6">
              Already have an account?{" "}
              <button type="button" onClick={() => navigate("/login")} className="text-cyan-400 hover:text-cyan-300 transition font-medium">
                Log in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
