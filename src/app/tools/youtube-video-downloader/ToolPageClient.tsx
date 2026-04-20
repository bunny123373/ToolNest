'use client';

import { useState, FormEvent } from 'react';

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  author: string;
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setVideoInfo(null);

    const videoId = parseYouTubeUrl(url);
    if (!videoId) {
      setError('Please enter a valid YouTube URL or video ID');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      
      if (response.status === 200) {
        const data = await response.json();
        setVideoInfo({
          title: data.title || 'YouTube Video',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          duration: 'N/A',
          views: 'N/A',
          author: data.author_name || 'Unknown',
        });
      } else {
        setError('Could not fetch video information');
      }
    } catch {
      setError('Failed to fetch video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openInY2mate = () => {
    const videoId = parseYouTubeUrl(url);
    if (!videoId) return;
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(`https://www.y2mate.com/youtube-mp4?url=${encodeURIComponent(youtubeUrl)}`, '_blank');
  };

  const openInY2mateMP3 = () => {
    const videoId = parseYouTubeUrl(url);
    if (!videoId) return;
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(`https://www.y2mate.com/youtube-mp3?url=${encodeURIComponent(youtubeUrl)}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🎵</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">YouTube Video Downloader</h1>
          <p className="text-text-secondary">Download YouTube videos and audio for free</p>
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
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = `https://img.youtube.com/vi/${parseYouTubeUrl(url)}/hqdefault.jpg`;
                  }}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-text-primary mb-2">{videoInfo.title}</h2>
                <p className="text-text-secondary mb-2">by {videoInfo.author}</p>
                <p className="text-text-secondary text-sm">Duration: {videoInfo.duration}</p>
              </div>
            </div>
          </div>
        )}

        {videoInfo && (
          <div className="text-center">
            <div className="p-6 bg-primary/10 border border-primary/30 rounded-2xl mb-6">
              <p className="text-primary font-medium mb-4">
                Due to YouTube's bot protection, direct download is not available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={openInY2mate}
                  className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Video (MP4)
                </button>
                <button
                  onClick={openInY2mateMP3}
                  className="px-6 py-3 bg-success hover:bg-success/80 text-white font-medium rounded-xl transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Audio (MP3)
                </button>
              </div>
              <p className="text-text-secondary text-sm mt-3">
                Opens Y2Mate website where you can download for free
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">How to download</h2>
          <ol className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <span>Paste YouTube URL and click Get Video</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <span>Click "Download Video" or "Download Audio" button</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <span>On Y2Mate, select quality and click Download</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}