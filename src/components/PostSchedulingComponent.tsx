import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Calendar, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

interface ScheduledPost {
  _id: string;
  title: string;
  status: string;
  scheduledAt: string;
  createdAt: string;
}

const PostSchedulingComponent: React.FC<{ postId?: string }> = ({ postId }) => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/posts/schedule/admin/scheduled`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setScheduledPosts(response.data);
    } catch (error) {
      console.error("Failed to load scheduled posts");
    } finally {
      setLoading(false);
    }
  };

  const schedulePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) {
      toast.error("No post selected");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/posts/schedule/schedule`,
        {
          postId,
          scheduledAt: scheduledDateTime.toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScheduledPosts([...scheduledPosts, response.data.post]);
      setShowScheduleModal(false);
      setScheduledDate("");
      setScheduledTime("09:00");
      toast.success(`Post scheduled for ${scheduledDateTime.toLocaleString()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to schedule post");
    }
  };

  const cancelSchedule = async (postId: string) => {
    if (!window.confirm("Cancel this scheduled post?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/posts/schedule/cancel-schedule/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScheduledPosts(scheduledPosts.filter((p) => p._id !== postId));
      toast.success("Schedule cancelled");
    } catch (error) {
      toast.error("Failed to cancel schedule");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading scheduled posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-purple-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Post Scheduling</h2>
        </div>
        {postId && (
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <Clock size={18} />
            Schedule Post
          </button>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule Post</h3>
            <form onSubmit={schedulePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Time
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">ℹ️ Post will automatically publish</p>
                <p>Your post will be published at the scheduled time. You can cancel this schedule anytime.</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scheduled Posts List */}
      <div className="space-y-4">
        {scheduledPosts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg">No scheduled posts</p>
            <p className="text-gray-500">Posts you schedule will appear here</p>
          </div>
        ) : (
          scheduledPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} className="text-purple-600" />
                      {new Date(post.scheduledAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} className="text-purple-600" />
                      {new Date(post.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => cancelSchedule(post._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 pt-4 border-t border-gray-200">
                <CheckCircle2 size={16} />
                Scheduled for auto-publish
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostSchedulingComponent;
