'use client';

import { useState, useCallback, FormEvent } from 'react';

interface ImageInfo {
  url: string;
  width: number;
  height: number;
  size: number;
  type: string;
}

export default function ToolPageClient() {
  const [imageUrl, setImageUrl] = useState('');
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      const search = urlObj.search.toLowerCase();
      const hostname = urlObj.hostname.toLowerCase();
      
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|jfif|avif|heic|heif)$/i;
      
      return (
        imageExtensions.test(pathname) ||
        imageExtensions.test(search) ||
        pathname.includes('image') ||
        search.includes('imgurl') ||
        search.includes('image') ||
        hostname.includes('img') ||
        hostname.includes('photo') ||
        hostname.includes('picture') ||
        hostname.includes('google') ||
        hostname.includes('cdn') ||
        hostname.includes('unsplash') ||
        hostname.includes('pexels') ||
        hostname.includes('pixabay')
      );
    } catch {
      return false;
    }
  };

  const fetchImageInfo = async (url: string): Promise<ImageInfo | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        resolve({
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: 0,
          type: 'image/' + (url.split('.').pop()?.split('?')[0] || 'png'),
        });
      };
      
      img.onerror = () => {
        resolve(null);
      };
      
      img.src = url;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setImageInfo(null);
    setLoading(true);

    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      setLoading(false);
      return;
    }

    try {
      let url = imageUrl.startsWith('http') ? imageUrl : 'https://' + imageUrl;
      
      // Handle Google Images format - extract imgurl parameter
      if (url.includes('imgurl=')) {
        const match = url.match(/imgurl=([^&]+)/);
        if (match && match[1]) {
          try {
            url = decodeURIComponent(match[1]);
          } catch {
            // Keep original URL if decode fails
          }
        }
      }
      
      if (!isValidImageUrl(url)) {
        setError('Please enter a valid image URL');
        setLoading(false);
        return;
      }

      const info = await fetchImageInfo(url);
      
      if (info) {
        setImageInfo(info);
      } else {
        setError('Could not load image. Please check the URL.');
      }
    } catch {
      setError('Failed to fetch image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!imageInfo) return;

    try {
      const response = await fetch(imageInfo.url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const ext = imageInfo.url.split('.').pop()?.split('?')[0] || 'jpg';
      const fileName = `image-${Date.now()}.${ext}`;

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      const link = document.createElement('a');
      link.href = imageInfo.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearAll = () => {
    setImageUrl('');
    setImageInfo(null);
    setError('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🖼️</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Image Downloader</h1>
          <p className="text-text-secondary">Download any image from a URL</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL here..."
              className="flex-1 px-5 py-4 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-primary hover:bg-primary-hover disabled:bg-surface-hover text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </>
              ) : (
                'Fetch'
              )}
            </button>
          </div>
          {error && <p className="mt-3 text-error text-sm">{error}</p>}
        </form>

        {imageInfo && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <img
                  src={imageInfo.url}
                  alt="Preview"
                  className="w-full rounded-xl object-contain max-h-96 bg-surface"
                />
              </div>
              <div className="lg:w-64 space-y-4">
                <div>
                  <h3 className="text-text-primary font-semibold mb-3">Image Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Dimensions</span>
                      <span className="text-text-primary">{imageInfo.width} × {imageInfo.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Type</span>
                      <span className="text-text-primary uppercase">{imageInfo.type}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={downloadImage}
                  className="w-full px-6 py-3 bg-success hover:bg-success/80 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={clearAll}
                  className="w-full px-6 py-3 bg-surface-hover hover:bg-surface-elevated text-text-primary font-medium rounded-xl transition-all"
                >
                  Download Another
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Supported Formats</h2>
          <div className="flex flex-wrap gap-2">
            {['JPG', 'PNG', 'GIF', 'WebP', 'SVG', 'BMP'].map((format) => (
              <span key={format} className="px-3 py-1 bg-surface rounded-full text-text-secondary text-sm">
                {format}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}