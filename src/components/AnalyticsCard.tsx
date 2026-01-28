import React, { useEffect, useState, useMemo } from "react";
import { FileText, Calendar, TrendingUp, Zap } from "lucide-react";

interface AnalyticsCardProps {
  endpoint: string;       // API endpoint for fetching documents
  timeframeDays?: number; // default: 7 days
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  endpoint,
  timeframeDays = 7,
}) => {
  const [documents, setDocuments] = useState<any[]>([]);
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

  if (error) return <p className="text-red-500">Failed to load document analytics.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Documents */}
      <div className="bg-gray-800 rounded-2xl border border-red-600/20 overflow-hidden hover:border-red-600/50 hover:shadow-lg transition-all shadow-lg">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-red-600"></div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="text-gray-500 w-4 h-4" />
              <span className="text-xs text-gray-400 font-medium">TOTAL</span>
            </div>
            <span className="text-xs text-orange-500 font-semibold bg-orange-900/20 px-2 py-0.5 rounded border border-orange-600/30">
              Active
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">
              {loading ? "..." : documents.length.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">All time documents</p>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-gray-800 rounded-2xl border border-red-600/20 overflow-hidden hover:border-red-600/50 hover:shadow-lg transition-all shadow-lg">
        <div className="h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-500 w-4 h-4" />
              <span className="text-xs text-gray-400 font-medium">RECENT</span>
            </div>
            <span className="text-xs text-red-400 font-semibold bg-red-900/20 px-2 py-0.5 rounded border border-red-600/30">
              {timeframeDays} days
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">
              {loading ? "..." : analytics.recentDocs.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">Documents this week</p>
          </div>
        </div>
      </div>

      {/* Growth Rate */}
      <div className="bg-gray-800 rounded-2xl border border-red-600/20 overflow-hidden hover:border-red-600/50 hover:shadow-lg transition-all shadow-lg">
        <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-500"></div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-gray-500 w-4 h-4" />
              <span className="text-xs text-gray-400 font-medium">GROWTH</span>
            </div>
            <span className="text-xs text-orange-400 font-semibold bg-orange-900/20 px-2 py-0.5 rounded border border-orange-600/30">
              Rate
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">
              {loading ? "..." : analytics.growthRate}%
            </p>
            <p className="text-xs text-gray-400">Weekly performance</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-800 rounded-2xl border border-red-600/20 overflow-hidden hover:border-red-600/50 hover:shadow-lg transition-all shadow-lg">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="text-gray-500 w-4 h-4" />
              <span className="text-xs text-gray-400 font-medium">SYSTEM</span>
            </div>
            <span className="text-xs text-orange-400 font-semibold bg-orange-900/20 px-2 py-0.5 rounded border border-orange-600/30">
              Status
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">
              Optimal
            </p>
            <p className="text-xs text-gray-400">Ready to fetch documents</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
