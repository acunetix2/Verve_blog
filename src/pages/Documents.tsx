
import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeContext";
import axios from "axios";
import {
  FileText,
  Download,
  Eye,
  Loader2,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Search,
  Shield,
  Lock,
  Terminal,
  Bug,
  Globe,
  Database,
  Network,
  Code,
  Server,
  Wifi,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Document {
  _id: string;
  title: string;
  description?: string;
  fileName: string;
  uploadedAt: string;
  category: string;
}

const DOCUMENT_CATEGORIES = [
  "All",
  "Uncategorized",
  "Web Exploitation",
  "Binary Exploitation",
  "Reverse Engineering",
  "Cryptography",
  "Forensics",
  "Network Security",
  "Malware Analysis",
  "Penetration Testing",
  "CTF Writeups",
  "Vulnerability Research",
  "Cloud Security",
  "Wireless Security",
  "Database Security",
];

const categoryIcons: Record<string, any> = {
  "All": Globe,
  "Web Exploitation": Globe,
  "Binary Exploitation": Terminal,
  "Reverse Engineering": Code,
  "Cryptography": Lock,
  "Forensics": Eye,
  "Network Security": Network,
  "Malware Analysis": Bug,
  "Penetration Testing": Shield,
  "CTF Writeups": FileText,
  "Vulnerability Research": AlertCircle,
  "Cloud Security": Server,
  "Wireless Security": Wifi,
  "Database Security": Database,
  "Uncategorized": FileText
};

const Documents: React.FC = () => {
  const { actualTheme } = useTheme();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/documents`);
        setDocuments(res.data);
      } catch {
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

  const getSignedUrl = async (docId: string) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/documents/download/${docId}`);
      return res.data.downloadUrl;
    } catch {
      setMessage({ type: "error", text: "Failed to get download URL!" });
      return null;
    }
  };

  const handlePreview = async (docId: string) => {
    const url = await getSignedUrl(docId);
    if (url) setPreviewDoc(url);
  };

  const handleDownload = async (docId: string) => {
    const url = await getSignedUrl(docId);
    if (url) window.open(url, "_blank");
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${
      actualTheme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50 text-slate-900'
    }`} style={{ fontFamily: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {message && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 
                      border transition-all duration-300 animate-in slide-in-from-top-5 ${
                        message.type === "success"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-2 hover:opacity-70 transition">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h2 className={`${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'} text-4xl font-bold mb-3`}>
            Learning Resources
          </h2>
          <p className={`${actualTheme === 'dark' ? 'text-slate-300' : 'text-gray-600'} text-lg max-w-2xl mx-auto`}>
            Access cybersecurity documents, guides, and educational materials
          </p>
        </div>

        {/* Search Bar */}
        <div className={`rounded-2xl border shadow-lg p-6 mb-8 transition-colors ${actualTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${actualTheme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search documents by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 h-14 rounded-xl text-base transition-colors ${actualTheme === 'dark' ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20' : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`}
            />
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-6">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-lg">Browse by Category</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {DOCUMENT_CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat] || FileText;
              const isActive = selectedCategory === cat;
              
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-lg text-gray-900">
            {filteredDocuments.length === 0 ? (
              <span className="text-gray-500">No documents found</span>
            ) : (
              <>
                <span className="font-bold text-blue-600">{filteredDocuments.length}</span>{" "}
                <span className="text-gray-700">
                  {filteredDocuments.length === 1 ? "document" : "documents"}
                </span>
                {selectedCategory !== "All" && (
                  <span className="text-gray-500"> in {selectedCategory}</span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              <FileText className="absolute h-6 w-6 text-blue-600" />
            </div>
            <p className="text-gray-700 font-medium">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-200 shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Documents</h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No documents found</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Try adjusting your search criteria or selecting a different category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => {
              const Icon = categoryIcons[doc.category] || FileText;
              
              return (
                <div
                  key={doc._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  {/* Card Header with gradient */}
                  <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"></div>
                  
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Icon and Title */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {doc.title}
                        </h3>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg mb-3">
                      <Cpu className="w-3.5 h-3.5" />
                      {doc.category}
                    </div>

                    {/* Description */}
                    {doc.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {doc.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handlePreview(doc._id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>

                      <button
                        onClick={() => handleDownload(doc._id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-xl transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Preview Modal */}
        {previewDoc && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute top-4 right-4 z-50">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <iframe src={previewDoc} className="w-full h-full" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Documents;