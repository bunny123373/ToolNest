'use client';

import { useState, FormEvent } from 'react';

interface ImageInfo {
  url: string;
  filename: string;
  width: number;
  height: number;
  size: number;
  type: string;
  blobUrl?: string;
}

export default function ToolPageClient() {
  const [imageUrl, setImageUrl] = useState('');
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidImageUrl = (url: string): boolean => {
    const trimmedUrl = url.trim();
    
    if (trimmedUrl.startsWith('data:')) {
      return trimmedUrl.startsWith('data:image/');
    }
    
    if (trimmedUrl.startsWith('blob:')) {
      return true;
    }
    
    try {
      const urlObj = new URL(trimmedUrl);
      const pathname = urlObj.pathname.toLowerCase();
      const search = urlObj.search.toLowerCase();
      const hostname = urlObj.hostname.toLowerCase();
      const href = urlObj.href.toLowerCase();
      
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|jfif|avif|heic|heif|tiff|tif|tis|raw|psd|webm|apng|wbmp|svs|czi|ndpi|dcm|dicom)$/i;
      
      const knownImageHosts = [
        'img', 'photo', 'picture', 'image', 'cdn', 'google', 'unsplash', 'pexels', 'pixabay',
        'flickr', 'imgur', 'imgurio', 'cloudfront', 'akamai', 'fastly', 'cloudflare',
        'dropbox', 'drive.google', 'i.imgur', 'media', 'static', 'upload', 'files',
        'images', 'asset', 'assets', 'storage', 's3', 'digitaloceanspaces', 'wikimedia', 'upload.wikimedia'
      ];
      
      const knownImagePaths = ['thumbnail', 'preview', 'full', 'original', 'media', 'photo', 'image', 'img'];
      
      return (
        imageExtensions.test(pathname) ||
        imageExtensions.test(search) ||
        pathname.includes('image') ||
        search.includes('imgurl') ||
        search.includes('image') ||
        search.includes('url=') ||
        pathname.includes('photo') ||
        pathname.includes('picture') ||
        pathname.includes('download') ||
        knownImageHosts.some(host => hostname.includes(host)) ||
        knownImagePaths.some(path => pathname.includes(path)) ||
        href.includes('.jpg') ||
        href.includes('.jpeg') ||
        href.includes('.png') ||
        href.includes('.gif') ||
        href.includes('.webp') ||
        href.includes('.svg') ||
        href.includes('.bmp') ||
        href.includes('.tiff') ||
        href.includes('.tif') ||
        href.includes('.ico') ||
        href.includes('.heic') ||
        href.includes('.avif') ||
        href.includes('.svs') ||
        href.includes('.dcm') ||
        href.includes('.dicom')
      );
    } catch {
      return false;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const extractFilename = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const parts = pathname.split('/');
      const filename = parts[parts.length - 1];
      if (filename && filename.includes('.')) {
        return filename.split('?')[0];
      }
      const ext = url.split('.').pop()?.split('?')[0] || 'png';
      return `image.${ext}`;
    } catch {
      const ext = url.split('.').pop()?.split('?')[0] || 'png';
      return `image.${ext}`;
    }
  };

  const fetchImageInfo = async (url: string): Promise<ImageInfo | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        resolve({
          url,
          filename: extractFilename(url),
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: 0,
          type: 'image/' + (url.split('.').pop()?.split('?')[0] || 'png'),
        });
      };
      
      img.onerror = () => {
        const img2 = new Image();
        img2.onload = () => {
          resolve({
            url,
            filename: extractFilename(url),
            width: img2.naturalWidth,
            height: img2.naturalHeight,
            size: 0,
            type: 'image/' + (url.split('.').pop()?.split('?')[0] || 'png'),
          });
        };
        img2.onerror = () => resolve(null);
        img2.src = url;
      };
      
      img.src = url;
    });
  };

  const getMediaTypeFromUrl = (url: string, fallback: string): string => {
    const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase() || '';
    const extToType: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'bmp': 'image/bmp',
      'ico': 'image/x-icon',
      'tif': 'image/tiff',
      'tiff': 'image/tiff',
      'heic': 'image/heic',
      'heif': 'image/heif',
      'avif': 'image/avif',
      'svs': 'application/vnd.svs-image',
      'czi': 'application/octet-stream',
      'ndpi': 'application/octet-stream',
    };
    return extToType[ext] || fallback;
  };

  const tryFetchDirect = async (url: string): Promise<ImageInfo | null> => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) return null;
      const blob = await response.blob();
      const contentType = blob.type || getMediaTypeFromUrl(url, 'image/png');
      const blobUrl = URL.createObjectURL(blob);
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            url,
            filename: extractFilename(url),
            width: img.naturalWidth,
            height: img.naturalHeight,
            size: blob.size,
            type: contentType,
            blobUrl,
          });
        };
        img.onerror = () => resolve(null);
        img.src = blobUrl;
      });
    } catch {
      return null;
    }
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
      
      if (url.includes('imgurl=')) {
        const match = url.match(/imgurl=([^&]+)/);
        if (match && match[1]) {
          try {
            url = decodeURIComponent(match[1]);
          } catch {
            // Keep original URL
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
        setError('');
      } else {
        const directInfo = await tryFetchDirect(url);
        if (directInfo) {
          setImageInfo(directInfo);
        } else {
          setError('Could not load image. The server may be blocking access. Try a different URL.');
        }
      }
    } catch (err) {
      setError('Failed to fetch image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!imageInfo) return;
    
    setLoading(true);
    
    try {
      let downloadUrl: string;
      let filename = imageInfo.filename;
      
      if (imageInfo.blobUrl && imageInfo.size > 0) {
        downloadUrl = imageInfo.blobUrl;
      } else {
        const response = await fetch(imageInfo.url, { mode: 'cors' });
        if (!response.ok) {
          downloadUrl = imageInfo.url;
        } else {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          downloadUrl = blobUrl;
          filename = imageInfo.filename;
        }
      }
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (err) {
      const link = document.createElement('a');
      link.href = imageInfo.url;
      link.download = imageInfo.filename;
      link.rel = 'noopener noreferrer';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } finally {
      setLoading(false);
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
                  src={imageInfo.blobUrl || imageInfo.url}
                  alt="Preview"
                  className="w-full rounded-xl object-contain max-h-96 bg-surface"
                />
              </div>
              <div className="lg:w-64 space-y-4">
                <div>
                  <h3 className="text-text-primary font-semibold mb-3">Image Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-text-secondary">Filename</span>
                      <span className="text-text-primary font-mono text-xs break-all">{imageInfo.filename}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Dimensions</span>
                      <span className="text-text-primary">{imageInfo.width} × {imageInfo.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Type</span>
                      <span className="text-text-primary uppercase">{imageInfo.type}</span>
                    </div>
                    {imageInfo.size > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Size</span>
                        <span className="text-text-primary">{formatFileSize(imageInfo.size)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={downloadImage}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-success hover:bg-success/80 disabled:bg-surface-hover text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
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
            {['JPG', 'JPEG', 'PNG', 'GIF', 'WebP', 'SVG', 'BMP', 'ICO', 'TIFF', 'HEIC', 'HEIF', 'AVIF', 'SVS', 'CZI', 'NDPI'].map((format) => (
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