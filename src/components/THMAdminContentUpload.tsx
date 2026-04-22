/**
 * TryHackMe-Style Admin Content Upload Panel
 * Upload markdown/txt/html files and auto-structure as rooms
 */

import React, { useState } from 'react';
import { Upload, File, AlertCircle, CheckCircle2, X, Loader2, Settings, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface ContentUploadConfig {
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  roomType: 'learning' | 'challenge' | 'ctf';
  withCertificate: boolean;
  withBadge: boolean;
  pointsPerQuestion: number;
}

export default function THMAdminContentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'file' | 'configure'>('file');
  const [config, setConfig] = useState<ContentUploadConfig>({
    title: '',
    description: '',
    category: 'General',
    difficulty: 'Beginner',
    roomType: 'learning',
    withCertificate: false,
    withBadge: true,
    pointsPerQuestion: 8
  });
  const [uploading, setUploading] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const token = localStorage.getItem('token');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['text/plain', 'text/markdown', 'text/html', 'application/x-markdown'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(md|txt|html)$/i)) {
      toast.error('Please upload a .md, .txt, or .html file');
      return;
    }

    setFile(selectedFile);

    // Read and preview file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPreview(content.substring(0, 500)); // First 500 chars
    };
    reader.readAsText(selectedFile);
  };

  const handleConfigChange = (field: keyof ContentUploadConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (!config.title || !config.description) {
      toast.error('Please fill in title and description');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', config.title);
    formData.append('description', config.description);
    formData.append('category', config.category);
    formData.append('difficulty', config.difficulty);
    formData.append('roomType', config.roomType);
    formData.append('pointsPerQuestion', String(config.pointsPerQuestion));
    formData.append('withBadge', String(config.withBadge));
    formData.append('withCertificate', String(config.withCertificate));

    try {
      setParseProgress(25);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/upload-content`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded / (progressEvent.total || 1)) * 50) + 25;
            setParseProgress(progress);
          }
        }
      );

      setParseProgress(100);
      toast.success(`Room "${config.title}" created successfully!`);
      
      // Reset form
      setFile(null);
      setPreview('');
      setConfig({
        title: '',
        description: '',
        category: 'General',
        difficulty: 'Beginner',
        roomType: 'learning',
        withCertificate: false,
        withBadge: true,
        pointsPerQuestion: 8
      });
      setUploadMode('file');

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload content');
    } finally {
      setUploading(false);
      setParseProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Room Content</h1>
        <p className="text-gray-400">
          Upload Markdown, HTML, or Text files to create interactive rooms
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-700">
        <button
          onClick={() => setUploadMode('file')}
          className={`px-4 py-2 font-medium transition ${
            uploadMode === 'file'
              ? 'text-orange-400 border-b-2 border-orange-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Select File
        </button>
        {file && (
          <button
            onClick={() => setUploadMode('configure')}
            className={`px-4 py-2 font-medium transition ${
              uploadMode === 'configure'
                ? 'text-orange-400 border-b-2 border-orange-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Configure
          </button>
        )}
      </div>

      {/* File Upload Panel */}
      {uploadMode === 'file' && (
        <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg p-12 text-center mb-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-orange-500/20 p-4 rounded-full">
                <Upload className="text-orange-400" size={48} />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">Upload Content File</h3>
              <p className="text-gray-400 mb-4">
                Supports Markdown (.md), Text (.txt), and HTML (.html) files
              </p>
            </div>

            <input
              type="file"
              onChange={handleFileSelect}
              accept=".md,.txt,.html,.markdown"
              className="hidden"
              id="content-file"
            />

            <label
              htmlFor="content-file"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold cursor-pointer transition"
            >
              Choose File
            </label>

            {file && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <div className="text-left">
                    <p className="text-green-400 font-semibold">{file.name}</p>
                    <p className="text-sm text-green-400/70">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview('');
                    }}
                    className="ml-auto text-green-400 hover:text-green-300"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* File Preview */}
            {preview && (
              <div className="mt-6 p-4 bg-gray-900/50 rounded-lg text-left max-h-48 overflow-y-auto border border-gray-700">
                <p className="text-xs font-mono text-gray-400 whitespace-pre-wrap break-words">
                  {preview}...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Configure Panel */}
      {uploadMode === 'configure' && file && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 space-y-6 mb-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings size={20} /> Room Configuration
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Room Title *
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => handleConfigChange('title', e.target.value)}
                placeholder="Enter room title"
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={config.description}
                onChange={(e) => handleConfigChange('description', e.target.value)}
                placeholder="Enter room description"
                rows={3}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Room Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={config.category}
                onChange={(e) => handleConfigChange('category', e.target.value)}
                placeholder="e.g., Web Security"
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={config.difficulty}
                onChange={(e) => handleConfigChange('difficulty', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Room Type
              </label>
              <select
                value={config.roomType}
                onChange={(e) => handleConfigChange('roomType', e.target.value as any)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="learning">Learning</option>
                <option value="challenge">Challenge</option>
                <option value="ctf">CTF</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Points per Question
              </label>
              <input
                type="number"
                value={config.pointsPerQuestion}
                onChange={(e) => handleConfigChange('pointsPerQuestion', parseInt(e.target.value))}
                min="1"
                max="100"
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Rewards */}
          <div className="space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.withBadge}
                onChange={(e) => handleConfigChange('withBadge', e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-white font-medium">Award Badge on Completion</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.withCertificate}
                onChange={(e) => handleConfigChange('withCertificate', e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-white font-medium">Award Certificate on Completion</span>
            </label>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex gap-3">
            <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
            <p className="text-sm text-blue-300">
              The system will automatically parse your content and create lesson blocks, 
              questions, and learning paths based on the file structure.
            </p>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="mb-8 p-6 bg-gray-800/50 border border-gray-700 rounded-lg space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-orange-400" size={24} />
            <div>
              <p className="text-white font-semibold">Processing content...</p>
              <p className="text-sm text-gray-400">Building lessons and questions</p>
            </div>
          </div>

          <div className="w-full bg-gray-900/50 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all"
              style={{ width: `${parseProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400">{parseProgress}% Complete</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleUpload}
          disabled={!file || !config.title || !config.description || uploading}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Uploading...
            </>
          ) : (
            <>
              <Upload size={20} /> Create Room
            </>
          )}
        </button>

        {file && (
          <button
            onClick={() => {
              setFile(null);
              setPreview('');
              setUploadMode('file');
            }}
            className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
