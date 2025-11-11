import React, { useState } from "react";
import axios from "axios";
import { Upload, Loader2, CheckCircle2, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({
    type: "",
    text: "",
  });

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
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

    try {
      setUploading(true);
      setMessage({ type: "", text: "" });

      await axios.post("http://localhost:5000/api/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: "File uploaded successfully!" });
      setTitle("");
      setDescription("");
      setFile(null);
    } catch {
      setMessage({ type: "error", text: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="w-full bg-slate-900/50 backdrop-blur-sm border-b border-cyan-500/20 px-6 py-4 flex justify-between items-center">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent cursor-pointer flex items-center gap-2 hover:opacity-80 transition"
        >
          <Home className="w-5 h-5 text-cyan-400" /> Verve Hub
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </header>

      {/* Upload Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-cyan-500/20 relative overflow-hidden">
          {/* Ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Upload className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100">
                Upload Learning Material
              </h2>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 
                             text-slate-100 placeholder-slate-500
                             focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 
                             outline-none transition-all duration-200"
                  placeholder="Enter material title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 
                             text-slate-100 placeholder-slate-500
                             focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 
                             outline-none transition-all duration-200 resize-none"
                  placeholder="Short description (optional)"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Select File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-400 
                               file:mr-4 file:py-2.5 file:px-5
                               file:rounded-lg file:border-0 
                               file:text-sm file:font-semibold 
                               file:bg-cyan-500/10 file:text-cyan-400 
                               file:border file:border-cyan-500/20
                               hover:file:bg-cyan-500/20 
                               file:transition-all file:duration-200
                               file:cursor-pointer cursor-pointer"
                  />
                </div>
                {file && (
                  <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    Selected: {file.name}
                  </p>
                )}
              </div>

              {/* Status messages */}
              {uploading && (
                <div className="flex items-center gap-2 text-cyan-400 bg-cyan-500/10 px-4 py-3 rounded-lg border border-cyan-500/20">
                  <Loader2 className="animate-spin w-4 h-4" /> 
                  <span className="text-sm font-medium">Uploading your document...</span>
                </div>
              )}
              
              {message.text && !uploading && (
                <div
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
                    message.type === "success"
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      : message.type === "error"
                      ? "text-red-400 bg-red-500/10 border-red-500/20"
                      : "text-slate-400 bg-slate-500/10 border-slate-500/20"
                  }`}
                >
                  {message.type === "success" && <CheckCircle2 className="w-4 h-4" />}
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 
                           hover:from-cyan-400 hover:to-blue-400
                           disabled:from-slate-700 disabled:to-slate-700
                           disabled:cursor-not-allowed disabled:opacity-50
                           text-white font-semibold py-3 px-6 rounded-xl 
                           transition-all duration-200 
                           shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30
                           transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {uploading ? "Uploading..." : "Upload Material"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;