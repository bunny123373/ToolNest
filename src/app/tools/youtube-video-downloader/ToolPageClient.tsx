'use client';

import { useState, FormEvent } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  author: string;
}

interface Format {
  itag: number;
  quality: string;
  type: string;
  fileSize: string;
  category: 'video' | 'audio' | 'mp3';
}

function parseYouTubeUrl(url: string): string | null {
  if (!url.trim()) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function ToolPageClient() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [formats, setFormats] = useState<Format[]>([]);
  const [downloading, setDownloading] = useState<number | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setVideoInfo(null);
    setFormats([]);

    const videoId = parseYouTubeUrl(url);
    if (!videoId) {
      setError('Please enter a valid YouTube URL or video ID');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/info?id=${videoId}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setVideoInfo({
        title: data.title || 'YouTube Video',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: data.duration ? formatDuration(data.duration) : 'Unknown',
        views: data.views ? data.views.toLocaleString() : 'Unknown',
        author: data.author || 'Unknown',
      });

      const fmtResponse = await fetch(`${BACKEND_URL}/api/formats?id=${videoId}`);
      const fmtData = await fmtResponse.json();

      const videoFormats: Format[] = (fmtData.video || []).map((f: any) => ({
        ...f,
        category: 'video' as const,
      }));

      const audioFormats: Format[] = (fmtData.audio || []).map((f: any) => ({
        ...f,
        category: 'audio' as const,
      }));

      const defaultFormats: Format[] = [
        { itag: 22, quality: '1080p', type: 'MP4', fileSize: '~150 MB', category: 'video' },
        { itag: 18, quality: '720p', type: 'MP4', fileSize: '~50 MB', category: 'video' },
        { itag: 140, quality: '128K', type: 'M4A', fileSize: '~8 MB', category: 'audio' },
      ];

      if (videoFormats.length > 0 || audioFormats.length > 0) {
        setFormats([...videoFormats, ...audioFormats]);
      } else {
        setFormats(defaultFormats);
      }
    } catch {
      setError('Failed to fetch video. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: Format) => {
    setDownloading(format.itag);
    
    const videoId = parseYouTubeUrl(url);
    if (!videoId) return;

    try {
      const endpoint = format.category === 'audio' 
        ? `${BACKEND_URL}/api/download/audio`
        : `${BACKEND_URL}/api/download`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          itag: format.itag,
          format: format.category === 'audio' ? 'm4a' : 'mp4',
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const filename = `${videoInfo?.title || 'video'}.${format.category === 'audio' ? 'm4a' : 'mp4'}`;
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } else {
        const data = await response.json();
        setError(data.error || 'Download failed');
      }
    } catch {
      setError('Download failed. Please check if backend is running.');
    } finally {
      setTimeout(() => setDownloading(null), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🎵</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">YouTube Video Downloader</h1>
          <p className="text-text-secondary">Download YouTube videos and audio in multiple formats</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL or video ID..."
              className="flex-1 px-5 py-4 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Get Video'}
            </button>
          </div>
          {error && <p className="mt-3 text-error text-sm">{error}</p>}
        </form>

        {videoInfo && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/3">
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-full rounded-xl"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-text-primary mb-2">{videoInfo.title}</h2>
                <p className="text-text-secondary mb-2">by {videoInfo.author}</p>
                <div className="flex gap-4 text-sm text-text-secondary mb-4">
                  <span>Duration: {videoInfo.duration}</span>
                  <span>Views: {videoInfo.views}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {formats.length > 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Video</h3>
              <div className="grid gap-3">
                {formats.filter(f => f.category === 'video').map((format, index) => (
                  <div
                    key={index}
                    className="bg-surface-elevated border border-border rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-text-primary">{format.type}</p>
                      <p className="text-sm text-text-secondary">{format.quality} • {format.fileSize}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(format)}
                      disabled={downloading === format.itag}
                      className="px-4 py-2 bg-success hover:bg-success/80 text-white font-medium rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {downloading === format.itag ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Audio</h3>
              <div className="grid gap-3">
                {formats.filter(f => f.category === 'audio').map((format, index) => (
                  <div
                    key={index}
                    className="bg-surface-elevated border border-border rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-text-primary">{format.type}</p>
                      <p className="text-sm text-text-secondary">{format.quality} • {format.fileSize}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(format)}
                      disabled={downloading === format.itag}
                      className="px-4 py-2 bg-success hover:bg-success/80 text-white font-medium rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {downloading === format.itag ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">How to use</h2>
          <ol className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <span>Install Python backend: <code className="bg-surface-hover px-2 py-0.5 rounded">cd server && pip install -r requirements.txt</code></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <span>Run backend: <code className="bg-surface-hover px-2 py-0.5 rounded">python app.py</code></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <span>Paste YouTube URL and click Get Video</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">4</span>
              <span>Select format and click Download</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}