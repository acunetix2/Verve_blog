import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to login</span>
        </button>

        {/* Main card */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-black/50 p-8 md:p-10 space-y-6 border border-slate-700">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Mail className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Forgot Password?</h1>
            <p className="text-slate-400 leading-relaxed">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>

          {/* Status message */}
          {status && (
            <div
              className={`flex items-start gap-3 p-4 rounded-xl ${
                status.type === "success"
                  ? "bg-green-900/30 border border-green-700/50"
                  : "bg-red-900/30 border border-red-700/50"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm font-medium ${
                  status.type === "success" ? "text-green-300" : "text-red-300"
                }`}
              >
                {status.message}
              </p>
            </div>
          )}
        </div>

        {/* Footer text */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Remember your password?{" "}
          <button
            onClick={() => window.history.back()}
            className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;