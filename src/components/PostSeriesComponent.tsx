import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Plus, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

interface SeriesItem {
  _id: string;
  title: string;
  description: string;
  slug: string;
  author: { name: string };
  posts: any[];
  views: number;
  createdAt: string;
}

const PostSeriesComponent: React.FC<{ series?: SeriesItem }> = ({ series }) => {
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
  });

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/series`);
      setSeriesList(response.data);
    } catch (error) {
      toast.error("Failed to load series");
    } finally {
      setLoading(false);
    }
  };

  const createSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/series`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSeriesList([...seriesList, response.data]);
      setFormData({ title: "", description: "", category: "General" });
      setShowModal(false);
      toast.success("Series created successfully");
    } catch (error) {
      toast.error("Failed to create series");
    }
  };

  const deleteSeries = async (id: string) => {
    if (!window.confirm("Delete this series?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/series/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeriesList(seriesList.filter((s) => s._id !== id));
      toast.success("Series deleted");
    } catch (error) {
      toast.error("Failed to delete series");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading series...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Post Series</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
        >
          <Plus size={18} />
          Create Series
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Series</h3>
            <form onSubmit={createSeries} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Series Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Python Security Basics"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe your series..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>General</option>
                  <option>Tutorials</option>
                  <option>Advanced</option>
                  <option>Tools</option>
                  <option>News</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Series Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seriesList.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg">No series yet</p>
            <p className="text-gray-500">Create your first series to start organizing posts</p>
          </div>
        ) : (
          seriesList.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{item.title}</h3>
                  <button
                    onClick={() => deleteSeries(item._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description || "No description"}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen size={16} /> {item.posts.length} posts
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={16} /> {item.views} views
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    By {item.author?.name || "Unknown"}
                  </span>
                  <a
                    href={`/series/${item.slug}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Series →
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostSeriesComponent;
