import React, { useState } from 'react';
import { X, Download, Share2, Award } from 'lucide-react';
import { toast } from 'sonner';

interface Certificate {
  _id: string;
  courseTitle: string;
  userName: string;
  certificateNumber: string;
  completionDate: string;
  totalQuizScore?: number;
  isDownloaded?: boolean;
  downloadedAt?: string;
}

interface CertificateDisplayProps {
  certificate: Certificate | null;
  onClose: () => void;
  courseId?: string;
}

const CertificateDisplay: React.FC<CertificateDisplayProps> = ({
  certificate,
  onClose,
  courseId,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!certificate) return null;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Create a canvas-based certificate
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        toast.error('Failed to generate certificate');
        return;
      }

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 800);

      // Border
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, 1120, 720);

      // Inner decorative border
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 60, 1080, 680);

      // Badge/Medal decoration
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(600, 120, 50, 0, Math.PI * 2);
      ctx.fill();

      // Award star in center
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 60px "Google Sans", Arial';
      ctx.textAlign = 'center';
      ctx.fillText('★', 600, 140);

      // Certificate Title
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 48px "Google Sans", Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICATE OF COMPLETION', 600, 220);

      // Decorative line
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(300, 260);
      ctx.lineTo(900, 260);
      ctx.stroke();

      // Course Title
      ctx.fillStyle = '#e0e7ff';
      ctx.font = 'bold 32px "Google Sans", Arial';
      ctx.textAlign = 'center';
      ctx.fillText(certificate.courseTitle, 600, 340);

      // "is hereby awarded to" text
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '18px "Google Sans", Arial';
      ctx.textAlign = 'center';
      ctx.fillText('is hereby awarded to', 600, 390);

      // User Name
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 36px "Google Sans", Arial';
      ctx.textAlign = 'center';
      ctx.fillText(certificate.userName, 600, 450);

      // Decorative line under name
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(250, 470);
      ctx.lineTo(950, 470);
      ctx.stroke();

      // Achievement text
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px "Google Sans", Arial';
      ctx.textAlign = 'center';
      ctx.fillText('For successfully completing all modules and assessments', 600, 520);

      // Certificate number and score
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px "Google Sans", Arial';
      ctx.textAlign = 'left';
      const completionDate = new Date(certificate.completionDate).toLocaleDateString();
      ctx.fillText(`Certificate No: ${certificate.certificateNumber}`, 150, 600);
      ctx.fillText(`Completion Date: ${completionDate}`, 150, 640);

      // Score
      ctx.textAlign = 'right';
      ctx.fillText(`Average Quiz Score: ${certificate.totalQuizScore}%`, 1050, 600);

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 14px "Google Sans", Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Verve Academy', 600, 740);

      // Download the canvas
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Verve_Academy_Certificate_${certificate.certificateNumber}.png`;
      link.click();

      // Mark as downloaded
      if (courseId) {
        const token = localStorage.getItem('token');
        await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/certificate/download`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download certificate');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareText = `I just completed "${certificate.courseTitle}" course at Verve Academy! Certificate #${certificate.certificateNumber}`;

      if (navigator.share) {
        await navigator.share({
          title: 'Verve Academy Certificate',
          text: shareText,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareText);
        toast.success('Achievement copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-blue-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between border-b border-blue-400/30">
          <div className="flex items-center gap-3">
            <Award className="text-yellow-400" size={32} />
            <div>
              <h2 style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif" }} className="text-2xl font-bold text-white">
                Congratulations!
              </h2>
              <p style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif", fontSize: "0.75rem" }} className="text-blue-100">
                You've completed the course
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-100 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Badge Display */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/50">
                <div className="text-6xl">★</div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-yellow-300 opacity-50" />
            </div>
          </div>

          {/* Certificate Info */}
          <div
            style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif" }}
            className="text-center space-y-2"
          >
            <h3 className="text-xl font-bold text-white">{certificate.courseTitle}</h3>
            <p className="text-slate-300">
              Completed by <span className="font-semibold text-blue-400">{certificate.userName}</span>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <p
                style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif", fontSize: "0.75rem" }}
                className="text-slate-400"
              >
                Certificate Number
              </p>
              <p
                style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif" }}
                className="text-white font-semibold mt-1 text-sm"
              >
                {certificate.certificateNumber}
              </p>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <p
                style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif", fontSize: "0.75rem" }}
                className="text-slate-400"
              >
                Quiz Score
              </p>
              <p
                style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif", fontSize: "0.8125rem" }}
                className="text-white font-semibold mt-1"
              >
                {certificate.totalQuizScore}%
              </p>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 col-span-2">
              <p
                style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif", fontSize: "0.75rem" }}
                className="text-slate-400"
              >
                Completion Date
              </p>
              <p
                style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif" }}
                className="text-white font-semibold mt-1 text-sm"
              >
                {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Download size={20} />
              <span style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif" }}>
                {isDownloading ? 'Downloading...' : 'Download Certificate'}
              </span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Share2 size={20} />
              <span style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif" }}>Share Achievement</span>
            </button>
          </div>

          {/* Verve Academy Branding */}
          <div className="text-center pt-4 border-t border-slate-700">
            <p style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif", fontSize: "0.75rem" }} className="text-slate-400">
              This achievement is verified by
            </p>
            <p
              style={{ fontFamily: "'Google Sans', 'Segoe UI', sans-serif" }}
              className="text-blue-400 font-bold text-lg mt-1"
            >
              VERVE ACADEMY
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDisplay;
