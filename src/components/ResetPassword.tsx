import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.trim().length < 8) {
      return setStatus({ message: "Password must be at least 8 characters.", type: "error" });
    }

    if (password !== confirm) {
      return setStatus({ message: "Passwords do not match.", type: "error" });
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setStatus({ message: data.message || "Failed to reset password.", type: "error" });
      }

      setStatus({ message: "Password updated successfully! Redirecting...", type: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setStatus({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded">
        <p className="text-red-500">Invalid or missing reset token/email.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate("/login")}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to login</span>
        </button>

        {/* Main card */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-black/50 p-8 md:p-10 space-y-6 border border-slate-700">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Reset Password</h1>
            <p className="text-slate-400 leading-relaxed">
              Enter your new password below to reset your account password.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5 pt-2">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-4 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full pl-4 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Reset Password"
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
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
