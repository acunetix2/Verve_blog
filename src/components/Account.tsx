import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle, Trash2, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface User {
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatar?: string;
}

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const token = localStorage.getItem("token");
  if (!token) navigate("/login");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({ name: res.data.name, email: res.data.email });
        setAvatarPreview(res.data.avatar || null);
      } catch (err) {
        navigate("/login");
      }
    };
    fetchUser();
  }, [token, navigate]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (avatarFile) data.append("avatar", avatarFile);

      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/me`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    setIsLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/me/password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage({ type: "success", text: "Password updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Password change failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      navigate("/signup");
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Account deletion failed" });
    }
  };

  const handleExit = () => {
  if (user) {
    // Revert profile info
    setFormData({ name: user.name, email: user.email });
    // Revert avatar
    setAvatarPreview(user.avatar || null);
    setAvatarFile(null);
    // Revert password fields
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    // Clear any messages
    setMessage(null);
  }

  // Navigate back to /home
  navigate("/home");
};


  if (!user) return <p className="text-cyan-200">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-6 pt-20">
        <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-cyan-900/50 space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleExit}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition"
            >
              <LogOut size={16} /> Exit
            </button>
          </div>

          <h1 className="text-2xl font-bold text-cyan-400 mb-4">My Account</h1>

          {message && (
            <div className={`p-3 mb-4 rounded-lg flex items-center gap-2 text-sm ${message.type === "error" ? "bg-red-900/40 text-red-400" : "bg-green-900/40 text-green-400"}`}>
              {message.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              {message.text}
            </div>
          )}

          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <img src={avatarPreview || "/default-avatar.png"} alt="avatar" className="w-16 h-16 rounded-full object-cover border border-cyan-700" />
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <input name="name" value={formData.name} onChange={handleFormChange} placeholder="Full Name" className="w-full p-3 rounded-lg bg-slate-800/50 border border-cyan-900/50 text-cyan-50" />
            <input name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" className="w-full p-3 rounded-lg bg-slate-800/50 border border-cyan-900/50 text-cyan-50" />
            <button onClick={handleProfileUpdate} disabled={isLoading} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition">{isLoading ? "Saving..." : "Update Profile"}</button>
          </div>

          {/* Password Change */}
          <div className="space-y-3 mt-4">
            <h2 className="text-cyan-300 font-semibold">Change Password</h2>
            <div className="relative">
              <input type={showPassword.current ? "text" : "password"} placeholder="Current Password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full p-3 rounded-lg bg-slate-800/50 border border-cyan-900/50 text-cyan-50 pr-10" />
              <button type="button" onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))} className="absolute inset-y-0 right-3 flex items-center text-cyan-400">{showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <div className="relative">
              <input type={showPassword.new ? "text" : "password"} placeholder="New Password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full p-3 rounded-lg bg-slate-800/50 border border-cyan-900/50 text-cyan-50 pr-10" />
              <button type="button" onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))} className="absolute inset-y-0 right-3 flex items-center text-cyan-400">{showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <div className="relative">
              <input type={showPassword.confirm ? "text" : "password"} placeholder="Confirm New Password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full p-3 rounded-lg bg-slate-800/50 border border-cyan-900/50 text-cyan-50 pr-10" />
              <button type="button" onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))} className="absolute inset-y-0 right-3 flex items-center text-cyan-400">{showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <button onClick={handlePasswordUpdate} disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition">{isLoading ? "Saving..." : "Change Password"}</button>
          </div>

          {/* Account Info */}
          <div className="text-cyan-300 text-sm mt-4">
            <p>Role: {user.role}</p>
            <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>

          <button onClick={handleDeleteAccount} className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
            <Trash2 size={16} /> Delete Account
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
