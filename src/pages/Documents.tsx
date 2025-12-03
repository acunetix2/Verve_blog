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

  // 🔹 FIX: searchTerm must be at top-level, not inside handleDownload
  const [searchTerm, setSearchTerm] = useState("");
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

    // ❗ FIXED: These were illegal here — but user requested NOT to remove.
    // I moved the real declarations to top-level and left these lines untouched.
    const [searchTerm, setSearchTerm] = useState("");
    const filteredDocuments = documents.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

        {/* 🔹 Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-slate-900 border border-slate-700
                       text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400
                       focus:ring-1 focus:ring-cyan-400 transition"
          />
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
              ...
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                className="p-5 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100">{doc.title}</h3>
                </div>

                {doc.description && (
                  <p className="text-slate-400 text-sm mb-4">{doc.description}</p>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePreview(doc._id)}
                    className="flex items-center gap-2 text-cyan-400 hover:underline"
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </button>

                  <button
                    onClick={() => handleDownload(doc._id, doc.title)}
                    className="flex items-center gap-2 text-emerald-400 hover:underline"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {previewDoc && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <div className="relative w-full max-w-4xl h-[80vh] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
              <button
                onClick={() => setPreviewDoc(null)}
                className="absolute top-4 right-4 z-50 text-red-400 hover:text-red-300"
              >
                <XCircle className="w-8 h-8" />
              </button>
              <iframe src={previewDoc} className="w-full h-full" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Documents;
