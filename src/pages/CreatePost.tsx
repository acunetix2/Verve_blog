import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
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
  category: string; // ✅ Added category
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
    category: "Uncategorized", // default
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const validateFields = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!formData.title.trim()) newErrors.title = true;
    if (!formData.slug.trim()) newErrors.slug = true;
    if (!formData.content.trim()) newErrors.content = true;
    if (!formData.category.trim()) newErrors.category = true; // validate category
    return newErrors;
  };

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
    } catch (error: any) {
      console.error(
        "Post creation failed:",
        error.response?.status,
        error.response?.data
      );
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleExit = () => navigate("/admin");

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
      category: "Uncategorized",
    });
    setErrors({});
    toast.info("Cleared.");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sohne:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=swap');
        
        * {
          font-family: 'Sohne', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Source Serif Pro', Georgia, Cambria, 'Times New Roman', Times, serif;
        }
        
        textarea, input[type="text"] {
          font-family: 'Sohne', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 pb-8 border-b border-gray-200">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create New Post
            </h1>
            <p className="text-base text-gray-600">Share your story with the world</p>
          </div>
          <button
            onClick={handleExit}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Exit
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <label
              className={`flex items-center gap-2 text-sm font-medium ${
                errors.title ? "text-red-600" : "text-gray-700"
              }`}
            >
              <FileText className="h-4 w-4" />
              Post Title *
              {errors.title && (
                <span className="flex items-center text-red-600 text-xs ml-2">
                  <AlertCircle size={12} className="mr-1" /> Required
                </span>
              )}
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title..."
              className={`w-full p-4 rounded-md bg-white text-gray-900 placeholder:text-gray-400 transition-all border text-lg ${
                errors.title
                  ? "border-red-500 focus:ring-2 focus:ring-red-400/40 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              } outline-none`}
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label
              className={`flex items-center gap-2 text-sm font-medium ${
                errors.slug ? "text-red-600" : "text-gray-700"
              }`}
            >
              <Terminal className="h-4 w-4" />
              URL Slug *
              {errors.slug && (
                <span className="flex items-center text-red-600 text-xs ml-2">
                  <AlertCircle size={12} className="mr-1" /> Required
                </span>
              )}
            </label>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="unique-slug-here"
              className={`w-full p-4 rounded-md bg-white text-gray-900 placeholder:text-gray-400 transition-all border ${
                errors.slug
                  ? "border-red-500 focus:ring-2 focus:ring-red-400/40 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              } outline-none`}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your post..."
              className="w-full p-4 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 transition-all resize-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none"
              rows={3}
            />
          </div>

          {/* Author & Read Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4" />
                Author
              </label>
              <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author name"
                className="w-full p-4 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4" />
                Read Time
              </label>
              <input
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder="5 min read"
                className="w-full p-4 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label
              className={`flex items-center gap-2 text-sm font-medium ${
                errors.category ? "text-red-600" : "text-gray-700"
              }`}
            >
              <Shield className="h-4 w-4" />
              Category *
              {errors.category && (
                <span className="flex items-center text-red-600 text-xs ml-2">
                  <AlertCircle size={12} className="mr-1" /> Required
                </span>
              )}
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none text-lg"
            >
              <option value="Uncategorized">Uncategorized</option>
              <option value="Web Exploitation">Web Exploitation</option>
              <option value="Binary Exploitation">Binary Exploitation</option>
              <option value="Reverse Engineering">Reverse Engineering</option>
              <option value="Cryptography">Cryptography</option>
              <option value="Forensics">Forensics</option>
              <option value="Network Security">Network Security</option>
              <option value="Malware Analysis">Malware Analysis</option>
              <option value="Penetration Testing">Penetration Testing</option>
              <option value="CTF Writeups">CTF Writeups</option>
              <option value="Vulnerability Research">Vulnerability Research</option>
              <option value="Cloud Security">Cloud Security</option>
              <option value="Wireless Security">Wireless Security</option>
              <option value="Database Security">Database Security</option>
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag className="h-4 w-4" />
              Tags (comma-separated)
            </label>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="linux, security, web"
              className="w-full p-4 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label
              className={`flex items-center gap-2 text-sm font-medium ${
                errors.content ? "text-red-600" : "text-gray-700"
              }`}
            >
              <Terminal className="h-4 w-4" />
              Post Content (Markdown) *
              {errors.content && (
                <span className="flex items-center text-red-600 text-xs ml-2">
                  <AlertCircle size={12} className="mr-1" /> Required
                </span>
              )}
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              className={`w-full p-4 rounded-md bg-white text-gray-900 placeholder:text-gray-400 transition-all resize-none border ${
                errors.content
                  ? "border-red-500 focus:ring-2 focus:ring-red-400/40 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              } outline-none text-lg leading-relaxed`}
              rows={14}
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 accent-gray-900 cursor-pointer"
              id="featured"
            />
            <label
              htmlFor="featured"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
            >
              <Shield className="h-4 w-4 text-gray-600" />
              Mark as featured post
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="group flex-1 flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-all shadow-sm"
            >
              <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              Publish
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="group flex-1 flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-700 font-medium rounded-full hover:bg-gray-50 border border-gray-300 hover:border-gray-400 transition-all"
            >
              <XCircle className="h-5 w-5 text-red-500 group-hover:rotate-90 transition-transform" />
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
