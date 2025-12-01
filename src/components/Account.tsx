import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { X, Eye, EyeOff, AlertCircle, CheckCircle, Trash2, User, Mail, Lock, Camera, Shield, Clock, ArrowLeft } from "lucide-react";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

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
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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
    const token = localStorage.getItem("token");
    if (!token) return;

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
      const timeoutId = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timeoutId);
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

    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    setMessage(null);
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/me/password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage({ type: "success", text: "Password updated successfully!" });
      const timeoutId = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timeoutId);
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

    const token = localStorage.getItem("token");
    if (!token) return;

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-serif text-lg">Loading your account...</p>
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleExit}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-serif text-lg">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-3 tracking-tight">Settings</h1>
          <p className="text-xl text-gray-600 font-serif">Manage your account preferences and security</p>
        </div>

        {/* Global Message */}
        {message && (
          <div className={`mb-8 p-5 rounded-lg flex items-start gap-3 border ${
            message.type === "error" 
              ? "bg-red-50 border-red-200 text-red-800" 
              : "bg-green-50 border-green-200 text-green-800"
          }`}>
            {message.type === "error" ? 
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" /> : 
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            }
            <p className="font-sans text-sm leading-relaxed">{message.text}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <nav className="mb-10 border-b border-gray-200">
          <div className="flex gap-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 border-b-2 transition-all font-serif text-lg ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content Area */}
        <div className="max-w-2xl">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-10">
              <div>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Profile</h2>
                <p className="text-gray-600 font-sans text-base leading-relaxed">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>

              {/* Avatar Section */}
              <div className="pb-10 border-b border-gray-200">
                <label className="block font-serif text-sm font-semibold text-gray-900 mb-4">
                  Photo
                </label>
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <img 
                      src={avatarPreview || "/default-avatar.png"} 
                      alt="Profile avatar" 
                      className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-gray-400 transition-all"
                    />
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                    <label 
                      htmlFor="avatar-upload" 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-sans text-sm rounded-lg cursor-pointer transition-colors"
                    >
                      <Camera size={16} />
                      Change
                    </label>
                    <p className="text-gray-500 font-sans text-sm mt-2">JPG, PNG or GIF. Max 5MB.</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-8">
                <div>
                  <label htmlFor="name" className="block font-serif text-sm font-semibold text-gray-900 mb-3">
                    Full Name
                  </label>
                  <input 
                    id="name"
                    name="name" 
                    type="text"
                    value={formData.name} 
                    onChange={handleFormChange} 
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-serif text-sm font-semibold text-gray-900 mb-3">
                    Email Address
                  </label>
                  <input 
                    id="email"
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleFormChange} 
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-sans"
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-sans">
                    <Shield size={16} />
                    <span>Role: <strong className="text-gray-900">{user.role}</strong></span>
                    <span className="mx-2">•</span>
                    <Clock size={16} />
                    <span>Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleProfileUpdate} 
                  disabled={isLoading || !isDirty}
                  className="px-6 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white font-sans font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                {isDirty && (
                  <button 
                    onClick={handleCancel}
                    className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-sans font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-10">
              <div>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Security</h2>
                <p className="text-gray-600 font-sans text-base leading-relaxed">
                  Update your password to keep your account secure.
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <label htmlFor="current-password" className="block font-serif text-sm font-semibold text-gray-900 mb-3">
                    Current Password
                  </label>
                  <div className="relative">
                    <input 
                      id="current-password"
                      type={showPassword.current ? "text" : "password"} 
                      name="currentPassword" 
                      value={passwordData.currentPassword} 
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-sans"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword.current ? "Hide password" : "Show password"}
                    >
                      {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="block font-serif text-sm font-semibold text-gray-900 mb-3">
                    New Password
                  </label>
                  <div className="relative">
                    <input 
                      id="new-password"
                      type={showPassword.new ? "text" : "password"} 
                      name="newPassword" 
                      value={passwordData.newPassword} 
                      onChange={handlePasswordChange}
                      placeholder="Enter new password (min. 8 characters)"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-sans"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword.new ? "Hide password" : "Show password"}
                    >
                      {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block font-serif text-sm font-semibold text-gray-900 mb-3">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input 
                      id="confirm-password"
                      type={showPassword.confirm ? "text" : "password"} 
                      name="confirmPassword" 
                      value={passwordData.confirmPassword} 
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-sans"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword.confirm ? "Hide password" : "Show password"}
                    >
                      {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h4 className="font-serif text-sm font-semibold text-gray-900 mb-3">Password Requirements</h4>
                <ul className="font-sans text-sm text-gray-600 space-y-2 leading-relaxed">
                  <li>• At least 8 characters long</li>
                  <li>• Mix of letters and numbers recommended</li>
                  <li>• Avoid common or easily guessed passwords</li>
                </ul>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button 
                  onClick={handlePasswordUpdate} 
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white font-sans font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="space-y-10">
              <div>
                <h2 className="font-serif text-3xl font-bold text-red-600 mb-2">Danger Zone</h2>
                <p className="text-gray-600 font-sans text-base leading-relaxed">
                  Irreversible and destructive actions.
                </p>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Trash2 size={24} className="text-red-600" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">Delete Account</h3>
                    <p className="text-gray-700 font-sans text-base leading-relaxed mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <div className="bg-white rounded-lg p-4 mb-6 border border-red-200">
                      <p className="text-gray-700 font-sans text-sm font-semibold mb-2">This action will:</p>
                      <ul className="text-gray-600 font-sans text-sm space-y-1.5 leading-relaxed">
                        <li>• Permanently delete all your personal data</li>
                        <li>• Remove all your content and activity history</li>
                        <li>• Revoke your access to all services immediately</li>
                        <li>• Cannot be undone or recovered by anyone</li>
                      </ul>
                    </div>
                    <button 
                      onClick={handleDeleteAccount}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-sans font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete My Account
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-900 font-sans text-sm leading-relaxed">
                    <strong className="font-semibold">Important:</strong> Account deletion is permanent and cannot be reversed. 
                    Make sure you have exported or backed up any important data before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}