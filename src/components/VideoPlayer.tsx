import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Download, Eye } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  videoType: 'youtube' | 'vimeo' | 'custom';
  title: string;
  duration?: number;
  onProgress?: (progress: number) => void;
  canDownload?: boolean;
  showTranscript?: boolean;
  transcript?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  videoType,
  title,
  duration,
  onProgress,
  canDownload,
  showTranscript,
  transcript
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscriptPanel, setShowTranscriptPanel] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setCurrentTime(videoRef.current.currentTime);
      onProgress?.(progress);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // YouTube Embed
  if (videoType === 'youtube') {
    const videoId = videoUrl.includes('youtube.com')
      ? new URL(videoUrl).searchParams.get('v')
      : videoUrl.split('/').pop();

    return (
      <div className="mb-8 space-y-4">
        <div className="bg-black rounded-lg overflow-hidden" ref={containerRef}>
          <div className="relative aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?controls=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
        {transcript && (
          <button
            onClick={() => setShowTranscriptPanel(!showTranscriptPanel)}
            className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700"
          >
            <Eye size={16} />
            {showTranscriptPanel ? 'Hide Transcript' : 'Show Transcript'}
          </button>
        )}
      </div>
    );
  }

  // Custom HTML5 Video
  return (
    <div className="mb-8 space-y-4">
      <div
        ref={containerRef}
        className="bg-black rounded-lg overflow-hidden"
      >
        {/* Video Player */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          ></video>

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity group">
            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max="100"
              value={
                videoRef.current
                  ? (videoRef.current.currentTime / videoRef.current.duration) * 100
                  : 0
              }
              onChange={handleProgressChange}
              className="w-full h-1 bg-gray-600 rounded cursor-pointer mb-3 accent-green-600"
            />

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlay}
                  className="p-1 hover:bg-white/20 rounded transition"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button
                  onClick={handleMute}
                  className="p-1 hover:bg-white/20 rounded transition"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <span className="text-xs ml-2">
                  {formatTime(currentTime)} / {formatTime(videoRef.current?.duration || 0)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {canDownload && (
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = videoUrl;
                      link.download = `${title}.mp4`;
                      link.click();
                    }}
                    className="p-1 hover:bg-white/20 rounded transition"
                    title="Download"
                  >
                    <Download size={20} />
                  </button>
                )}

                <button
                  onClick={handleFullscreen}
                  className="p-1 hover:bg-white/20 rounded transition"
                  title="Fullscreen"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript */}
      {transcript && (
        <>
          <button
            onClick={() => setShowTranscriptPanel(!showTranscriptPanel)}
            className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700"
          >
            <Eye size={16} />
            {showTranscriptPanel ? 'Hide Transcript' : 'Show Transcript'}
          </button>

          {showTranscriptPanel && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Video Transcript</h3>
              <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-wrap">
                {transcript}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
