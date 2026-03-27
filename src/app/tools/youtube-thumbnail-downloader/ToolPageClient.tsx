'use client';

import { useState, FormEvent } from 'react';

interface YouTubeUrlParts {
  videoId: string;
  valid: boolean;
}

function parseYouTubeUrl(url: string): YouTubeUrlParts {
  if (!url.trim()) {
    return { videoId: '', valid: false };
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return { videoId: match[1], valid: true };
    }
  }

  return { videoId: '', valid: false };
}

interface ThumbnailResult {
  url: string;
  quality: string;
}

export default function ToolPageClient() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [thumbnails, setThumbnails] = useState<ThumbnailResult[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<ThumbnailResult | null>(null);
  const [videoId, setVideoId] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setThumbnails([]);
    setSelectedThumbnail(null);

    const parsed = parseYouTubeUrl(url);

    if (!parsed.valid) {
      setError('Please enter a valid YouTube URL or video ID');
      return;
    }

    const id = parsed.videoId;
    setVideoId(id);
    
    const thumbnailOptions: ThumbnailResult[] = [
      { url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`, quality: 'Max Resolution (1280x720)' },
      { url: `https://img.youtube.com/vi/${id}/sddefault.jpg`, quality: 'SD (640x480)' },
      { url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`, quality: 'HQ (480x360)' },
      { url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`, quality: 'MQ (320x180)' },
      { url: `https://img.youtube.com/vi/${id}/default.jpg`, quality: 'Default (120x90)' },
    ];

    setThumbnails(thumbnailOptions);
    setSelectedThumbnail(thumbnailOptions[0]);
  };

  const downloadThumbnail = async () => {
    if (!selectedThumbnail || !videoId) return;
    
    try {
      const response = await fetch(selectedThumbnail.url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `youtube-thumbnail-${videoId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback to direct download
      const link = document.createElement('a');
      link.href = selectedThumbnail.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🎬</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">YouTube Thumbnail Downloader</h1>
          <p className="text-text-secondary">Download high-quality YouTube video thumbnails instantly</p>
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
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
            >
              Extract
            </button>
          </div>
          {error && <p className="mt-3 text-error text-sm">{error}</p>}
        </form>

        {selectedThumbnail && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <img
                  src={selectedThumbnail.url}
                  alt="Thumbnail preview"
                  className="w-full rounded-xl"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  }}
                />
              </div>
              <div className="lg:w-64 space-y-4">
                <div>
                  <h3 className="text-text-primary font-semibold mb-3">Select Quality</h3>
                  <div className="space-y-2">
                    {thumbnails.map((thumb, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedThumbnail(thumb)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                          selectedThumbnail.quality === thumb.quality
                            ? 'border-primary bg-primary/10 text-text-primary'
                            : 'border-border hover:border-primary/50 text-text-secondary'
                        }`}
                      >
                        {thumb.quality}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={downloadThumbnail}
                  className="w-full px-6 py-3 bg-success hover:bg-success/80 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">How to use</h2>
          <ol className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <span>Copy the YouTube video URL or video ID</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <span>Paste it in the input box above</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <span>Select your preferred quality and click Download</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}