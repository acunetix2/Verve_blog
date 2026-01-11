import React, { useState, useEffect } from "react";
import { Bell, Mail, Globe, Moon, Eye, Lock, Save, X } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface UserPreferences {
  themeSettings: {
    theme: "light" | "dark" | "system";
    contrast: "normal" | "high";
    fontSize: number;
    useSystemFont: boolean;
    animationReduces: boolean;
  };
  notificationSettings: {
    emailNotifications: boolean;
    newPostNotifications: boolean;
    likeNotifications: boolean;
    commentNotifications: boolean;
    shareNotifications: boolean;
  };
}

const PreferencesPanel: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    themeSettings: {
      theme: "system",
      contrast: "normal",
      fontSize: 100,
      useSystemFont: false,
      animationReduces: false,
    },
    notificationSettings: {
      emailNotifications: true,
      newPostNotifications: true,
      likeNotifications: true,
      commentNotifications: true,
      shareNotifications: true,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Helper to get nested preference values
  const getNestedValue = (path: string): boolean => {
    const keys = path.split(".");
    let value: unknown = preferences;
    for (const key of keys) {
      if (typeof value === "object" && value !== null) {
        value = (value as Record<string, unknown>)[key];
      }
    }
    return Boolean(value);
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success || response.data.themeSettings) {
        setPreferences(response.data.themeSettings ? response.data : response.data);
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
      toast.error("Could not load your preferences. Using defaults.");
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/me/preferences`, preferences, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success || response.data.message) {
        toast.success("Your preferences have been saved successfully!");
        setHasChanges(false);
      }
    } catch (error: any) {
      console.error("Failed to save preferences:", error);
      const errorMsg = error.response?.data?.message || "Could not save your preferences. Please try again.";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (path: string, value: unknown) => {
    const keys = path.split(".");
    const newPreferences = JSON.parse(JSON.stringify(preferences));
    let current = newPreferences;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setPreferences(newPreferences);
    setHasChanges(true);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading preferences...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <Bell size={22} className="text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: "notificationSettings.emailNotifications", label: "Email Notifications", desc: "Receive email notifications for activities" },
            { key: "notificationSettings.newPostNotifications", label: "New Posts", desc: "Notify me when new posts are published" },
            { key: "notificationSettings.likeNotifications", label: "Likes", desc: "Notify me when someone likes my content" },
            { key: "notificationSettings.commentNotifications", label: "Comments", desc: "Notify me when someone comments on my posts" },
            { key: "notificationSettings.shareNotifications", label: "Shares", desc: "Notify me when someone shares my content" },
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">{item.label}</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={getNestedValue(item.key)}
                onChange={(e) => updatePreference(item.key, e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
            </div>
          ))}
        </div>
      </motion.div>



      {/* Display Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <Eye size={22} className="text-orange-600 dark:text-orange-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Display</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
            <select
              value={preferences.themeSettings.theme}
              onChange={(e) => updatePreference("themeSettings.theme", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contrast</label>
            <select
              value={preferences.themeSettings.contrast}
              onChange={(e) => updatePreference("themeSettings.contrast", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Size: {preferences.themeSettings.fontSize}%
            </label>
            <input
              type="range"
              min="80"
              max="150"
              value={preferences.themeSettings.fontSize}
              onChange={(e) => updatePreference("themeSettings.fontSize", parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-start justify-between">
            <div>
              <label className="font-medium text-gray-900 dark:text-white">Use System Font</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Use your system's default font</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.themeSettings.useSystemFont}
              onChange={(e) => updatePreference("themeSettings.useSystemFont", e.target.checked)}
              className="w-5 h-5 rounded border-gray-300"
            />
          </div>

          <div className="flex items-start justify-between">
            <div>
              <label className="font-medium text-gray-900 dark:text-white">Reduce Animations</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Minimize motion effects</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.themeSettings.animationReduces}
              onChange={(e) => updatePreference("themeSettings.animationReduces", e.target.checked)}
              className="w-5 h-5 rounded border-gray-300"
            />
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3"
        >
          <button
            onClick={savePreferences}
            disabled={saving}
            className=" px-4 py-2 bg-green-700 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white text-xs font-medium rounded-md transition-colors disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
          <button
            onClick={() => {
              fetchPreferences();
              setHasChanges(false);
            }}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PreferencesPanel;
