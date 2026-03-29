'use client';

import { useState, useRef } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
}

export default function ToolPageClient() {
  const [image, setImage] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<ImageDimensions | null>(null);
  const [newWidth, setNewWidth] = useState(800);
  const [newHeight, setNewHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [quality, setQuality] = useState(90);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(event.target?.result as string);
          setOriginalDimensions({ width: img.width, height: img.height });
          setNewWidth(img.width);
          setNewHeight(img.height);
          setResizedImage(null);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (width: number) => {
    setNewWidth(width);
    if (maintainAspect && originalDimensions) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setNewHeight(Math.round(width * ratio));
    }
  };

  const handleHeightChange = (height: number) => {
    setNewHeight(height);
    if (maintainAspect && originalDimensions) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setNewWidth(Math.round(height * ratio));
    }
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = newWidth;
    canvas.height = newHeight;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      setResizedImage(canvas.toDataURL('image/jpeg', quality / 100));
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!resizedImage) return;
    const link = document.createElement('a');
    link.download = `resized-${newWidth}x${newHeight}.jpg`;
    link.href = resizedImage;
    link.click();
  };

  const presets = [
    { name: 'HD', width: 1280, height: 720 },
    { name: 'Full HD', width: 1920, height: 1080 },
    { name: '4K', width: 3840, height: 2160 },
    { name: 'Square', width: 1080, height: 1080 },
    { name: 'Story', width: 1080, height: 1920 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">📐</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Image Resizer</h1>
          <p className="text-text-secondary">Resize images to any dimension</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-8 border-2 border-dashed border-border hover:border-primary/50 rounded-xl text-text-secondary hover:text-primary transition-colors flex flex-col items-center gap-2"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Click to upload an image</span>
          </button>
        </div>

        {image && (
          <>
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
              <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setNewWidth(preset.width);
                      setNewHeight(preset.height);
                    }}
                    className="px-4 py-2 bg-background hover:bg-primary/20 border border-border hover:border-primary/50 rounded-lg text-sm text-text-secondary hover:text-primary whitespace-nowrap transition-colors"
                  >
                    {preset.name} ({preset.width}x{preset.height})
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Width (px)</label>
                  <input
                    type="number"
                    value={newWidth}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Height (px)</label>
                  <input
                    type="number"
                    value={newHeight}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary"
                />
                <span className="text-text-secondary">Maintain aspect ratio</span>
              </label>

              <div className="mb-6">
                <label className="block text-sm text-text-secondary mb-2">Quality: {quality}%</label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <button
                onClick={handleResize}
                className="w-full px-8 py-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
              >
                Resize Image
              </button>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {resizedImage && (
              <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
                <div className="flex justify-center mb-6">
                  <img src={resizedImage} alt="Resized" className="max-w-full rounded-xl shadow-lg" />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 px-8 py-4 bg-success hover:bg-success/80 text-white font-medium rounded-xl transition-all"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => {
                      setImage(null);
                      setResizedImage(null);
                      setOriginalDimensions(null);
                    }}
                    className="px-8 py-4 bg-surface border border-border hover:border-error/50 text-text-secondary hover:text-error rounded-xl transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
