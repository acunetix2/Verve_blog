import { Link, useNavigate } from "react-router-dom";
import { Menu, Bell, LogOut, Users, Activity, ChevronDown, AlertCircle, Zap, Settings, LogIn } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { VerveHubLogo } from "./VerveHubLogo";
import ThemeSwitcherIcon from "./ThemeSwitcherIcon";
import { useTheme } from "./ThemeContext";

interface AdminUser {
  name: string;
  email: string;
  profileImage?: string;
  role: string;
}

interface SystemAlert {
  _id?: string;
  message: string;
  title?: string;
  type?: "info" | "warning" | "error" | "success";
  priority?: "low" | "medium" | "high" | "critical";
  timestamp?: Date | string;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
}

export const AdminHeader = ({ onToggleSidebar }: { onToggleSidebar?: () => void }) => {
  const [user, setAdminUser] = useState<AdminUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const { actualTheme } = useTheme();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchAdminUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminUser(res.data);
    } catch (error) {
      console.error("Failed to fetch admin user:", error);
    }
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notifications?unreadOnly=false`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const notifs = res.data || [];
      setSystemAlerts(notifs);
      setUnreadNotifications(notifs.filter(n => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchAdminUser();
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchAdminUser, fetchNotifications]);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setRedirecting(true);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setLogoutModalOpen(false);
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const markNotificationAsRead = async (id: string) => {
    if (!token) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      setSystemAlerts(systemAlerts.map(alert => 
        alert._id === id ? { ...alert, isRead: true, read: true } : alert
      ));
      setUnreadNotifications(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getAlertIcon = (type?: string, priority?: string) => {
    // Use priority if type is not available
    const alertType = type || priority || "info";
    switch (alertType) {
      case "error":
      case "critical":
        return <AlertCircle size={16} className="text-red-400" />;
      case "warning":
      case "high":
        return <AlertCircle size={16} className="text-yellow-400" />;
      case "success":
        return <Zap size={16} className="text-green-400" />;
      case "info":
      case "medium":
      case "low":
      default:
        return <Activity size={16} className="text-blue-400" />;
    }
  };

  return (
    <>
      {/* Logout Modal */}
      {logoutModalOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg ${
          actualTheme === "dark" ? "bg-black/60" : "bg-black/30"
        }`}>
          <div className={`rounded-2xl shadow-2xl border max-w-sm w-full p-8 animate-in fade-in zoom-in duration-200 ${
            actualTheme === "dark"
              ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50"
              : "bg-gradient-to-br from-white via-gray-50 to-white border-gray-200/50"
          }`}>
            <div className={`flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/30 border border-red-500/50 mx-auto mb-6 ${
              actualTheme === "dark" ? "" : "opacity-80"
            }`}>
              <LogOut className="w-7 h-7 text-red-400" />
            </div>
            <h3 className={`text-xl font-bold text-center mb-2 ${
              actualTheme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              Sign Out?
            </h3>
            <p className={`text-sm text-center mb-8 ${
              actualTheme === "dark" ? "text-slate-400" : "text-gray-600"
            }`}>
              You will be redirected to the login page. Your session will be securely ended.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setLogoutModalOpen(false)}
                disabled={redirecting}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 duration-200 ${
                  actualTheme === "dark"
                    ? "border border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100/50 hover:border-gray-400"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={redirecting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all disabled:opacity-50 duration-200 shadow-lg shadow-red-500/20"
              >
                {redirecting ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Admin Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-30 w-full transition-all duration-300 ${
          actualTheme === "dark"
            ? scrolled
              ? "bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl"
              : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/30"
            : scrolled
            ? "bg-gradient-to-r from-white/95 via-gray-50/95 to-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
            : "bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200/30"
        }`}
      >
        {/* Animated top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60"></div>

        <div className="max-w-full mx-auto px-4 h-20 flex items-center justify-between gap-6">
          {/* Left Section - Logo & Branding */}
          <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
            <button
              onClick={onToggleSidebar}
              className={`lg:hidden p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                actualTheme === "dark"
                  ? "hover:bg-slate-700/50 text-slate-400 hover:text-slate-200"
                  : "hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
              }`}
              aria-label="Toggle sidebar"
            >
              <Menu size={21} />
            </button>

            <Link to="/admin" className="flex items-center gap-3 hover:opacity-90 transition-all duration-200 group">
              <div className="w-10 h-10 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 blur-sm transition-opacity"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <VerveHubLogo size="sm" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-base font-bold leading-tight tracking-tight ${
                  actualTheme === "dark" ? "text-white" : "text-gray-900"
                }`}>Verve Admin</h1>
                <p className={`text-xs font-semibold ${
                  actualTheme === "dark" ? "text-blue-300" : "text-blue-600"
                }`}>Control Panel</p>
              </div>
            </Link>
          </div>



          {/* Right Section - Actions & Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Notifications Bell with Badge */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative p-2.5 rounded-lg transition-all duration-200 group ${
                  actualTheme === "dark"
                    ? "hover:bg-slate-700/50 text-slate-400 hover:text-slate-200"
                    : "hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
                }`}
                title="Notifications"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Bell size={20} className="relative z-10 group-hover:scale-110 transition-transform" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className={`absolute top-full right-0 mt-3 w-96 rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 ${
                  actualTheme === "dark"
                    ? "bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-slate-700/50"
                    : "bg-gradient-to-br from-white/95 to-gray-50/95 border border-gray-200/50"
                }`}>
                  {/* Header */}
                  <div className={`px-6 py-4 flex items-center justify-between ${
                    actualTheme === "dark" ? "border-b border-slate-700/50" : "border-b border-gray-200/50"
                  }`}>
                    <h3 className={`text-base font-semibold ${
                      actualTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}>Notifications</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      actualTheme === "dark"
                        ? "bg-blue-500/20 border border-blue-500/50 text-blue-300"
                        : "bg-blue-100/50 border border-blue-300/50 text-blue-700"
                    }`}>
                      {unreadNotifications} New
                    </span>
                  </div>

                  {/* Notifications List */}
                  <div className={`divide-y max-h-96 overflow-y-auto ${
                    actualTheme === "dark" ? "divide-slate-700/30" : "divide-gray-200/30"
                  }`}>
                    {systemAlerts.length === 0 ? (
                      <div className="px-6 py-8 text-center">
                        <Activity size={32} className={`mx-auto mb-2 ${
                          actualTheme === "dark" ? "text-slate-600" : "text-gray-300"
                        }`} />
                        <p className={`text-sm ${
                          actualTheme === "dark" ? "text-slate-400" : "text-gray-600"
                        }`}>No notifications yet</p>
                      </div>
                    ) : (
                      systemAlerts.map((alert) => {
                        const alertId = alert._id
                        const isUnread = alert.isRead === false || alert.read === false;
                        const timestamp = alert.createdAt || alert.timestamp;
                        const timeAgo = timestamp ? Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000) : 0;
                        const displayMessage = alert.title || alert.message;
                        return (
                          <button
                            key={alertId}
                            onClick={() => markNotificationAsRead(alertId || "")}
                            className={`w-full px-6 py-4 text-left transition-all duration-200 flex items-start gap-3 ${
                              actualTheme === "dark"
                                ? `hover:bg-slate-700/30 ${isUnread ? "bg-slate-700/20" : ""}`
                                : `hover:bg-gray-100/30 ${isUnread ? "bg-gray-100/20" : ""}`
                            }`}
                          >
                            <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type, alert.priority)}</div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                actualTheme === "dark" ? "text-white" : "text-gray-900"
                              }`}>{displayMessage}</p>
                              <p className={`text-xs mt-1 ${
                                actualTheme === "dark" ? "text-slate-500" : "text-gray-600"
                              }`}>
                                {timeAgo}m ago
                              </p>
                            </div>
                            {isUnread && (
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className={`px-6 py-3 text-center ${
                    actualTheme === "dark" ? "border-t border-slate-700/50" : "border-t border-gray-200/50"
                  }`}>
                    <button className={`text-xs font-medium transition-colors ${
                      actualTheme === "dark"
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-700"
                    }`}>
                      View All Alerts
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Switcher */}
            <ThemeSwitcherIcon />

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  actualTheme === "dark"
                    ? "hover:bg-slate-700/50 border border-slate-700/30 hover:border-slate-600/50"
                    : "hover:bg-gray-200/50 border border-gray-300/30 hover:border-gray-400/50"
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-lg shadow-purple-600/30 group-hover:shadow-purple-600/50 transition-all">
                  <LogIn size={18} className="text-white" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <p className={`text-xs font-semibold leading-tight ${
                    actualTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    {user?.name?.split(" ")[0] || "Admin"}
                  </p>
                  <p className={`text-xs ${
                    actualTheme === "dark" ? "text-slate-400" : "text-gray-600"
                  }`}>Administrator</p>
                </div>
                <ChevronDown size={16} className={`transition-colors hidden sm:block ${
                  actualTheme === "dark"
                    ? "text-slate-400 group-hover:text-slate-300"
                    : "text-gray-600 group-hover:text-gray-900"
                }`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className={`absolute top-full right-0 mt-3 w-56 rounded-xl shadow-2xl backdrop-blur-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 divide-y ${
                  actualTheme === "dark"
                    ? "bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-slate-700/50 divide-slate-700/30"
                    : "bg-gradient-to-br from-white/95 to-gray-50/95 border border-gray-200/50 divide-gray-200/30"
                }`}>
                  {/* User Info */}
                  <div className="px-4 py-4">
                    <p className={`text-sm font-semibold ${
                      actualTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}>{user?.name || "Admin User"}</p>
                    <p className={`text-xs truncate mt-1 ${
                      actualTheme === "dark" ? "text-slate-400" : "text-gray-600"
                    }`}>{user?.email}</p>
                    <div className="flex items-center gap-1.5 mt-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-400">Online</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/admin/account"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                        actualTheme === "dark"
                          ? "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
                      }`}
                    >
                      <Settings size={16} className={
                        actualTheme === "dark" ? "text-slate-500" : "text-gray-400"
                      } />
                      Account Settings
                    </Link>

                    <a
                      href="https://github.com/verveblog.git"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                        actualTheme === "dark"
                          ? "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
                      }`}
                    >
                      <Settings size={16} className={
                        actualTheme === "dark" ? "text-slate-500" : "text-gray-400"
                      } />
                      Documentation
                    </a>
                  </div>

                  {/* Logout */}
                  <div className="py-2">
                    <button
                      onClick={() => setLogoutModalOpen(true)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
