import React, { useState, useEffect } from "react";
import { Eye, EyeOff, UserPlus, AlertCircle, Check } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { VerveHubLogo } from "./VerveHubLogo";

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
    if (strength <= 2) return "bg-yellow-500";
    if (strength <= 3) return "bg-blue-400";
    return "bg-green-500";
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500" style={{ fontFamily: "'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
	  {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md bg-white backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-blue-100">
          <div className="flex flex-col items-center mb-4 space-y-2">
			  {/* Logo */}
			  <div className="w-10 h-10 flex items-center justify-center">
				<VerveHubLogo size="lg" />
			  </div>

			  {/* Text */}
			  <div className="text-center space-y-1">
				<h1 className="text-2xl font-bold text-blue-600 mb-1 tracking-tight">
				  Join Verve Hub Academy
				</h1>
				<p className="text-gray-600 text-xs">
				  Create your free account 🚀
				</p>
			  </div>
			</div>
          {message && (
            <div className={`p-2 mb-3 rounded-lg flex items-center gap-2 text-xs transition-opacity duration-500 ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
              {message.type === "error" ? <AlertCircle size={14} /> : <Check size={14} />}
              {message.text}
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-gray-700 text-xs mb-1 font-medium">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border-2 ${errors.fullName ? "border-red-300" : "border-gray-200 focus:border-blue-500"} text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 outline-none transition`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} /> {errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-xs mb-1 font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={`w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border-2 ${errors.email ? "border-red-300" : "border-gray-200 focus:border-blue-500"} text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 outline-none transition`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} /> {errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700 text-xs mb-1 font-medium">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border-2 ${errors.password ? "border-red-300" : "border-gray-200 focus:border-blue-500"} text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 outline-none transition pr-10`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-2 flex items-center text-blue-600 hover:text-blue-700 transition">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-1">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded ${i < passwordStrength ? getStrengthColor(passwordStrength) : "bg-gray-200"} transition-all`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Password strength: <span className={passwordStrength >= 4 ? "text-green-600" : passwordStrength >= 3 ? "text-blue-600" : "text-yellow-600"}>{getStrengthLabel(passwordStrength)}</span>
                  </p>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} /> {errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 text-xs mb-1 font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border-2 ${errors.confirmPassword ? "border-red-300" : "border-gray-200 focus:border-blue-500"} text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 outline-none transition pr-10`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-2 flex items-center text-blue-600 hover:text-blue-700 transition">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-green-600 text-xs mt-1 flex items-center gap-1"><Check size={11} /> Passwords match</p>
              )}
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} /> {errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start text-gray-600 cursor-pointer text-xs">
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="mt-1 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span>
                  I agree to the{" "}
                  <button type="button" className="text-blue-600 hover:text-blue-700 transition font-medium">Terms of Service</button>{" "}
                  and{" "}
                  <button type="button" className="text-blue-600 hover:text-blue-700 transition font-medium">Privacy Policy</button>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} /> {errors.agreeToTerms}</p>}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading || redirecting} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : redirecting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} /> Sign Up
                </>
              )}
            </button>

            <p className="text-xs text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <button type="button" onClick={() => navigate("/login")} className="text-blue-600 hover:text-blue-700 transition font-semibold hover:underline">
                Log in
              </button>
            </p>
			<p className="text-[10px] text-gray-400 mt-6 text-center select-none">
			  &copy; {new Date().getFullYear()} Verve Hub Academy. All rights reserved.
			</p>
          </form>
        </div>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Product+Sans:wght@400;500;700&display=swap');
      `}</style>
    </div>
  );
}