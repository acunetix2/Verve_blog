import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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

  // ✅ Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Unauthorized access! Please log in as admin.");
      navigate("/admin");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

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
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication required.");
        navigate("/admin");
        return;
      }

      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      await axios.post(`${API_BASE_URL}/posts`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("✅ Post published successfully!");
      navigate("/");
    } catch (error) {
      console.error("Post creation failed:", error);
      toast.error("⚠ Something went wrong while publishing the post.");
    }
  };

  const handleExit = () => navigate("/");

  if (!isAuthenticated) return null; // prevents flicker before auth check

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border border-gray-200 rounded-lg shadow-sm bg-card">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Create New Blog Post
        </h1>
        <button
          onClick={handleExit}
          className="text-sm px-3 py-1.5 rounded border border-gray-300 text-muted-foreground hover:bg-muted transition-all"
        >
          ⬅ Exit
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Post title"
          className="w-full p-2 border rounded bg-input text-foreground"
          required
        />

        <input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="Unique slug (e.g. linux-basics)"
          className="w-full p-2 border rounded bg-input text-foreground"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short description..."
          className="w-full p-2 border rounded bg-input text-foreground"
          rows={2}
        />

        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Author name"
          className="w-full p-2 border rounded bg-input text-foreground"
        />

        <input
          name="readTime"
          value={formData.readTime}
          onChange={handleChange}
          placeholder="Estimated read time (e.g. 5 min read)"
          className="w-full p-2 border rounded bg-input text-foreground"
        />

        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma-separated)"
          className="w-full p-2 border rounded bg-input text-foreground"
        />

        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your post content (Markdown supported)"
          className="w-full p-2 border rounded bg-input text-foreground"
          rows={8}
          required
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="accent-primary"
          />
          <label htmlFor="featured" className="text-sm text-muted-foreground">
            Mark as featured post
          </label>
        </div>

        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-all"
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
