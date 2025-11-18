import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Download,
  Eye,
  Loader2,
  ArrowLeft,
  Home,
  Upload,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Cpu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Document {
  _id: string;
  title: string;
  description?: string;
  fileName: string;
  uploadedAt: string;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/documents`);
        setDocuments(res.data);
      } catch (err) {
        setError("Failed to load documents. Try again later.");
        setMessage({ type: "error", text: "Failed to load documents!" });
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 🔹 Fetch presigned URL for download/preview
  const getSignedUrl = async (docId: string) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/documents/download/${docId}`);
      return res.data.downloadUrl;
    } catch (err) {
      setMessage({ type: "error", text: "Failed to get download URL!" });
      return null;
    }
  };

  const handlePreview = async (docId: string) => {
    const url = await getSignedUrl(docId);
    if (url) setPreviewDoc(url);
  };

  const handleDownload = async (docId: string, title: string) => {
  const url = await getSignedUrl(docId);
  if (!url) return;
  window.open(url, "_blank");
};

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col">		
      {message && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 
                      backdrop-blur-md border transition-all duration-300 animate-in slide-in-from-top-5 ${
                        message.type === "success"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-2 hover:opacity-70 transition">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      <main className="flex-1 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
            <FileText className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-100">Learning Resources</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <Loader2 className="animate-spin w-10 h-10 text-cyan-400 mb-4" />
            <p className="text-slate-400 text-sm">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20 mb-4">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-4">
              <FileText className="w-10 h-10 text-slate-500" />
            </div>
            <p className="text-slate-400 font-medium mb-2">No resources uploaded yet</p>
            <button
              onClick={() => navigate("/upload")}
              className="mt-4 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 
                         hover:from-cyan-400 hover:to-blue-400 px-4 py-2 rounded-lg 
                         text-white text-sm font-semibold transition-all duration-200"
            >
              <Upload className="w-4 h-4" /> Upload Your First Resource
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="bg-slate-900/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 
                           shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 
                           transform hover:-translate-y-1 hover:border-cyan-500/40 
                           relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-blue-500/0 
                                group-hover:from-cyan-500/5 group-hover:to-blue-500/5 
                                transition-all duration-300 pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-100 truncate flex-1 pr-2">{doc.title}</h3>
                    <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shrink-0">
                      <FileText className="text-cyan-400 w-5 h-5" />
                    </div>
                  </div>

                  <p className="text-sm text-cyan-400 mb-2 gap-2 line-clamp-2 min-h-[2.5rem]">
                    {doc.description || "No description provided."}
                  </p>              
                  <div className="flex items-center justify-between text-xs mb-4 pb-4 border-b border-slate-700/50">
                    <div className="flex items-center gap-2 text-green-500">
                      Uploaded on:
                      <span className="px-2 py-1 bg-slate-800/50 rounded-md">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                      <span className="text-green-600">•</span>
                      <span>{new Date(doc.uploadedAt).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePreview(doc._id)}
                      className="flex-1 flex items-center justify-center gap-2 
                                 bg-gradient-to-r from-cyan-500 to-blue-500 
                                 hover:from-cyan-400 hover:to-blue-400
                                 px-3 py-2 rounded-lg text-white text-sm font-medium 
                                 transition-all duration-200 shadow-lg shadow-cyan-500/20
                                 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Eye className="w-4 h-4" /> Preview
                    </button>

                    <button
                      onClick={() => handleDownload(doc._id, doc.title)}
                      className="flex items-center justify-center gap-2 
                                 bg-slate-800/50 hover:bg-slate-700/50 
                                 border border-slate-700/50 hover:border-cyan-500/30
                                 px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400 
                                 text-sm font-medium transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {previewDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 
                        animate-in fade-in duration-200">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl w-full max-w-5xl h-full md:h-auto 
                          p-6 flex flex-col border border-cyan-500/20 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700/50">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                Document Preview
              </h3>
              <button
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                onClick={() => setPreviewDoc(null)}
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <iframe
              src={previewDoc}
              className="flex-1 w-full border border-slate-700/50 rounded-xl bg-slate-950"
              style={{ minHeight: "70vh" }}
              title="Document Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
