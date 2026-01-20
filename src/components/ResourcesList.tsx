import React, { useState } from 'react';
import { Download, FileText, Code2, CheckSquare, Copy, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Resource {
  title: string;
  description?: string;
  type: 'pdf' | 'code' | 'checklist' | 'template' | 'other';
  url: string;
  fileSize?: number;
  downloadCount?: number;
}

interface ResourcesListProps {
  resources: Resource[];
  courseId: string;
  lessonId: string;
  canDownload?: boolean;
}

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText size={20} className="text-red-600" />;
    case 'code':
      return <Code2 size={20} className="text-blue-600" />;
    case 'checklist':
      return <CheckSquare size={20} className="text-green-600" />;
    case 'template':
      return <Copy size={20} className="text-purple-600" />;
    default:
      return <Download size={20} className="text-gray-600" />;
  }
};

const getResourceTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    pdf: 'PDF Document',
    code: 'Code File',
    checklist: 'Checklist',
    template: 'Template',
    other: 'File'
  };
  return labels[type] || 'File';
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return 'N/A';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ResourcesList: React.FC<ResourcesListProps> = ({
  resources,
  courseId,
  lessonId,
  canDownload = true
}) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (resource: Resource, index: number) => {
    if (!canDownload) {
      toast.error('You do not have permission to download resources');
      return;
    }

    setDownloading(`${index}`);

    try {
      const token = localStorage.getItem('token');
      
      // Track download
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/resources/${index}/download`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Download file
      const link = document.createElement('a');
      link.href = resource.url;
      link.target = '_blank';
      link.download = resource.title;
      link.click();

      toast.success(`Downloaded: ${resource.title}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resource');
    } finally {
      setDownloading(null);
    }
  };

  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="bg-white border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Download size={20} className="text-green-600" />
          📚 Course Resources
        </h3>

        <div className="space-y-3">
          {resources.map((resource, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">{getResourceIcon(resource.type)}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {resource.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <span className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                      {getResourceTypeLabel(resource.type)}
                    </span>
                    <span>{formatFileSize(resource.fileSize)}</span>
                    {resource.downloadCount !== undefined && (
                      <span>{resource.downloadCount} downloads</span>
                    )}
                  </div>
                  {resource.description && (
                    <p className="text-xs text-gray-600 mt-2">{resource.description}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDownload(resource, idx)}
                disabled={!canDownload || downloading === `${idx}`}
                className={`ml-4 px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 whitespace-nowrap ${
                  canDownload
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {downloading === `${idx}` ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Download
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesList;
