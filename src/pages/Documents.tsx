
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
import TECH_CATEGORIES from "../config/techCategories";

interface Document {
  _id: string;
  title: string;
  description?: string;
  fileName: string;
  uploadedAt: string;
  category?: string; // legacy single category
  categories?: string[]; // ✅ new array of categories
}

// ✅ Use tech categories instead
const DOCUMENT_CATEGORIES = ["All", ...TECH_CATEGORIES];

const categoryIcons: Record<string, any> = {
  "All": Globe,
  // Networking & Infrastructure
  "Computer Networking": Network,
  "Network Security": Network,
  "Wireless Security": Wifi,
  "Network Administration": Network,
  
  // Cybersecurity & Security
  "Cyber Security": Shield,
  "Web Security": Globe,
  "Application Security": Terminal,
  "Cloud Security": Server,
  "Database Security": Database,
  "Cryptography": Lock,
  
  // Exploitation & Testing
  "Web Exploitation": Globe,
  "Binary Exploitation": Terminal,
  "Penetration Testing": Shield,
  "Vulnerability Research": AlertCircle,
  "Vulnerability Assessment": AlertCircle,
  
  // System & Analysis
  "Reverse Engineering": Code,
  "Malware Analysis": Bug,
  "Forensics": Eye,
  "Incident Response": AlertCircle,
  
  // Other
  "CTF Writeups": FileText,
  "Red Teaming": Shield,
  "Blue Teaming": Shield,
  "Social Engineering": AlertCircle,
  "DevSecOps": Terminal,
  "API Security": Globe,
  "Mobile Security": Terminal,
  "IoT Security": Network,
  "Blockchain Security": Lock,
  "Infrastructure Security": Server,
  "Linux Security": Terminal,
  "Windows Security": Terminal,
  "General Security": Shield,
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
    
    // ✅ Support both new categories array and legacy category field
    let documentCategories = doc.categories || (doc.category ? [doc.category] : ["Uncategorized"]);
    const matchesCategory = selectedCategory === "All" || documentCategories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen w-full transition-colors duration-300 bg-gray-950 text-gray-100" style={{ fontFamily: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {message && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 
                      border transition-all duration-300 animate-in slide-in-from-top-5 ${
                        message.type === "success"
                          ? "bg-green-900/40 text-green-400 border-green-600/50"
                          : "bg-red-900/40 text-red-400 border-red-600/50"
                      }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-2 hover:opacity-70 transition">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        {/* Header */}
        <div className="text-left mb-10 py-2">
          <h2 className="text-white text-3xl font-bold mb-3">
            Learning Resources
          </h2>
          <p className="text-gray-300 text-lg max-w-1xl mx-auto">
            Access cybersecurity documents, guides, and educational materials
          </p>
        </div>

        {/* Search Bar */}
        <div className="rounded-2xl border border-red-600/30 shadow-lg p-4 mb-8 transition-colors bg-gray-900">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-10 text-base transition-colors bg-gray-800 border border-red-600/30 text-gray-100 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20 focus:ring-2 rounded-lg"
            />
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-gray-900 rounded-2xl border border-red-600/30 shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-white mb-6">
            <Shield className="h-5 w-5 text-red-500" />
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
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:border-red-600/50"
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
          <p className="text-lg text-gray-300">
            {filteredDocuments.length === 0 ? (
              <span className="text-gray-500">No documents found</span>
            ) : (
              <>
                <span className="font-bold text-red-500">{filteredDocuments.length}</span>{" "}
                <span className="text-gray-300">
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
              <div className="w-16 h-16 border-4 border-gray-800 border-t-red-600 rounded-full animate-spin"></div>
              <FileText className="absolute h-6 w-6 text-red-600" />
            </div>
            <p className="text-gray-400 font-medium">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="bg-gray-900 rounded-2xl border border-red-600/30 shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/40 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Error Loading Documents</h3>
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl border border-red-600/30 shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-6">
              <FileText className="h-10 w-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">No documents found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Try adjusting your search criteria or selecting a different category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {filteredDocuments.map((doc) => {
              // ✅ Support both new and legacy category fields
              const documentCategories = doc.categories || (doc.category ? [doc.category] : ["Uncategorized"]);
              const primaryCategory = documentCategories[0] || "Uncategorized";
              const Icon = categoryIcons[primaryCategory] || FileText;
              
              return (
                <div
                  key={doc._id}
                  className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-red-600/20 hover:border-red-600/50 transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full"
                >
                  {/* Card Header with gradient */}
                  <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 flex-shrink-0"></div>
                  
                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Icon and Title */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-900/30 rounded-xl flex items-center justify-center border border-red-600/30 flex-shrink-0">
                        <Icon className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                          {doc.title}
                        </h3>
                      </div>
                    </div>

                    {/* ✅ Category Badges (show all categories) */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {documentCategories.map((cat) => (
                        <div key={cat} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 text-red-500 text-xs font-medium rounded-lg border border-red-600/30">
                          <Cpu className="w-3.5 h-3.5" />
                          {cat}
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    {doc.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                        {doc.description}
                      </p>
                    )}

                    {/* Spacer to push buttons to bottom */}
                    <div className="flex-grow"></div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-700 mt-4">
                      <button
                        onClick={() => handlePreview(doc._id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-orange-500 font-medium rounded-xl border border-orange-500/30 hover:border-orange-500/50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>

                      <button
                        onClick={() => handleDownload(doc._id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
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
            <div className="relative w-full max-w-5xl h-[85vh] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-red-600/30">
              <div className="absolute top-4 right-4 z-50">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 bg-red-900/40 hover:bg-red-900/60 text-red-500 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <iframe src={previewDoc} className="w-full h-full bg-white" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Documents;