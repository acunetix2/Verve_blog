import React, { useState } from 'react';
import { X, Download, Share2, Award } from 'lucide-react';
import { VerveHubLogo } from "@/components/VerveHubLogo";

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

      // Create a temporary container to render the logo
      const logoContainer = document.createElement('div');
      logoContainer.style.position = 'absolute';
      logoContainer.style.left = '-9999px';
      document.body.appendChild(logoContainer);

      // Render the logo component
      const root = (await import('react-dom/client')).createRoot(logoContainer);
      await new Promise<void>((resolve) => {
        root.render(
          <div style={{ width: '80px', height: '80px' }}>
            <VerveHubLogo />
          </div>
        );
        setTimeout(resolve, 100);
      });

      // Get the SVG element
      const svgElement = logoContainer.querySelector('svg');
      let logoDataUrl = '';
      
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        logoDataUrl = URL.createObjectURL(svgBlob);
      }

      // Create a canvas-based certificate
      const canvas = document.createElement('canvas');
      canvas.width = 1400;
      canvas.height = 900;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Failed to generate certificate');
        document.body.removeChild(logoContainer);
        return;
      }

      // Load logo image if available
      const logoImg = new Image();
      if (logoDataUrl) {
        logoImg.src = logoDataUrl;
        await new Promise((resolve) => {
          logoImg.onload = resolve;
          logoImg.onerror = resolve;
        });
      }

      // Professional gradient background (Cisco-inspired - Blue & White)
      const gradient = ctx.createLinearGradient(0, 0, 1400, 900);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.5, '#f8f9ff');
      gradient.addColorStop(1, '#e8eeff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1400, 900);

      // Premium gold decorative border
      ctx.strokeStyle = '#d4a574';
      ctx.lineWidth = 12;
      ctx.strokeRect(40, 40, 1320, 820);

      // Inner sophisticated border
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 60, 1280, 780);

      // Top accent bar with gradient
      const accentGradient = ctx.createLinearGradient(0, 60, 0, 140);
      accentGradient.addColorStop(0, '#1e40af');
      accentGradient.addColorStop(1, '#3b82f6');
      ctx.fillStyle = accentGradient;
      ctx.fillRect(60, 60, 1280, 80);

      // Draw logo on the left side of the header
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, 80, 75, 50, 50);
      }

      // Logo and company branding at top
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px "Segoe UI", Arial';
      ctx.textAlign = 'left';
      ctx.fillText('VERVE HUB ACADEMY', 145, 110);

      // Certificate seal/badge
      ctx.fillStyle = '#d4a574';
      ctx.beginPath();
      ctx.arc(1250, 150, 45, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner circle
      ctx.fillStyle = '#1e40af';
      ctx.beginPath();
      ctx.arc(1250, 150, 38, 0, Math.PI * 2);
      ctx.fill();

      // Star in seal
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 50px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', 1250, 150);

      // Main Certificate Title
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 52px "Segoe UI", Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('CERTIFICATE OF COMPLETION', 700, 180);

      // Decorative line
      ctx.strokeStyle = '#d4a574';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(300, 250);
      ctx.lineTo(1100, 250);
      ctx.stroke();

      // "This is to certify that" text
      ctx.fillStyle = '#334155';
      ctx.font = '18px "Segoe UI", Arial';
      ctx.textAlign = 'center';
      ctx.fillText('This is to certify that', 700, 280);

      // Recipient Name - Large and prominent
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 42px "Segoe UI", Arial';
      ctx.textAlign = 'center';
      ctx.fillText(certificate.userName, 700, 340);

      // Decorative underline for name
      ctx.strokeStyle = '#d4a574';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(300, 360);
      ctx.lineTo(1100, 360);
      ctx.stroke();

      // Achievement text
      ctx.fillStyle = '#334155';
      ctx.font = 'italic 16px "Segoe UI", Arial';
      ctx.textAlign = 'center';
      ctx.fillText('has successfully completed the course', 700, 400);

      // Congratulatory message 1
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 18px "Segoe UI", Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎉 Congratulations on Your Achievement! 🎉', 700, 435);

      // Course Title highlight
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 28px "Segoe UI", Arial';
      ctx.textAlign = 'center';
      ctx.fillText(certificate.courseTitle, 700, 480);

      // Achievement description with more congratulatory text
      ctx.fillStyle = '#475569';
      ctx.font = '15px "Segoe UI", Arial';
      ctx.textAlign = 'center';
      ctx.fillText('and demonstrated exceptional proficiency in all required assessments and modules', 700, 525);

      // Congratulatory message 2
      ctx.fillStyle = '#059669';
      ctx.font = 'italic 14px "Segoe UI", Arial';
      ctx.textAlign = 'center';
      ctx.fillText('This remarkable achievement reflects your dedication and commitment to excellence', 700, 555);

      // Signature and official section
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 14px "Segoe UI", Arial';
      ctx.textAlign = 'left';
      
      // Left side - Signature area
      ctx.fillStyle = '#64748b';
      ctx.font = '12px "Segoe UI", Arial';
      ctx.fillText('_____________________', 150, 600);
      
      ctx.fillStyle = '#334155';
      ctx.font = '13px "Segoe UI", Arial';
      ctx.fillText('Authorized Instructor', 150, 630);

      // Center section - Executive signature with congratulations
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 14px "Segoe UI", Arial';
      ctx.textAlign = 'center';
      ctx.fillText('With Great Pride & Recognition', 700, 575);

      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 13px "Segoe UI", Arial';
      ctx.fillText('Iddy Chesire', 700, 610);
      
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 13px "Segoe UI", Arial';
      ctx.fillText('CEO, Verve Hub Academy', 700, 635);

      // Right side - Seal stamp area with badge
      ctx.fillStyle = '#d4a574';
      ctx.font = 'italic 11px "Segoe UI", Arial';
      ctx.textAlign = 'right';
      ctx.fillText('Official Seal', 1250, 620);

      // Draw a professional badge circle on the right
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(1250, 740, 35, 0, Math.PI * 2);
      ctx.fill();
      
      // Badge inner circle
      ctx.fillStyle = '#d4a574';
      ctx.beginPath();
      ctx.arc(1250, 740, 30, 0, Math.PI * 2);
      ctx.fill();

      // Badge star
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', 1250, 740);

      // Certificate metadata
      ctx.fillStyle = '#64748b';
      ctx.font = '12px "Segoe UI", Arial';
      ctx.textAlign = 'left';
      const completionDate = new Date(certificate.completionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      ctx.fillText(`Certificate #: ${certificate.certificateNumber}`, 150, 730);
      ctx.fillText(`Issued: ${completionDate}`, 150, 760);

      // Quiz score on the right
      ctx.textAlign = 'right';
      ctx.fillText(`Achievement Score: ${certificate.totalQuizScore}%`, 1250, 730);

      // Footer - Official statement
      ctx.fillStyle = '#334155';
      ctx.font = 'italic 12px "Segoe UI", Arial';
      ctx.textAlign = 'center';
      ctx.fillText('This certificate verifies successful completion and is recognized by Verve Hub Academy', 700, 830);

      // Download the canvas
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Verve_Hub_Academy_Certificate_${certificate.certificateNumber}.png`;
      link.click();

      // Cleanup
      document.body.removeChild(logoContainer);
      if (logoDataUrl) {
        URL.revokeObjectURL(logoDataUrl);
      }

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

      console.log('Professional certificate downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareText = `I just completed "${certificate.courseTitle}" course at Verve Academy! Certificate #${certificate.certificateNumber}`;

      if (navigator.share) {
        await navigator.share({
          title: 'Verve Hub Academy Certificate',
          text: shareText,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareText);
        console.log('Achievement copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-blue-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header - Professional Blue */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between border-b border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg p-1.5 flex items-center justify-center">
              <VerveHubLogo />
            </div>
            <Award className="text-yellow-400 animate-bounce" size={32} />
            <div>
              <h2 style={{ fontFamily: "'Segoe UI', 'Google Sans', sans-serif" }} className="text-2xl font-bold text-white">
                🎓 Congratulations! 🏆
              </h2>
              <p style={{ fontFamily: "'Segoe UI', 'Google Sans', sans-serif", fontSize: "0.75rem" }} className="text-blue-100">
                You've Earned Your Professional Certificate of Achievement
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
          {/* Badge Display - Modern Achievement Badge */}
          <div className="flex justify-center mb-2">
            <div className="relative w-40 h-40">
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 opacity-20 blur-xl" />
              
              {/* Main badge circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl shadow-yellow-500/50 border-4 border-yellow-200">
                <div className="text-center">
                  <div className="text-6xl mb-1">⭐</div>
                  <div className="text-xs font-bold text-yellow-900">ACHIEVED</div>
                </div>
              </div>
              
              {/* Decorative rings */}
              <div className="absolute inset-1 rounded-full border-3 border-yellow-200 opacity-60" />
              <div className="absolute inset-3 rounded-full border-2 border-yellow-100 opacity-40" />
            </div>
          </div>

          {/* Motivational Message */}
          <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-green-700">
              ✨ Outstanding! You've demonstrated exceptional dedication and mastery ✨
            </p>
            <p className="text-xs text-green-600 mt-2">
              This certificate recognizes your hard work, commitment, and excellence in completing this course
            </p>
          </div>

          {/* Certificate Title */}
          <div
            style={{ fontFamily: "'Segoe UI', 'Google Sans', sans-serif" }}
            className="text-center space-y-2"
          >
            <h3 className="text-2xl font-bold text-blue-900">{certificate.courseTitle}</h3>
            <p className="text-slate-600">
              Completed by <span className="font-bold text-blue-700 text-lg">{certificate.userName}</span>
            </p>
          </div>

          {/* Divider */}
          <div className="h-0.5 bg-gradient-to-r from-yellow-400 via-blue-500 to-yellow-400 opacity-60" />

          {/* CEO Signature Section */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-center space-y-3">
            <p className="text-sm font-semibold text-blue-900">Authorized By</p>
            <p className="text-xl font-bold text-blue-800">Iddy Chesire</p>
            <p className="text-sm text-blue-700 font-semibold">CEO, Verve Hub Academy</p>
            <div className="w-24 h-0.5 bg-yellow-400 mx-auto mt-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p
                style={{ fontFamily: "'Segoe UI', 'Google Sans', sans-serif", fontSize: "0.75rem" }}
                className="text-blue-600 font-semibold"
              >
                CERTIFICATE #
              </p>
              <p
                style={{ fontFamily: "'Courier New', monospace" }}
                className="text-blue-900 font-bold mt-2 text-sm"
              >
                {certificate.certificateNumber}
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p
                style={{ fontFamily: "'Segoe UI', 'Google Sans', sans-serif", fontSize: "0.75rem" }}
                className="text-blue-600 font-semibold"
              >
                ACHIEVEMENT SCORE
              </p>
              <p
                style={{ fontFamily: "'Segoe UI', 'Google Sans', sans-serif" }}
                className="text-blue-900 font-bold mt-2 text-lg"
              >
                {certificate.totalQuizScore}%
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p
                style={{ fontFamily: "'Segoe UI', 'Google Sans', sans-serif", fontSize: "0.75rem" }}
                className="text-blue-600 font-semibold"
              >
                ISSUED
              </p>
              <p
                style={{ fontFamily: "'Segoe UI', 'Google Sans', sans-serif" }}
                className="text-blue-900 font-semibold mt-2 text-xs"
              >
                {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Achievement Description */}
          <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-5">
            <p className="text-center space-y-2">
              <span className="font-bold text-blue-900 text-lg block">Certificate of Achievement</span>
              <span className="text-sm text-slate-700 block">This prestigious certificate verifies successful completion of all required assessments and modules with proficiency and excellence</span>
              <span className="text-xs text-amber-700 italic block mt-2">We proudly recognize your achievement and wish you continued success in your professional journey</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 disabled:from-blue-600/50 disabled:to-blue-700/50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Download size={20} />
              <span style={{ fontFamily: "'Segoe UI', 'Google Sans', sans-serif" }}>
                {isDownloading ? 'Downloading...' : 'Download Certificate'}
              </span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Share2 size={20} />
              <span style={{ fontFamily: "'Segoe UI', 'Google Sans', sans-serif" }}>Share</span>
            </button>
          </div>

          {/* Branding Footer */}
          <div className="text-center pt-6 border-t-2 border-blue-200 space-y-3">
            <div className="flex justify-center items-center gap-3 mb-2">
              <div className="w-8 h-8">
                <VerveHubLogo />
              </div>
              <div className="text-2xl">✓</div>
            </div>
            <p style={{ fontFamily: "'Segoe UI', 'Google Sans', sans-serif", fontSize: "0.75rem" }} className="text-slate-500">
              Verified & Certified by
            </p>
            <p
              style={{ fontFamily: "'Segoe UI', 'Google Sans', sans-serif" }}
              className="text-blue-800 font-bold text-xl"
            >
              VERVE HUB ACADEMY
            </p>
            <p className="text-xs text-slate-600">CyberSecurity Learning Platform | Recognized for Excellence</p>
            <p className="text-xs font-semibold text-green-700 mt-3">🎓 Your Success is Our Priority</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDisplay;