import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Download, Share2, Award, Calendar, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';
import CertificateDisplay from '../components/CertificateDisplay';

interface Certificate {
  _id: string;
  courseTitle: string;
  userName: string;
  certificateNumber: string;
  completionDate: string;
  totalQuizScore?: number;
  isDownloaded?: boolean;
  downloadedAt?: string;
  verificationCode?: string;
}

const UserCertificates: React.FC = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token] = useState<string | null>(localStorage.getItem('token'));
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const fontStyle = {
    fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
    fontSize: "0.8125rem",
  };

  const smallFontStyle = {
    fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
    fontSize: "0.75rem",
  };

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/user/all-certificates`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Certificates response:", response.data);
        // Handle both formats: direct array or { success, certificates }
        const certsData = Array.isArray(response.data) 
          ? response.data 
          : response.data.certificates || [];
        setCertificates(certsData);
      } catch (error: any) {
        console.error('Failed to load certificates - Full error:', error);
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
        const errorMsg = error.response?.data?.message || error.message || 'Failed to load certificates';
        setError(errorMsg);
        setCertificates([]);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCerts();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleViewCertificate = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setShowCertificateModal(true);
  };

  const handleShare = async (certificate: Certificate) => {
    try {
      const shareText = `I just completed "${certificate.courseTitle}" course at Verve Academy! Certificate #${certificate.certificateNumber}. Verification: ${certificate.verificationCode}`;

      if (navigator.share) {
        await navigator.share({
          title: 'Verve Academy Certificate',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Certificate details copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <button
            onClick={() => navigate('/v/my-progress')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 text-xs"
          >
            <ArrowLeft size={16} />
            <span>Back to Progress</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-amber-500" size={32} />
            <h1 style={fontStyle} className="text-3xl font-bold text-gray-900">
              My Certificates
            </h1>
          </div>
          <p style={smallFontStyle} className="text-gray-700">
            View and share all your earned Verve Academy certificates
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {error ? (
          <div className="text-center py-12 bg-red-100 border border-red-300 rounded-lg">
            <div className="inline-block p-3 bg-red-200 rounded-full mb-4">
              <Award className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-red-900 mb-2">Unable to Load Certificates</h2>
            <p className="text-red-700 text-xs mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-xs"
            >
              Try Again
            </button>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-12">
            <Award className="mx-auto text-gray-400 w-16 h-16 mb-4 opacity-50" />
            <p style={fontStyle} className="text-gray-600 mb-4">
              No certificates yet. Complete courses to earn credentials!
            </p>
            <button
              onClick={() => navigate('/v/courses')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition text-xs"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
                <div style={smallFontStyle} className="text-gray-700 mb-2">
                  Certificates Earned
                </div>
                <div style={fontStyle} className="text-3xl font-bold text-gray-900">
                  {certificates.length}
                </div>
              </div>
              <div className="bg-green-50 border border-green-300 rounded-lg p-6">
                <div style={smallFontStyle} className="text-gray-700 mb-2">
                  Latest Achievement
                </div>
                <div style={fontStyle} className="text-gray-900 font-semibold truncate">
                  {certificates[0]?.courseTitle || 'N/A'}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-6">
                <div style={smallFontStyle} className="text-gray-700 mb-2">
                  Average Score
                </div>
                <div style={fontStyle} className="text-3xl font-bold text-amber-600">
                  {certificates.length > 0
                    ? Math.round(
                        certificates.reduce((sum, cert) => sum + (cert.totalQuizScore || 0), 0) /
                          certificates.length
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>

            {/* Certificates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((certificate) => (
                <div
                  key={certificate._id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition group"
                >
                  {/* Badge Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:shadow-yellow-500/50 transition">
                        <span className="text-2xl">★</span>
                      </div>
                      <div>
                        <div style={fontStyle} className="text-white font-bold">
                          <BadgeCheck className="inline mr-2 text-green-400" size={18} />
                          Verified
                        </div>
                        <div style={smallFontStyle} className="text-slate-400">
                          Verve Academy
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <p style={smallFontStyle} className="text-slate-400 mb-1">
                        Course
                      </p>
                      <p style={fontStyle} className="text-white font-semibold">
                        {certificate.courseTitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p style={smallFontStyle} className="text-slate-400 mb-1">
                          Certificate No
                        </p>
                        <p style={smallFontStyle} className="text-slate-300 font-mono">
                          {certificate.certificateNumber}
                        </p>
                      </div>
                      <div>
                        <p style={smallFontStyle} className="text-slate-400 mb-1">
                          Quiz Score
                        </p>
                        <p style={fontStyle} className="text-green-400 font-bold">
                          {certificate.totalQuizScore || 'N/A'}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={16} />
                        <p style={smallFontStyle}>
                          {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => handleViewCertificate(certificate)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition text-sm"
                    >
                      <span style={fontStyle}>View</span>
                    </button>
                    <button
                      onClick={() => handleShare(certificate)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded transition flex items-center justify-center gap-2"
                    >
                      <Share2 size={16} />
                      <span style={fontStyle}>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateDisplay
          certificate={selectedCertificate}
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </div>
  );
};

export default UserCertificates;
