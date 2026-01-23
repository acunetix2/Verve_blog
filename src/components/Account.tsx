/**
 * Author / Copyright: Iddy
 * All rights reserved.
 */
 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, AlertCircle, CheckCircle, Trash2, User, Mail, Lock, Camera, Shield, Clock, ArrowLeft, Settings, Bell, Globe, Smartphone, Monitor, Bookmark, Activity } from "lucide-react";
import ReadingProgressBookmarks from "./ReadingProgressBookmarks";
import PreferencesPanel from "./PreferencesPanel";
import ActivityTimeline from "./ActivityTimeline";

interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  profileImage: string;
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    timezone: string;
  };
}

interface Session {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

type TabType = 'profile' | 'security' | 'preferences' | 'sessions' | 'bookmarks' | 'activity' | 'danger';

export default function Account() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
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
  
  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  
  // Sessions state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  
  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
        setAvatarPreview(res.data.profileImage || null);
        
        // Set preferences if available from backend
        if (res.data.preferences) {
          setEmailNotifications(res.data.preferences.emailNotifications ?? false);
          setPushNotifications(res.data.preferences.pushNotifications ?? false);
          setLanguage(res.data.preferences.language ?? "en");
          setTimezone(res.data.preferences.timezone ?? "UTC");
        }
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

