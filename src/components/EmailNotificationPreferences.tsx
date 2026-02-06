import React, { useState, useEffect } from 'react';
import { Mail, Bell, Settings, Send } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface EmailPreferences {
  courseEnrollmentConfirmation: boolean;
  courseStartReminder: boolean;
  lessonPublished: boolean;
  courseCompleted: boolean;
  newCommentReply: boolean;
  courseReviewResponse: boolean;
  newMessage: boolean;
  badgeEarned: boolean;
  certificateGenerated: boolean;
  promotionalEmails: boolean;
  weeklyDigest: boolean;
  newsAndUpdates: boolean;
  inactivityReminder: boolean;
  assignmentDueReminder: boolean;
}

const EmailNotificationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const [frequency, setFrequency] = useState('immediate');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchPreferences();
    }
  }, [token]);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/email-notifications/preferences`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPreferences(response.data.preferences.preferences);
      setFrequency(response.data.preferences.emailFrequency);
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      toast.error('Failed to load email preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/email-notifications/preferences`,
        { preferences, emailFrequency: frequency },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Email preferences updated!');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/email-notifications/test`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Test email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send test email');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading preferences...</div>;
  }

  if (!preferences) {
    return <div className="text-center py-8">Failed to load preferences</div>;
  }

  const categoryGroups = [
    {
      title: 'Course Updates',
      icon: Bell,
      preferences: [
        { key: 'courseEnrollmentConfirmation', label: 'Enrollment confirmation' },
        { key: 'courseStartReminder', label: 'Course start reminders' },
        { key: 'lessonPublished', label: 'New lessons published' },
        { key: 'courseCompleted', label: 'Course completion' }
      ]
    },
    {
      title: 'Engagement',
      icon: Mail,
      preferences: [
        { key: 'newCommentReply', label: 'Comment replies' },
        { key: 'courseReviewResponse', label: 'Review responses' },
        { key: 'newMessage', label: 'New messages' }
      ]
    },
    {
      title: 'Achievements',
      icon: Settings,
      preferences: [
        { key: 'badgeEarned', label: 'Badge earned' },
        { key: 'certificateGenerated', label: 'Certificate generated' }
      ]
    },
    {
      title: 'General',
      icon: Settings,
      preferences: [
        { key: 'promotionalEmails', label: 'Promotional emails' },
        { key: 'weeklyDigest', label: 'Weekly digest' },
        { key: 'newsAndUpdates', label: 'News and updates' },
        { key: 'inactivityReminder', label: 'Inactivity reminders' },
        { key: 'assignmentDueReminder', label: 'Assignment due reminders' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Email Notification Preferences</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose which emails you'd like to receive and how often.
        </p>
      </div>

      {/* Email Frequency */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Email Frequency</h3>
        <div className="space-y-2">
          {['immediate', 'daily', 'weekly', 'never'].map((freq) => (
            <label key={freq} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                value={freq}
                checked={frequency === freq}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-4 h-4"
              />
              <span className="capitalize font-medium">{freq}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Preferences Categories */}
      {categoryGroups.map((group) => {
        const Icon = group.icon;
        return (
          <div
            key={group.title}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon size={24} />
              <h3 className="text-lg font-semibold">{group.title}</h3>
            </div>

            <div className="space-y-3">
              {group.preferences.map((pref) => (
                <label
                  key={pref.key}
                  className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <input
                    type="checkbox"
                    checked={preferences[pref.key as keyof EmailPreferences]}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        [pref.key]: e.target.checked
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span>{pref.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
        <button
          onClick={handleTestEmail}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <Send size={18} />
          Send Test Email
        </button>
      </div>
    </div>
  );
};

export default EmailNotificationPreferences;
