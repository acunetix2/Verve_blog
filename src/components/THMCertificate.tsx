/**
 * TryHackMe-Style Certificate Display Component
 * Professional certificate display like TryHackMe path certificates
 */

import React, { useEffect, useState } from 'react';
import { Download, Share2, Award, Calendar, Trophy, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

interface Certificate {
  _id: string;
  userId: string;
  roomId: string;
  roomTitle: string;
  userName: string;
  earnedDate: Date;
  certificateNumber: string;
  issuer: string;
  badge?: string;
  points: number;
}

export default function THMCertificate() {
  const navigate = useNavigate();
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (certificateId) {
      fetchCertificate();
    }
  }, [certificateId]);

  const fetchCertificate = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/certificates/${certificateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCertificate(res.data);
    } catch (error) {
      console.error('Failed to fetch certificate:', error);
      toast.error('Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      // Generate PDF or image download
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/certificates/${certificateId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificate?.roomTitle}_Certificate.pdf`;
      link.click();
      toast.success('Certificate downloaded successfully');
    } catch (error) {
      console.error('Failed to download certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/certificates/${certificateId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Certificate',
          text: `I just earned a certificate for ${certificate?.roomTitle} on Verve Hub Academy!`,
          url: shareUrl
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Certificate link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading certificate...</div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Certificate not found</p>
          <button
            onClick={() => navigate('/profile')}
            className="text-orange-400 hover:text-orange-300 font-medium"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Certificate Display */}
        <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur border-2 border-yellow-600/30 rounded-2xl p-12 mb-8 certificate-paper">
          {/* Certificate Content */}
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Certificate of Achievement
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto"></div>
            </div>

            {/* Body */}
            <div className="space-y-8 py-12">
              <p className="text-gray-300 text-lg">This certificate is proudly presented to</p>

              <div className="border-b-2 border-yellow-600/50 pb-2">
                <h2 className="text-5xl font-bold text-white">{certificate.userName}</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300 text-lg">
                  For successfully completing the room
                </p>
                <h3 className="text-3xl font-bold text-orange-400">{certificate.roomTitle}</h3>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-yellow-600/30">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Earned</p>
                  <p className="text-white font-semibold">
                    {new Date(certificate.earnedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <Trophy className="text-yellow-400 mx-auto mb-1" size={32} />
                  <p className="text-white font-semibold">{certificate.points} Points</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Certificate ID</p>
                  <p className="text-white font-mono text-sm">{certificate.certificateNumber}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-yellow-600/30">
                <p className="text-gray-400 italic">
                  Issued by {certificate.issuer}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end pt-8 border-t border-yellow-600/30">
              <div className="text-left">
                <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 mb-2"></div>
                <p className="text-gray-400 text-sm">Authorized Signature</p>
              </div>
              <Award className="text-yellow-400" size={48} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            <Download size={20} /> Download Certificate
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition border border-gray-700"
          >
            <Share2 size={20} /> Share
          </button>
        </div>

        {/* Certificate Info */}
        <div className="mt-12 bg-gray-800/30 backdrop-blur border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Certificate Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Room Title</p>
              <p className="text-white font-semibold">{certificate.roomTitle}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Earned Points</p>
              <p className="text-white font-semibold">{certificate.points}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Completion Date</p>
              <p className="text-white font-semibold">
                {new Date(certificate.earnedDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Certificate #</p>
              <p className="text-white font-semibold font-mono">{certificate.certificateNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .certificate-paper {
          background: linear-gradient(135deg, rgba(217, 119, 6, 0.1) 0%, rgba(234, 179, 8, 0.05) 50%, rgba(217, 119, 6, 0.1) 100%);
          box-shadow: 0 25px 50px rgba(234, 179, 8, 0.15);
        }

        @media print {
          body {
            background: white;
          }
          .certificate-paper {
            box-shadow: none;
            page-break-after: avoid;
          }
        }
      `}</style>
    </div>
  );
}

// Certificate List Component
export function CertificatesList() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/certificates`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCertificates(res.data || []);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">My Certificates</h2>
      {loading ? (
        <p className="text-gray-400">Loading certificates...</p>
      ) : certificates.length === 0 ? (
        <p className="text-gray-400">
          You haven't earned any certificates yet. Complete rooms to earn certificates!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              onClick={() => navigate(`/certificates/${cert._id}`)}
              className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-lg p-4 cursor-pointer hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white">{cert.roomTitle}</h3>
                  <p className="text-sm text-gray-400">
                    Earned {new Date(cert.earnedDate).toLocaleDateString()}
                  </p>
                </div>
                <Award className="text-yellow-400" size={24} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
