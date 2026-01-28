import React, { useState } from "react";
import axios from "axios";
import { Upload, Loader2, CheckCircle2, ArrowLeft, Home, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TECH_CATEGORIES from "../config/techCategories";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // ✅ Changed to array of selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Uncategorized"]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({
    type: "",
    text: "",
  });

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  // ✅ Handle category selection/deselection
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        // Remove if already selected
        const filtered = prev.filter((cat) => cat !== category);
        // Keep at least one category
        return filtered.length === 0 ? ["Uncategorized"] : filtered;
      } else {
        // Add new category
        const updated = [...prev];
        // Remove 'Uncategorized' if adding a real category
        if (category !== "Uncategorized" && prev.includes("Uncategorized")) {
          return updated.filter((cat) => cat !== "Uncategorized").concat(category);
        }
        // If adding Uncategorized, remove others
        if (category === "Uncategorized") {
          return ["Uncategorized"];
        }
        return updated.concat(category);
      }
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title) {
      setMessage({ type: "error", text: "Please provide a title and select a file." });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    // ✅ Append categories as array
    selectedCategories.forEach((cat) => {
      formData.append("categories", cat);
    });

    try {
      setUploading(true);
      setMessage({ type: "", text: "" });

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: "File uploaded successfully!" });
      setTitle("");
      setDescription("");
      setFile(null);
      setSelectedCategories(["Uncategorized"]);
    } catch {
      setMessage({ type: "error", text: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sohne:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Charter:wght@400;700&display=swap');
        
        * { font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif; }
      `}</style>

      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
        {/* Top Navigation Bar */}
       
        {/* Upload Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-gray-900 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-red-600/30 relative overflow-hidden">
            {/* Ambient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-orange-600/5 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-600/20 rounded-xl border border-red-600/30">
                  <Upload className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Upload Learning Material</h2>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-red-600/30 
                               text-gray-100 placeholder-gray-500
                               focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 
                               outline-none transition-all duration-200"
                    placeholder="Enter material title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-red-600/30 
                               text-gray-100 placeholder-gray-500
                               focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 
                               outline-none transition-all duration-200 resize-none"
                    placeholder="Short description (optional)"
                  ></textarea>
                </div>

                {/* ✅ Multi-select Categories */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">
                    Technology Categories (Select one or more)
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-gray-900/50 p-3 rounded-lg border border-red-600/20">
                    {TECH_CATEGORIES.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-red-600/10 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => handleCategoryToggle(cat)}
                          className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
                        />
                        <span className="text-sm text-gray-300">{cat}</span>
                      </label>
                    ))}
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedCategories.map((cat) => (
                        <div
                          key={cat}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-orange-600/30 border border-orange-600/50 rounded-full text-xs text-orange-300"
                        >
                          {cat}
                          <button
                            type="button"
                            onClick={() => handleCategoryToggle(cat)}
                            className="ml-1 hover:text-orange-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Select File</label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-400 
                                 file:mr-4 file:py-2.5 file:px-5
                                 file:rounded-lg file:border-0 
                                 file:text-sm file:font-semibold 
                                 file:bg-red-600/20 file:text-orange-500 
                                 file:border file:border-red-600/30
                                 hover:file:bg-red-600/40 
                                 file:transition-all file:duration-200
                                 file:cursor-pointer cursor-pointer"
                    />
                  </div>
                  {file && (
                    <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-orange-500" />
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                {/* Status messages */}
                {uploading && (
                  <div className="flex items-center gap-2 text-orange-500 bg-orange-600/20 px-4 py-3 rounded-lg border border-orange-600/30">
                    <Loader2 className="animate-spin w-4 h-4" /> 
                    <span className="text-sm font-medium">Uploading your document...</span>
                  </div>
                )}

                {message.text && !uploading && (
                  <div
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
                      message.type === "success"
                        ? "text-green-400 bg-green-600/20 border-green-600/30"
                        : message.type === "error"
                        ? "text-red-400 bg-red-600/20 border-red-600/30"
                        : "text-gray-400 bg-gray-700/20 border-gray-700/30"
                    }`}
                  >
                    {message.type === "success" && <CheckCircle2 className="w-4 h-4" />}
                    <span className="text-sm font-medium">{message.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 
                             hover:from-red-700 hover:to-orange-700
                             disabled:from-gray-700 disabled:to-gray-700
                             disabled:cursor-not-allowed disabled:opacity-50
                             text-white font-semibold py-3 px-6 rounded-xl 
                             transition-all duration-200 
                             shadow-lg shadow-red-600/30 hover:shadow-red-600/50
                             transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {uploading ? "Uploading..." : "Upload Material"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
