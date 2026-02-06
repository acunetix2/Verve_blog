import React, { useEffect, useState, useMemo } from "react";
import { FileText, Calendar, TrendingUp, Zap } from "lucide-react";

interface AnalyticsCardProps {
  endpoint: string;       // API endpoint for fetching documents
  timeframeDays?: number; // default: 7 days
}

interface Document {
  uploadedAt?: string;
  createdAt?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  endpoint,
  timeframeDays = 7,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch documents");
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [endpoint]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - timeframeDays * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentDocs = documents.filter(
      (d) => new Date(d.uploadedAt || "") > lastWeek
    ).length;

    const monthlyDocs = documents.filter(
      (d) => new Date(d.createdAt || "") > lastMonth
    ).length;

    const growthRate =
      documents.length > 0 ? ((recentDocs / documents.length) * 100).toFixed(1) : "0";

    return { recentDocs, monthlyDocs, growthRate };
  }, [documents, timeframeDays]);

  if (error) return <p className="text-red-500 text-xs" style={{ fontFamily: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>Failed to load document analytics.</p>;

  const fontStyle = {
    fontFamily: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: '0.8125rem'
  };

  const smallFontStyle = {
    fontFamily: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: '0.75rem'
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {/* Total Documents */}
      <div className="group bg-gradient-to-br from-gray-850 to-gray-900 rounded-2xl border border-red-600/25 overflow-hidden hover:border-red-600/60 hover:shadow-2xl transition-all shadow-lg hover:-translate-y-1">
        <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-red-600"></div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-orange-600/20">
                <FileText className="text-orange-500 w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-gray-400" style={smallFontStyle}>Total</span>
            </div>
            <span className="text-xs font-bold text-orange-400 bg-orange-600/20 px-2.5 py-1 rounded-md border border-orange-600/40">
              Active
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1.5">
              {loading ? "..." : documents.length.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400" style={smallFontStyle}>Overall Documents</p>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="group bg-gradient-to-br from-gray-850 to-gray-900 rounded-2xl border border-red-600/25 overflow-hidden hover:border-red-600/60 hover:shadow-2xl transition-all shadow-lg hover:-translate-y-1">
        <div className="h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-red-600"></div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-red-600/20">
                <Calendar className="text-red-500 w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-gray-400" style={smallFontStyle}>Latest</span>
            </div>
            <span className="text-xs font-bold text-red-400 bg-red-600/20 px-2.5 py-1 rounded-md border border-red-600/40">
              {timeframeDays}d
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1.5">
              {loading ? "..." : analytics.recentDocs.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400" style={smallFontStyle}>This week</p>
          </div>
        </div>
      </div>

      {/* Growth Rate */}
      <div className="group bg-gradient-to-br from-gray-850 to-gray-900 rounded-2xl border border-red-600/25 overflow-hidden hover:border-red-600/60 hover:shadow-2xl transition-all shadow-lg hover:-translate-y-1">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500"></div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-600/20">
                <TrendingUp className="text-amber-500 w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-gray-400" style={smallFontStyle}>Growth</span>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-600/20 px-2.5 py-1 rounded-md border border-amber-600/40">
              Rate
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1.5">
              {loading ? "..." : analytics.growthRate}%
            </p>
            <p className="text-xs text-gray-400" style={smallFontStyle}>Weekly</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="group bg-gradient-to-br from-gray-850 to-gray-900 rounded-2xl border border-red-600/25 overflow-hidden hover:border-red-600/60 hover:shadow-2xl transition-all shadow-lg hover:-translate-y-1">
        <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600"></div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-green-600/20">
                <Zap className="text-green-500 w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-gray-400" style={smallFontStyle}>SYSTEM</span>
            </div>
            <span className="text-xs font-bold text-green-400 bg-green-600/20 px-2.5 py-1 rounded-md border border-green-600/40">
              Status
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1.5">
              {loading ? "..." : "✓ Good"}
            </p>
            <p className="text-xs text-gray-400" style={smallFontStyle}>Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
