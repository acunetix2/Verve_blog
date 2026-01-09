import React, { useState, useEffect } from "react";
import { Bell, Mail, Globe, Moon, Eye, Lock, Save, X } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface UserPreferences {
  email: {
    marketing: boolean;
    notifications: boolean;
    digest: boolean;
    digestFrequency: "daily" | "weekly" | "monthly";
  };
  notifications: {
    comments: boolean;
    likes: boolean;
    follows: boolean;
    mentions: boolean;
    replies: boolean;
  };
  privacy: {
    profileVisible: boolean;
    allowMessages: boolean;
    showActivity: boolean;
    allowNotifications: boolean;
  };
  display: {
    theme: "light" | "dark" | "system";
    language: string;
    compactMode: boolean;
    showAds: boolean;
  };
}

const PreferencesPanel: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    email: {
      marketing: true,
      notifications: true,
      digest: true,
      digestFrequency: "weekly",
    },
    notifications: {
      comments: true,
      likes: true,
      follows: true,
      mentions: true,
      replies: true,
    },
    privacy: {
      profileVisible: true,
      allowMessages: true,
      showActivity: true,
      allowNotifications: true,
    },
    display: {
      theme: "system",
      language: "en",
      compactMode: false,
      showAds: true,
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
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPreferences(response.data);
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
      toast.error("Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/preferences`, preferences, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Preferences saved successfully!");
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save preferences");
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
      {/* Email Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <Mail size={22} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email Preferences</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: "email.notifications", label: "Post Notifications", desc: "Get notified about new posts from people you follow" },
            { key: "email.marketing", label: "Marketing Emails", desc: "Receive updates about new features and announcements" },
            { key: "email.digest", label: "Weekly Digest", desc: "Get a summary of activity during the week" },
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

          {preferences.email.digest && (
            <div className="pl-4 border-l-2 border-blue-500 space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Digest Frequency</label>
              <select
                value={preferences.email.digestFrequency}
                onChange={(e) =>
                  updatePreference("email.digestFrequency", e.target.value as "daily" | "weekly" | "monthly")
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}
        </div>
      </motion.div>

      {/* Push Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <Bell size={22} className="text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: "notifications.comments", label: "Comments", desc: "Notify me when someone comments on my posts" },
            { key: "notifications.likes", label: "Likes", desc: "Notify me when someone likes my posts" },
            { key: "notifications.follows", label: "New Followers", desc: "Notify me when someone follows me" },
            { key: "notifications.mentions", label: "Mentions", desc: "Notify me when someone mentions me" },
            { key: "notifications.replies", label: "Replies", desc: "Notify me when someone replies to my comments" },
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

      {/* Privacy Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <Lock size={22} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: "privacy.profileVisible", label: "Public Profile", desc: "Let others see your profile" },
            { key: "privacy.allowMessages", label: "Allow Messages", desc: "Let others send you direct messages" },
            { key: "privacy.showActivity", label: "Show Activity", desc: "Display your activity status to others" },
            { key: "privacy.allowNotifications", label: "Allow Notifications", desc: "Receive notifications from the platform" },
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
        transition={{ delay: 0.3 }}
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
              value={preferences.display.theme}
              onChange={(e) => updatePreference("display.theme", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
            <select
              value={preferences.display.language}
              onChange={(e) => updatePreference("display.language", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <label className="font-medium text-gray-900 dark:text-white">Compact Mode</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Use more condensed layouts</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.display.compactMode}
              onChange={(e) => updatePreference("display.compactMode", e.target.checked)}
              className="w-5 h-5 rounded border-gray-300"
            />
          </div>

          <div className="flex items-start justify-between">
            <div>
              <label className="font-medium text-gray-900 dark:text-white">Show Ads</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Display personalized advertisements</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.display.showAds}
              onChange={(e) => updatePreference("display.showAds", e.target.checked)}
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
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            <Save size={18} />
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
