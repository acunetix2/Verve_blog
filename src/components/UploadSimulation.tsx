import React, { useState } from "react";

export default function UploadSimulation() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an HTML file to upload");
      return;
    }
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/simulations`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      
      alert("Simulation uploaded successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload simulation.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-xl font-medium text-white" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              Upload Attack Simulation
            </h1>
            <p className="text-blue-100 text-sm mt-1" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              Share your simulation with the community
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                Simulation Title
              </label>
              <input
                type="text"
                className="w-full px-4 text-gray-700 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., SQL Injection Attack Demo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                Description
              </label>
              <textarea
                className="w-full px-4 py-2.5 text-gray-700 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your simulation demonstrates..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                HTML File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".html"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              {file && (
                <p className="mt-2 text-xs text-gray-500" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Selected: {file.name}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isUploading || !title || !description || !file}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                {isUploading ? "Uploading..." : "Upload Simulation"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-gray-500 mt-6" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Make sure your HTML file is safe and follows community guidelines
        </p>
      </div>
    </div>
  );
}