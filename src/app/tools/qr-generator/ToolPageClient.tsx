'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import QRCode from 'qrcode';

interface QRGenerateOptions {
  width: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
}

export default function ToolPageClient() {
  const [input, setInput] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async (text: string): Promise<string> => {
    const options: QRGenerateOptions = {
      width: 300,
      margin: 2,
      color: {
        dark: '#6366f1',
        light: '#0f172a',
      },
    };

    return QRCode.toDataURL(text, options);
  };

  useEffect(() => {
    if (input.trim()) {
      setIsGenerating(true);
      generateQRCode(input)
        .then((url) => {
          setQrCodeUrl(url);
          setError('');
        })
        .catch(() => {
          setError('Failed to generate QR code');
          setQrCodeUrl('');
        })
        .finally(() => {
          setIsGenerating(false);
        });
    } else {
      setQrCodeUrl('');
    }
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    if (!qrCodeUrl) return;
    
    try {
      await navigator.clipboard.writeText(input);
      alert('Content copied to clipboard!');
    } catch {
      alert('Failed to copy');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🔳</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">QR Code Generator</h1>
          <p className="text-text-secondary">Generate QR codes for URLs and text</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter URL or text..."
              rows={3}
              className="w-full px-5 py-4 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
          {error && <p className="mt-3 text-error text-sm">{error}</p>}
        </form>

        {isGenerating && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 text-text-primary">
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </div>
          </div>
        )}

        {qrCodeUrl && !isGenerating && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 animate-fade-in">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-xl mb-6">
                <img src={qrCodeUrl} alt="Generated QR Code" className="w-64 h-64" />
              </div>
              <p className="text-text-secondary text-center mb-6 break-all max-w-md">
                {input}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={downloadQRCode}
                  className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-3 bg-surface-hover hover:bg-surface-elevated text-text-primary font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Text
                </button>
              </div>
            </div>
          </div>
        )}

        {!input && !isGenerating && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4 opacity-50">🔳</div>
            <p className="text-text-secondary">Enter text or URL above to generate QR code</p>
          </div>
        )}

        <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">How to use</h2>
          <ol className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <span>Enter URL or text in the input field</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <span>QR code is generated automatically as you type</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <span>Click Download to save the QR code image</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}