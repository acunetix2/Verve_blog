import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { VerveHubLogo } from "./VerveHubLogo";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setStatus({
        message: data.message || "Something went wrong.",
        type: res.ok ? "success" : "error",
      });
    } catch {
      setStatus({ message: "Something went wrong.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center px-4 py-12"
      style={{ fontFamily: "'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md transform transition-all duration-700 ease-out bg-white backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-100 space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4 space-y-2">
          <Link to="/">
            <VerveHubLogo size="lg" />
          </Link>
          <h1 className="text-2xl font-bold text-blue-900">Forgot Password?</h1>
          <p className="text-xs text-blue-700 text-center">
            No worries! Enter your email and we'll send a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2 relative">
            <label htmlFor="email" className="block text-xs font-medium text-blue-900/80">
              Email Address
            </label>
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-900/50" />
            <input
              id="email"
              type="email"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-blue-200 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
            />
          </div>

          {status && (
            <div
              className={`flex items-start gap-2 p-3 rounded-xl text-xs font-medium ${
                status.type === "success"
                  ? "bg-green-100 border border-green-300 text-green-800"
                  : "bg-red-100 border border-red-300 text-red-800"
              }`}
            >
              {status.type === "success" ? <CheckCircle className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
              <span>{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Back to login */}
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="text-xs text-blue-700 hover:text-blue-900 font-medium transition-colors hover:underline flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Back to login
          </button>
        </div>

        {/* COPYRIGHT */}
        <p className="text-[10px] text-slate-700 mt-4 text-center select-none">
          &copy; {new Date().getFullYear()} Verve Hub WriteUps. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