  useEffect(() => {
  const currentLang = localStorage.getItem("i18nextLng") || "en";
	  setLanguage(currentLang);
	  i18n.changeLanguage(currentLang);
	}, []);
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
        setMessage({ type: "error", text: t("Image Size Error") });
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setIsDirty(true);
    }
  };

	const formatLastActive = (dateString: string) => {
	  const date = new Date(dateString);
	  if (isNaN(date.getTime())) return "N/A";

	  const diff = Date.now() - date.getTime();
	  const minutes = Math.floor(diff / 60000);
	  if (minutes < 1) return "Just now";
	  if (minutes < 60) return `${minutes} min ago`;
	  const hours = Math.floor(minutes / 60);
	  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
	  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
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
      if (avatarFile) data.append("profileImage", avatarFile);

      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/me`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      setIsDirty(false);
      setAvatarFile(null);
      setMessage({ type: "success", text: t("Profile Update Success") });
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || t("Profile Update Error") });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: "error", text: t("All Password Fields Required") });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: "error", text: t("Password Min Length") });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: t("Passwords Do Not Match") });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    setMessage(null);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/me/password`, 
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage({ type: "success", text: t("Password Update Success") });
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      console.error("Password update error:", err.response?.data);
      const errorMsg = err.response?.data?.message || t("Password Update Error");
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(true);
    setDeleteStep(1);
    setDeleteConfirmText("");
  };

  const handleConfirmDelete = async () => {
    if (deleteStep === 1) {
      setDeleteStep(2);
      return;
    }

    if (deleteStep === 2) {
      if (deleteConfirmText.toLowerCase() !== "delete") {
        setMessage({ type: "error", text: "Please type the exact phrase to confirm deletion" });
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      setIsDeleting(true);
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.clear();
        navigate("/signup");
      } catch (err: any) {
        setMessage({ type: "error", text: err.response?.data?.message || "Account deletion failed. Please contact support." });
        setShowDeleteModal(false);
        setIsDeleting(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteStep(1);
    setDeleteConfirmText("");
  };

  const fetchSessions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSessionsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data.sessions || []);
    } catch (err: any) {
      // If endpoint doesn't exist (404), sessions feature is not available
      if (err.response?.status === 404) {
        console.log("Sessions endpoint not available");
      }
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  // Fetch sessions when Sessions tab is active
  useEffect(() => {
    if (activeTab === 'sessions') {
      fetchSessions();
    }
  }, [activeTab]);

  const handleRevokeSession = async (sessionId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/me/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: "Session revoked successfully" });
      fetchSessions(); // Refresh sessions
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to revoke session" });
    }
  };

  const handleRevokeAllSessions = async () => {
    const confirmed = window.confirm(t(" Confirm Revoke All Sessions "));
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/me/sessions/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: t("All Sessions Revoked Successfully") });
      fetchSessions(); // Refresh sessions
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || t("revoke Sessions Error") });
    }
  };

  const handlePreferencesUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setPreferencesLoading(true);
    setMessage(null);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/me/preferences`,
        {
          emailNotifications,
          pushNotifications,
          language,
          timezone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (user) {
        setUser({ ...user, preferences: res.data.preferences });
      }
      
      setMessage({ type: "success", text: t("Preferences Update Success") });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setMessage({ type: "error", text: t("Preferences Not Available") });
      } else {
        setMessage({ type: "error", text: err.response?.data?.message || t("preferences Update Error") });
      }
    } finally {
      setPreferencesLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
      setAvatarPreview(user.profileImage || null);
      setAvatarFile(null);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsDirty(false);
      setMessage(null);
    }
  };

  const handleExit = () => {
    if (isDirty) {
      const confirm = window.confirm(t("Unsaved Changes Warning"));
      if (!confirm) return;
    }
    navigate("/v");
  };

  const getRoleDisplay = (role: string) => {
    return role === "admin" ? t("Administrator") : t("Normal ");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return t("Date Not Available");
      }
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return t("Date Not Available");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm" style={{ fontFamily: 'Google Sans, sans-serif' }}>{t("Loading Account Settings")}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as TabType, label: t("profile"), icon: User },
    { id: 'security' as TabType, label: t("security"), icon: Lock },
    { id: 'preferences' as TabType, label: t("preferences"), icon: Settings },
    { id: 'bookmarks' as TabType, label: "Bookmarks", icon: Bookmark },
    { id: 'sessions' as TabType, label: t("Sessions"), icon: Monitor },
    { id: 'activity' as TabType, label: "Activity", icon: Activity },
    { id: 'danger' as TabType, label: t("Danger Zone"), icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Google Sans, sans-serif' }}>
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-red-600 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={18} className="sm:hidden text-white" />
                  <AlertCircle size={22} className="hidden sm:block text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">{t("Delete Account")}</h3>
                  <p className="text-xs text-red-100">{t("Irreversible")}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              {deleteStep === 1 ? (
                <>
                  <div className="mb-5">
                    <p className="text-sm text-gray-700 mb-4">
                      {t("Are you sure?")}
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <ul className="text-xs text-gray-700 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold mt-0.5">•</span>
                          <span>{t("Permanently delete all your personal data")}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold mt-0.5">•</span>
                          <span>{t("Remove all your content and activity history")}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold mt-0.5">•</span>
                          <span>{t("Revoke your access to all services immediately")}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold mt-0.5">•</span>
                          <span>{t("Cannot be undone or recovered by anyone")}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-900">
                        {t("Backup Data Warning")}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{t("Final Warning")}</p>
                    <p className="text-xs text-gray-600 mb-4">
                      {t("Enter ")} <span className="font-bold text-gray-900">"{t("delete")}"</span> to confirm:
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder={t("delete")}
                      className="w-full px-3 py-2 text-sm rounded-md bg-white border-2 border-red-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    />
                  </div>

                  <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-5">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-700 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-900 font-medium">
                        {t("Last Warning")}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  {t("No")}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteStep === 2 && deleteConfirmText.toLowerCase() !== t("delete").toLowerCase() || isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {isDeleting ? t("deleting") : deleteStep === 1 ? t("Yes") : t("Delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleExit}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors group"
              aria-label="Go back"
            >
              <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px] group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs sm:text-sm font-medium">{t("back")}</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 flex items-center justify-center">
                <Settings size={12} className="sm:w-[14px] sm:h-[14px] text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="lg:sticky lg:top-20">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-0.5 sm:mb-1">{t("Settings")}</h1>
              <p className="text-xs text-gray-500 mb-4 sm:mb-6">{t("Manage Your Account")}</p>
              
              {/* Mobile: Dropdown-style tabs */}
              <nav className="lg:space-y-0.5">
                <div className="lg:hidden mb-4">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value as TabType)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  >
                    {tabs.map(tab => (
                      <option key={tab.id} value={tab.id}>{tab.label}</option>
                    ))}
                  </select>
                </div>

                {/* Desktop: Regular nav */}
                <div className="hidden lg:block space-y-0.5">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeTab === tab.id
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0 w-full">
            {/* Global Message */}
            {message && (
              <div className={`mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg flex items-start gap-2 text-xs sm:text-sm border ${
                message.type === "error" 
                  ? "bg-red-50 border-red-200 text-red-800" 
                  : "bg-green-50 border-green-200 text-green-800"
              }`}>
                {message.type === "error" ? 
                  <AlertCircle size={14} className="sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" /> : 
                  <CheckCircle size={14} className="sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                }
                <p>{message.text}</p>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Profile</h2>
                  <p className="text-xs text-gray-500">
                    Manage your personal information and profile picture
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
                  {/* Avatar Section */}
                  <div className="pb-4 sm:pb-5 border-b border-gray-100 mb-4 sm:mb-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-2 sm:mb-3">
                      Profile Picture
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="relative group">
                        <img 
                          src={avatarPreview || "/default-avatar.png"} 
                          alt="Profile avatar" 
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-gray-200"
                        />
                        <label 
                          htmlFor="avatar-upload" 
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Camera size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-md cursor-pointer transition-colors"
                        >
                          <Camera size={14} />
                          Change photo
                        </label>
                        <p className="text-gray-400 text-xs mt-1.5">JPG, PNG or GIF. Max 5MB.</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <input 
                        id="name"
                        name="name" 
                        type="text"
                        value={formData.name} 
                        onChange={handleFormChange} 
                        placeholder="Enter your full name"
                        className="w-full px-3 py-2 text-sm rounded-md bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <input 
                          id="email"
                          name="email" 
                          type="email"
                          value={formData.email} 
                          disabled
                          className="w-full px-3 py-2 text-sm rounded-md bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                        />
                        <Mail size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed for security reasons</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2.5 sm:p-3 mt-3 sm:mt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Shield size={13} />
                          <span>Role: <strong className="text-green-700">{getRoleDisplay(user.role)}</strong></span>
                        </div>
                        <span className="hidden sm:inline text-gray-700">•</span>
                        <div className="flex items-center font-bold gap-1.5 text-green-800">
                          <Clock size={13} />
                          <span>Since {formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-gray-100">
                    <button 
                      onClick={handleProfileUpdate} 
                      disabled={isLoading || !isDirty}
                      className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white text-xs font-medium rounded-md transition-colors disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    {isDirty && (
                      <button 
                        onClick={handleCancel}
                        className="w-full sm:w-auto text-white px-4 py-2 bg-slate-700 border border-gray-300 hover:bg-red-500 text-gray-700 text-xs font-medium rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Security</h2>
                  <p className="text-xs text-gray-500">
                    Manage your password and security settings
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                          className="w-full px-3 py-2 pr-10 text-sm rounded-md bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label={showPassword.current ? "Hide password" : "Show password"}
                        >
                          {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="new-password" className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                          className="w-full px-3 py-2 pr-10 text-sm rounded-md bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label={showPassword.new ? "Hide password" : "Show password"}
                        >
                          {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                          className="w-full px-3 py-2 pr-10 text-sm rounded-md bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label={showPassword.confirm ? "Hide password" : "Show password"}
                        >
                          {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">Password Requirements</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Mix of letters and numbers recommended</li>
                      <li>• Avoid common or easily guessed passwords</li>
                    </ul>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <button 
                      onClick={handlePasswordUpdate} 
                      disabled={isLoading}
                      className=" px-4 py-2 bg-green-700 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white text-xs font-medium rounded-md transition-colors disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-4 sm:space-y-6">
                <PreferencesPanel />
              </div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Active Sessions</h2>
                  <p className="text-xs text-gray-500">
                    Manage your active sessions across devices
                  </p>
                </div>

                {sessionsLoading ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
                    <p className="text-sm text-gray-600">Loading sessions...</p>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <Monitor size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">No session data available</p>
                    <p className="text-xs text-gray-400">Session tracking is not enabled on your account</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
                      <div className="space-y-3 sm:space-y-4">
                        {sessions.map((session) => (
                          <div key={session.id} className="flex items-start gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${session.isCurrent ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                              {session.device.toLowerCase().includes('mobile') ? (
                                <Smartphone size={16} className={`sm:w-[18px] sm:h-[18px] ${session.isCurrent ? 'text-green-600' : 'text-gray-600'}`} />
                              ) : (
                                <Monitor size={16} className={`sm:w-[18px] sm:h-[18px] ${session.isCurrent ? 'text-green-600' : 'text-gray-600'}`} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-blue-900 truncate">
                                    {session.isCurrent ? 'Current Session' : session.device}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {session.device} • {session.browser} • {session.location}
                                  </p>
								                  <p className="text-xs text-gray-400 mt-1"> IP Address: {session.ipAddress}</p>
                                  <p className="text-xs text-gray-400 mt-1">Last Active: {formatLastActive(session.lastActive)}</p>
                                </div>
                                {session.isCurrent ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded self-start">Active</span>
                                ) : (
                                  <button 
                                    onClick={() => handleRevokeSession(session.id)}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium self-start"
                                  >
                                    Revoke
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {sessions.filter(s => !s.isCurrent).length > 0 && (
                        <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-100">
                          <button 
                            onClick={handleRevokeAllSessions}
                            className="px-4 py-2 bg-white border border-red-300 hover:bg-red-50 text-red-600 text-xs font-medium rounded-md transition-colors"
                          >
                            Revoke All
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle size={14} className="sm:w-4 sm:h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-900">
                          If you notice any unfamiliar sessions, revoke them immediately and change your password.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Bookmarks Tab */}
            {activeTab === 'bookmarks' && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Reading Progress & Bookmarks</h2>
                  <p className="text-xs text-gray-500">
                    View and manage your saved articles and reading progress
                  </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200">
                  <ReadingProgressBookmarks />
                </div>
              </div>
            )}

            {/* Activity Timeline Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Activity Timeline</h2>
                  <p className="text-xs text-gray-500">
                    View your recent activities and contributions
                  </p>
                </div>
                <ActivityTimeline userId={user?._id || localStorage.getItem("userId") || ""} />
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-red-600 mb-1">Danger Zone</h2>
                  <p className="text-xs text-gray-500">
                    Irreversible and destructive actions
                  </p>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-5">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Trash2 size={16} className="sm:w-[18px] sm:h-[18px] text-red-600" />
                    </div>
                    <div className="flex-grow min-w-0 w-full">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Delete Account</h3>
                      <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <div className="bg-white rounded-md p-2.5 sm:p-3 mb-3 sm:mb-4 border border-red-200">
                        <p className="text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2">This action will:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Permanently delete all your personal data</li>
                          <li>• Remove all your content and activity history</li>
                          <li>• Revoke your access to all services immediately</li>
                          <li>• Cannot be undone or recovered by anyone</li>
                        </ul>
                      </div>
                      <button 
                        onClick={handleDeleteAccount}
                        className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center sm:justify-start gap-2"
                      >
                        <Trash2 size={16} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="sm:w-4 sm:h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900">
                      <strong className="font-semibold">Important:</strong> Account deletion is permanent and cannot be reversed. 
                      Make sure you have exported or backed up any important data before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}