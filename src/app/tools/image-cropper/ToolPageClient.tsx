'use client';

import { useState, useRef, useEffect } from 'react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ToolPageClient() {
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatios = [
    { label: 'Free', value: null },
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4 / 3 },
    { label: '16:9', value: 16 / 9 },
    { label: '3:2', value: 3 / 2 },
    { label: '9:16', value: 9 / 16 },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(event.target?.result as string);
          setImageSize({ width: img.width, height: img.height });
          setCropArea({
            x: Math.round(img.width * 0.1),
            y: Math.round(img.height * 0.1),
            width: Math.round(img.width * 0.8),
            height: Math.round(img.height * 0.8),
          });
          setProcessedImage(null);
          setAspectRatio(null);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (!image || !imageRef.current) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      img,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    setProcessedImage(canvas.toDataURL('image/png'));
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = `cropped-${cropArea.width}x${cropArea.height}.png`;
    link.href = processedImage;
    link.click();
  };

  const handleMouseDown = (e: React.MouseEvent, type: string) => {
    setIsDragging(true);
    setDragType(type);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragType || !containerRef.current || !imageRef.current) return;

    const container = containerRef.current;
    const img = imageRef.current;
    const containerRect = container.getBoundingClientRect();
    const scaleX = img.naturalWidth / containerRect.width;
    const scaleY = img.naturalHeight / containerRect.height;

    const deltaX = (e.clientX - dragStart.x) * scaleX;
    const deltaY = (e.clientY - dragStart.y) * scaleY;

    setDragStart({ x: e.clientX, y: e.clientY });

    setCropArea((prev) => {
      let newArea = { ...prev };

      if (dragType === 'move') {
        newArea.x = Math.max(0, Math.min(prev.x + deltaX, imageSize.width - prev.width));
        newArea.y = Math.max(0, Math.min(prev.y + deltaY, imageSize.height - prev.height));
      } else if (dragType === 'e') {
        newArea.width = Math.max(50, Math.min(prev.width + deltaX, imageSize.width - prev.x));
        if (aspectRatio) {
          newArea.height = newArea.width / aspectRatio;
        }
      } else if (dragType === 's') {
        newArea.height = Math.max(50, Math.min(prev.height + deltaY, imageSize.height - prev.y));
        if (aspectRatio) {
          newArea.width = newArea.height * aspectRatio;
        }
      } else if (dragType === 'se') {
        newArea.width = Math.max(50, Math.min(prev.width + deltaX, imageSize.width - prev.x));
        newArea.height = Math.max(50, Math.min(prev.height + deltaY, imageSize.height - prev.y));
        if (aspectRatio) {
          newArea.height = newArea.width / aspectRatio;
        }
      } else if (dragType === 'w') {
        const newWidth = Math.max(50, prev.width - deltaX);
        if (prev.x + deltaX >= 0 && prev.x + deltaX < prev.x + prev.width - 50) {
          newArea.x = prev.x + deltaX;
          newArea.width = newWidth;
        }
        if (aspectRatio) {
          newArea.height = newArea.width / aspectRatio;
        }
      } else if (dragType === 'n') {
        const newHeight = Math.max(50, prev.height - deltaY);
        if (prev.y + deltaY >= 0 && prev.y + deltaY < prev.y + prev.height - 50) {
          newArea.y = prev.y + deltaY;
          newArea.height = newHeight;
        }
        if (aspectRatio) {
          newArea.width = newArea.height * aspectRatio;
        }
      } else if (dragType === 'nw') {
        const newWidth = Math.max(50, prev.width - deltaX);
        const newHeight = Math.max(50, prev.height - deltaY);
        if (prev.x + deltaX >= 0 && prev.x + deltaX < prev.x + prev.width - 50) {
          newArea.x = prev.x + deltaX;
          newArea.width = newWidth;
        }
        if (prev.y + deltaY >= 0 && prev.y + deltaY < prev.y + prev.height - 50) {
          newArea.y = prev.y + deltaY;
          newArea.height = newHeight;
        }
        if (aspectRatio) {
          newArea.width = newArea.height * aspectRatio;
        }
      } else if (dragType === 'ne') {
        const newWidth = Math.max(50, prev.width + deltaX);
        const newHeight = Math.max(50, prev.height - deltaY);
        if (prev.y + deltaY >= 0 && prev.y + deltaY < prev.y + prev.height - 50) {
          newArea.y = prev.y + deltaY;
          newArea.height = newHeight;
        }
        if (aspectRatio) {
          newArea.width = newArea.height * aspectRatio;
        } else {
          newArea.width = newWidth;
        }
      } else if (dragType === 'sw') {
        const newWidth = Math.max(50, prev.width - deltaX);
        const newHeight = Math.max(50, prev.height + deltaY);
        if (prev.x + deltaX >= 0 && prev.x + deltaX < prev.x + prev.width - 50) {
          newArea.x = prev.x + deltaX;
          newArea.width = newWidth;
        }
        if (aspectRatio) {
          newArea.height = newArea.width / aspectRatio;
        } else {
          newArea.height = newHeight;
        }
      }

      newArea.width = Math.min(newArea.width, imageSize.width - newArea.x);
      newArea.height = Math.min(newArea.height, imageSize.height - newArea.y);

      return newArea;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">✂️</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Image Cropper</h1>
          <p className="text-text-secondary">Crop images to any size with custom aspect ratios</p>
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
              <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.label}
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                      aspectRatio === ratio.value
                        ? 'bg-primary text-white'
                        : 'bg-background text-text-secondary hover:bg-primary/20'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>

              <div
                ref={containerRef}
                className="relative overflow-hidden bg-black/50 rounded-xl cursor-move"
                style={{ maxHeight: '500px' }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={image}
                  alt="Crop preview"
                  className="max-w-full max-h-[500px] mx-auto block"
                  draggable={false}
                />

                <div
                  className="absolute border-2 border-primary bg-primary/10 cursor-move"
                  style={{
                    left: `${(cropArea.x / imageSize.width) * 100}%`,
                    top: `${(cropArea.y / imageSize.height) * 100}%`,
                    width: `${(cropArea.width / imageSize.width) * 100}%`,
                    height: `${(cropArea.height / imageSize.height) * 100}%`,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'move')}
                >
                  <div className="absolute inset-0 border border-white/50" />

                  <div className="absolute top-0 left-0 w-full h-1 cursor-ns-resize" onMouseDown={(e) => handleMouseDown(e, 'n')} />
                  <div className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize" onMouseDown={(e) => handleMouseDown(e, 's')} />
                  <div className="absolute left-0 top-0 w-1 h-full cursor-ew-resize" onMouseDown={(e) => handleMouseDown(e, 'w')} />
                  <div className="absolute right-0 top-0 w-1 h-full cursor-ew-resize" onMouseDown={(e) => handleMouseDown(e, 'e')} />

                  <div className="absolute top-0 left-0 w-3 h-3 bg-white border border-primary cursor-nw-resize" onMouseDown={(e) => handleMouseDown(e, 'nw')} />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-white border border-primary cursor-ne-resize" onMouseDown={(e) => handleMouseDown(e, 'ne')} />
                  <div className="absolute bottom-0 left-0 w-3 h-3 bg-white border border-primary cursor-sw-resize" onMouseDown={(e) => handleMouseDown(e, 'sw')} />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-white border border-primary cursor-se-resize" onMouseDown={(e) => handleMouseDown(e, 'se')} />
                </div>
              </div>

              <div className="mt-4 text-center text-text-secondary text-sm">
                Size: {Math.round(cropArea.width)} x {Math.round(cropArea.height)} px
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={handleCrop}
                className="flex-1 px-8 py-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
              >
                Apply Crop
              </button>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {processedImage && (
              <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
                <div className="flex justify-center mb-6">
                  <img src={processedImage} alt="Cropped" className="max-w-full rounded-xl shadow-lg" />
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
