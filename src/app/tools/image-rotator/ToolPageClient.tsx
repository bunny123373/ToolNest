'use client';

import { useState, useRef } from 'react';

export default function ToolPageClient() {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setProcessedImage(null);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const rad = (rotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      
      let canvasWidth = img.width * cos + img.height * sin;
      let canvasHeight = img.width * sin + img.height * cos;

      if (flipH) canvasWidth = -canvasWidth;
      if (flipV) canvasHeight = -canvasHeight;

      canvas.width = Math.abs(canvasWidth);
      canvas.height = Math.abs(canvasHeight);

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = `rotated-${rotation}deg.png`;
    link.href = processedImage;
    link.click();
  };

  const rotateOptions = [0, 90, 180, 270];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🔄</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Image Rotator</h1>
          <p className="text-text-secondary">Rotate and flip images with ease</p>
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
              <h3 className="text-lg font-semibold text-text-primary mb-4">Rotate</h3>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {rotateOptions.map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setRotation(deg)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      rotation === deg
                        ? 'bg-primary text-white'
                        : 'bg-background text-text-secondary hover:bg-primary/20'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm text-text-secondary mb-2">Custom rotation: {rotation}°</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <h3 className="text-lg font-semibold text-text-primary mb-4">Flip</h3>
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setFlipH(!flipH)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    flipH ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:bg-primary/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Horizontal
                </button>
                <button
                  onClick={() => setFlipV(!flipV)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    flipV ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:bg-primary/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Vertical
                </button>
              </div>

              <button
                onClick={processImage}
                className="w-full px-8 py-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
              >
                Apply Changes
              </button>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {processedImage && (
              <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
                <div className="flex justify-center mb-6">
                  <img src={processedImage} alt="Processed" className="max-w-full rounded-xl shadow-lg" />
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
                      setRotation(0);
                      setFlipH(false);
                      setFlipV(false);
                      setProcessedImage(null);
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
