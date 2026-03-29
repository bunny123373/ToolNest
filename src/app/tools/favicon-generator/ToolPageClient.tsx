'use client';

import { useState, useRef } from 'react';

export default function ToolPageClient() {
  const [text, setText] = useState('TN');
  const [bgColor, setBgColor] = useState('#6366f1');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(32);
  const [faviconDataUrl, setFaviconDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateFavicon = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 32;
    canvas.height = 32;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 32, 32);

    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.substring(0, 2), 16, 16);

    const dataUrl = canvas.toDataURL('image/png');
    setFaviconDataUrl(dataUrl);
  };

  const downloadFavicon = (size: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !faviconDataUrl) return;

    const img = new Image();
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = size;
      tempCanvas.height = size;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, size, size);
        const link = document.createElement('a');
        link.download = `favicon-${size}x${size}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
      }
    };
    img.src = faviconDataUrl;
  };

  const downloadIco = () => {
    if (!faviconDataUrl) return;
    const link = document.createElement('a');
    link.download = 'favicon.ico';
    link.href = faviconDataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🌐</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Favicon Generator</h1>
          <p className="text-text-secondary">Create favicons for your website instantly</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Text (max 2 chars)</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value.substring(0, 2))}
                maxLength={2}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Font Size</label>
              <input
                type="range"
                min={16}
                max={48}
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-text-secondary">{fontSize}px</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-text-primary font-mono uppercase"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-text-primary font-mono uppercase"
                />
              </div>
            </div>
          </div>

          <button
            onClick={generateFavicon}
            className="w-full px-8 py-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
          >
            Generate Favicon
          </button>
        </div>

        {faviconDataUrl && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white rounded-2xl">
                <img src={faviconDataUrl} alt="Generated favicon" className="w-16 h-16" />
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => downloadFavicon(16)}
                className="px-4 py-3 bg-background hover:bg-primary/20 border border-border hover:border-primary/50 rounded-xl text-sm text-text-secondary hover:text-primary transition-colors"
              >
                16x16 PNG
              </button>
              <button
                onClick={() => downloadFavicon(32)}
                className="px-4 py-3 bg-background hover:bg-primary/20 border border-border hover:border-primary/50 rounded-xl text-sm text-text-secondary hover:text-primary transition-colors"
              >
                32x32 PNG
              </button>
              <button
                onClick={() => downloadFavicon(48)}
                className="px-4 py-3 bg-background hover:bg-primary/20 border border-border hover:border-primary/50 rounded-xl text-sm text-text-secondary hover:text-primary transition-colors"
              >
                48x48 PNG
              </button>
              <button
                onClick={() => downloadFavicon(180)}
                className="px-4 py-3 bg-background hover:bg-primary/20 border border-border hover:border-primary/50 rounded-xl text-sm text-text-secondary hover:text-primary transition-colors"
              >
                Apple Icon
              </button>
            </div>
          </div>
        )}

        <div className="p-6 bg-surface-elevated border border-border rounded-2xl">
          <h3 className="text-lg font-semibold text-text-primary mb-4">How to use</h3>
          <ol className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <span>Enter 1-2 characters for your favicon</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <span>Customize colors and font size</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <span>Download the sizes you need and add to your website</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
