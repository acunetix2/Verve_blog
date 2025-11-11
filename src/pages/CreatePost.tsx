import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Terminal,
  ArrowLeft,
  FileText,
  User,
  Clock,
  Tag,
  Shield,
  Send,
  AlertCircle,
  XCircle,
  CircleAlert,
} from "lucide-react";

interface PostFormData {
  title: string;
  slug: string;
  description: string;
  author: string;
  readTime: string;
  tags: string;
  content: string;
  featured: boolean;
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    slug: "",
    description: "",
    author: "",
    readTime: "",
    tags: "",
    content: "",
    featured: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateFields = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!formData.title.trim()) newErrors.title = true;
    if (!formData.slug.trim()) newErrors.slug = true;
    if (!formData.content.trim()) newErrors.content = true;
    return newErrors;
  };

  // ✅ Submit new post
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill all required fields before publishing.");
      return;
    }

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      await axios.post(`${API_BASE_URL}/posts/create`, payload);
      toast.success("Post published successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Post creation failed:", error);
      toast.error("Something went wrong while publishing the post.");
    }
  };

  const handleExit = () => navigate("/admin");
  
  // Added clear form logic (no existing code removed)
  const handleClear = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      author: "",
      readTime: "",
      tags: "",
      content: "",
      featured: false,
    });
    setErrors({});
    toast.info("Cleared.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-950 text-white">
      {/* Grid background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${8 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30px) translateX(15px); }
          50% { transform: translateY(-60px) translateX(-15px); }
          75% { transform: translateY(-30px) translateX(15px); }
        }
      `}</style>

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 rounded-lg">
              <AlertCircle className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Create New Post
              </h1>
              <p className="text-sm font-mono text-gray-400 mt-1">
                Post Management Panel
              </p>
            </div>
          </div>

          <button
            onClick={handleExit}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-gray-900/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all font-mono text-sm"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Exit
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label
              className={`flex items-center gap-2 text-sm font-mono ${
                errors.title ? "text-red-400" : "text-cyan-300"
              }`}
            >
              <FileText className="h-4 w-4" />
              Post Title *
              {errors.title && (
                <span className="flex items-center text-red-400 text-xs ml-2">
                  <AlertCircle size={12} className="mr-1" /> Required
                </span>
              )}
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title..."
              className={`w-full p-3 rounded-lg bg-gray-900/50 text-white placeholder:text-gray-500 font-mono transition-all border ${
                errors.title
                  ? "border-red-500 focus:ring-2 focus:ring-red-400/40"
                  : "border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              }`}
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label
              className={`flex items-center gap-2 text-sm font-mono ${
                errors.slug ? "text-red-400" : "text-cyan-300"
              }`}
            >
              <Terminal className="h-4 w-4" />
              URL Slug *
              {errors.slug && (
                <span className="flex items-center text-red-400 text-xs ml-2">
                  <AlertCircle size={12} className="mr-1" /> Required
                </span>
              )}
            </label>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="unique-slug-here"
              className={`w-full p-3 rounded-lg bg-gray-900/50 text-white placeholder:text-gray-500 font-mono transition-all border ${
                errors.slug
                  ? "border-red-500 focus:ring-2 focus:ring-red-400/40"
                  : "border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              }`}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-mono text-cyan-300">
              <FileText className="h-4 w-4" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your post..."
              className="w-full p-3 border border-cyan-500/30 rounded-lg bg-gray-900/50 text-white placeholder:text-gray-500 font-mono transition-all resize-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              rows={3}
            />
          </div>

          {/* Author & Read Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-mono text-cyan-300">
                <User className="h-4 w-4" />
                Author
              </label>
              <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author name"
                className="w-full p-3 border border-cyan-500/30 rounded-lg bg-gray-900/50 text-white placeholder:text-gray-500 font-mono transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-mono text-cyan-300">
                <Clock className="h-4 w-4" />
                Read Time
              </label>
              <input
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder="5 min read"
                className="w-full p-3 border border-cyan-500/30 rounded-lg bg-gray-900/50 text-white placeholder:text-gray-500 font-mono transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-mono text-cyan-300">
              <Tag className="h-4 w-4" />
              Tags (comma-separated)
            </label>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="linux, security, web"
              className="w-full p-3 border border-cyan-500/30 rounded-lg bg-gray-900/50 text-white placeholder:text-gray-500 font-mono transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label
              className={`flex items-center gap-2 text-sm font-mono ${
                errors.content ? "text-red-400" : "text-cyan-300"
              }`}
            >
              <Terminal className="h-4 w-4" />
              Post Content (Markdown) *
              {errors.content && (
                <span className="flex items-center text-red-400 text-xs ml-2">
                  <AlertCircle size={12} className="mr-1" /> Required
                </span>
              )}
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              className={`w-full p-3 rounded-lg bg-gray-900/50 text-white placeholder:text-gray-500 font-mono transition-all resize-none border ${
                errors.content
                  ? "border-red-500 focus:ring-2 focus:ring-red-400/40"
                  : "border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              }`}
              rows={12}
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-950/20 to-blue-950/20 border border-cyan-500/30 rounded-lg">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-3 h-3s accent-cyan-500 cursor-pointer"
              id="featured"
            />
            <label
              htmlFor="featured"
              className="flex items-center gap-2 text-sm font-mono text-cyan-300 cursor-pointer"
            >
              <Shield className="h-4 w-4 text-cyan-400" />
              Mark as featured post
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="group flex-1 rounded-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono font-semibold rounded-full hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/50 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
            >
              <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              Publish
            </button>
			 {/* ✅ Added Clear Form button */}
            <button
              type="button"
              onClick={handleClear}
              className="group flex-1 rounded-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 font-mono font-semibold hover:from-gray-700 hover:to-gray-800 border border-gray-600/50 shadow-md shadow-gray-800/30 hover:shadow-gray-600/50 transition-all"
            >
              <XCircle className="h-5 w-5 text-red-400 group-hover:rotate-90 transition-transform" />
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
