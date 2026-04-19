'use client';

import { useState, useRef, useCallback } from 'react';

interface CompressedImage {
  originalSize: number;
  compressedSize: number;
  url: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function ToolPageClient() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<CompressedImage | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback(async (file: File) => {
    setIsCompressing(true);
    setError('');

    try {
      const img = document.createElement('img');
      const url = URL.createObjectURL(file);
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const compressedUrl = canvas.toDataURL('image/jpeg', 0.7);
      
      const originalSize = file.size;
      const head = 'data:image/jpeg;base64,';
      const sizeInBytes = Math.round((compressedUrl.length - head.length) * 3 / 4);
      
      setOriginalImage(url);
      setCompressedImage({
        originalSize,
        compressedSize: sizeInBytes,
        url: compressedUrl,
      });
    } catch (err) {
      setError('Failed to compress image. Please try again.');
      console.error(err);
    } finally {
      setIsCompressing(false);
    }
  }, []);

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, GIF)');
      return;
    }
    
    compressImage(file);
  }, [compressImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const downloadCompressed = () => {
    if (!compressedImage) return;
    
    const link = document.createElement('a');
    link.href = compressedImage.url;
    link.download = 'compressed-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🗜️</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Image Compressor</h1>
          <p className="text-text-secondary">Compress images while maintaining quality</p>
        </div>

        {!compressedImage && (
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              dragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
              className="hidden"
              id="image-input"
            />
            <div className="space-y-4">
              <div className="text-5xl">📁</div>
              <div>
                <label htmlFor="image-input" className="text-primary hover:text-primary-hover cursor-pointer">
                  Click to upload
                </label>
                <span className="text-text-secondary"> or drag and drop</span>
              </div>
              <p className="text-text-secondary text-sm">PNG, JPEG, WebP, GIF (max 10MB)</p>
            </div>
          </div>
        )}

        {isCompressing && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-text-primary">
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Compressing...
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-center">
            {error}
          </div>
        )}

        {compressedImage && originalImage && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-text-secondary text-sm mb-2">Original</p>
                <img src={originalImage} alt="Original" className="w-full rounded-xl" />
                <p className="text-text-primary font-medium mt-2">{formatFileSize(compressedImage.originalSize)}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm mb-2">Compressed</p>
                <img src={compressedImage.url} alt="Compressed" className="w-full rounded-xl" />
                <p className="text-text-primary font-medium mt-2">{formatFileSize(compressedImage.compressedSize)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 p-4 bg-success/10 border border-success/20 rounded-xl">
                <p className="text-success font-medium">
                  Reduced by {Math.round((1 - compressedImage.compressedSize / compressedImage.originalSize) * 100)}%
                </p>
              </div>
              <button
                onClick={downloadCompressed}
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-surface-hover hover:bg-surface-elevated text-text-primary font-medium rounded-xl transition-all"
              >
                Compress Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}