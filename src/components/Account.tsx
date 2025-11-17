import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { X, Eye, EyeOff, AlertCircle, CheckCircle, Trash2, LogOut, User, Mail, Lock, Camera, Shield, Clock } from "lucide-react";

interface User {
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatar?: string;
}

type TabType = 'profile' | 'security' | 'danger';

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
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
    setIsDirty(true);
    setMessage(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size must be less than 5MB" });
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setIsDirty(true);
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (avatarFile) data.append("avatar", avatarFile);

      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/me`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      setIsDirty(false);
      setAvatarFile(null);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: "error", text: "All password fields are required" });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters" });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/me/password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage({ type: "success", text: "Password updated successfully!" });
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Password change failed. Please check your current password." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "⚠️ WARNING: This action cannot be undone.\n\nAre you absolutely sure you want to permanently delete your account?\n\nAll your data will be lost forever."
    );
    if (!confirmed) return;

    const doubleCheck = window.confirm(
      "This is your final warning.\n\nType your confirmation by clicking OK to proceed with account deletion."
    );
    if (!doubleCheck) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      navigate("/signup");
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Account deletion failed. Please contact support." });
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
      setAvatarPreview(user.avatar || null);
      setAvatarFile(null);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsDirty(false);
      setMessage(null);
    }
  };

  const handleExit = () => {
    if (isDirty) {
      const confirm = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirm) return;
    }
    navigate("/me");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-200">Loading your account...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'security' as TabType, label: 'Security', icon: Lock },
    { id: 'danger' as TabType, label: 'Danger Zone', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      
      <div className="flex-grow container mx-auto px-4 py-8 pt-24 max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-slate-400">Manage your profile, security, and preferences</p>
          </div>
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
            aria-label="Exit to home"
          >
            <X size={18} />
          </button>
        </div>

        {/* Global Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === "error" 
              ? "bg-red-500/10 border border-red-500/30 text-red-400" 
              : "bg-green-500/10 border border-green-500/30 text-green-400"
          }`}>
            {message.type === "error" ? <AlertCircle size={20} className="flex-shrink-0 mt-0.5" /> : <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />}
            <p>{message.text}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-2 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Account Info Card */}
            <div className="mt-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-4">
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Shield size={14} />
                  <span>Role: <span className="text-cyan-400 font-medium">{user.role}</span></span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} />
                  <span>Since: {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6 sm:p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
                    <p className="text-slate-400 text-sm mb-6">Update your personal details and profile picture</p>
                  </div>

                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
                    <div className="relative group">
                      <img 
                        src={avatarPreview || "/default-avatar.png"} 
                        alt="Profile avatar" 
                        className="w-24 h-24 rounded-full object-cover border-2 border-slate-700 group-hover:border-cyan-500 transition-colors"
                      />
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Camera size={24} className="text-white" />
                      </label>
                      <input 
                        id="avatar-upload"
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange}
                        className="hidden"
                        aria-label="Upload profile picture"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Profile Picture</h3>
                      <p className="text-slate-400 text-sm mb-2">JPG, PNG or GIF. Max 5MB.</p>
                      <label 
                        htmlFor="avatar-upload" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg cursor-pointer transition-colors"
                      >
                        <Camera size={16} />
                        Change Photo
                      </label>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          id="name"
                          name="name" 
                          type="text"
                          value={formData.name} 
                          onChange={handleFormChange} 
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          id="email"
                          name="email" 
                          type="email"
                          value={formData.email} 
                          onChange={handleFormChange} 
                          placeholder="your.email@example.com"
                          className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    <button 
                      onClick={handleProfileUpdate} 
                      disabled={isLoading || !isDirty}
                      className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    {isDirty && (
                      <button 
                        onClick={handleCancel}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Password & Security</h2>
                    <p className="text-slate-400 text-sm mb-6">Manage your password and security settings</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-slate-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          id="current-password"
                          type={showPassword.current ? "text" : "password"} 
                          name="currentPassword" 
                          value={passwordData.currentPassword} 
                          onChange={handlePasswordChange}
                          placeholder="Enter current password"
                          className="w-full pl-10 pr-12 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                          aria-label={showPassword.current ? "Hide password" : "Show password"}
                        >
                          {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-slate-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          id="new-password"
                          type={showPassword.new ? "text" : "password"} 
                          name="newPassword" 
                          value={passwordData.newPassword} 
                          onChange={handlePasswordChange}
                          placeholder="Enter new password (min. 8 characters)"
                          className="w-full pl-10 pr-12 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                          aria-label={showPassword.new ? "Hide password" : "Show password"}
                        >
                          {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          id="confirm-password"
                          type={showPassword.confirm ? "text" : "password"} 
                          name="confirmPassword" 
                          value={passwordData.confirmPassword} 
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                          className="w-full pl-10 pr-12 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                          aria-label={showPassword.confirm ? "Hide password" : "Show password"}
                        >
                          {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Password Requirements:</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Mix of letters, numbers recommended</li>
                      <li>• Avoid common passwords</li>
                    </ul>
                  </div>

                  <button 
                    onClick={handlePasswordUpdate} 
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === 'danger' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
                    <p className="text-slate-400 text-sm mb-6">Irreversible actions that affect your account</p>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Trash2 size={20} className="text-red-400" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-white font-semibold mb-2">Delete Account</h3>
                        <p className="text-slate-400 text-sm mb-4">
                          Once you delete your account, there is no going back. This action is permanent and will:
                        </p>
                        <ul className="text-slate-400 text-sm space-y-1 mb-6">
                          <li>• Delete all your personal data</li>
                          <li>• Remove all your content and history</li>
                          <li>• Revoke access to all services</li>
                          <li>• Cannot be undone or recovered</li>
                        </ul>
                        <button 
                          onClick={handleDeleteAccount}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={18} />
                          Delete My Account
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-300 text-sm">
                        <strong>Warning:</strong> Account deletion is permanent and cannot be reversed. 
                        Make sure you have backed up any important data before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}