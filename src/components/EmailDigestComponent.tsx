import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Bell, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

interface DigestPreferences {
  subscribed: boolean;
  frequency: "daily" | "weekly" | "monthly";
  categories: string[];
}

const EmailDigestComponent: React.FC = () => {
  const [preferences, setPreferences] = useState<DigestPreferences>({
    subscribed: false,
    frequency: "weekly",
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = [
    "Tutorials",
    "Advanced",
    "Tools",
    "News",
    "Security",
    "Web Development",
    "DevOps",
  ];

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/digest/preferences`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPreferences(response.data);
    } catch (error) {
      console.error("Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      if (preferences.subscribed) {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/digest/subscribe`,
          {
            frequency: preferences.frequency,
            categories: preferences.categories,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Preferences saved! You'll receive your digest soon.");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/digest/unsubscribe`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Unsubscribed from digest");
      }
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading preferences...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Mail className="text-blue-600" size={32} />
        <h2 className="text-3xl font-bold text-gray-900">Email Digest</h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
        {/* Subscription Toggle */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <h3 className="font-semibold text-gray-900">Weekly Digest</h3>
            <p className="text-sm text-gray-600 mt-1">
              Get trending posts and top articles delivered to your inbox
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.subscribed}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  subscribed: e.target.checked,
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {preferences.subscribed && (
          <>
            {/* Frequency Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Digest Frequency</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["daily", "weekly", "monthly"].map((freq) => (
                  <label
                    key={freq}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      preferences.frequency === freq
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={freq}
                      checked={preferences.frequency === freq}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          frequency: e.target.value as any,
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 font-medium text-gray-900 capitalize">
                      {freq}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Topics of Interest</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select categories you'd like to see in your digest
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.categories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferences({
                            ...preferences,
                            categories: [...preferences.categories, category],
                          });
                        } else {
                          setPreferences({
                            ...preferences,
                            categories: preferences.categories.filter(
                              (c) => c !== category
                            ),
                          });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <Bell className="text-green-600 flex-shrink-0" size={20} />
              <div className="text-sm text-green-800">
                <p className="font-medium">You're subscribed!</p>
                <p className="mt-1">
                  Your {preferences.frequency} digest will be sent to your email with the latest posts from selected categories.
                </p>
              </div>
            </div>
          </>
        )}

        {!preferences.subscribed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <Bell className="text-yellow-600 flex-shrink-0" size={20} />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">You're not subscribed</p>
              <p className="mt-1">
                Enable the toggle above to start receiving weekly digests of trending articles.
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={updatePreferences}
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                Save Preferences
              </>
            )}
          </button>
        </div>

        {/* Sample Digest Preview */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Sample Digest Preview</h3>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your digest will look something like this:
              </p>
              <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                <p className="font-semibold text-gray-900">
                  📰 Your Weekly Digest - Top Posts
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ Post 1: Getting Started with React Hooks - 1.2K views</p>
                  <p>✓ Post 2: Advanced TypeScript Patterns - 892 views</p>
                  <p>✓ Post 3: Web Security Best Practices - 756 views</p>
                  <p>... and more trending posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDigestComponent;
