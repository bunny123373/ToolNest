'use client';

import { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';

interface PDFFile {
  name: string;
  pages: number;
  data: Uint8Array;
}

type Rotation = 0 | 90 | 180 | 270;

export default function ToolPageClient() {
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [rotation, setRotation] = useState<Rotation>(90);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPageCount();

      setPdfFile({
        name: file.name,
        pages,
        data: new Uint8Array(arrayBuffer),
      });
    } catch {
      setError('Failed to load PDF file. Please ensure it is a valid PDF document.');
      setPdfFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRotate = async () => {
    if (!pdfFile) return;

    setLoading(true);
    setError('');

    try {
      const sourcePdf = await PDFDocument.load(pdfFile.data);
      const pdfDoc = await PDFDocument.create();

      const copiedPages = await pdfDoc.copyPages(sourcePdf, sourcePdf.getPageIndices());

      copiedPages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
        pdfDoc.addPage(page);
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `rotated-${rotation}-${pdfFile.name}`;
      link.click();

      URL.revokeObjectURL(url);
    } catch {
      setError('Failed to rotate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const rotationOptions: { value: Rotation; label: string; icon: string }[] = [
    { value: 90, label: '90° CW', icon: '↻' },
    { value: 180, label: '180°', icon: '↺↻' },
    { value: 270, label: '270° CW', icon: '↺' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🔄</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">PDF Rotator</h1>
          <p className="text-text-secondary">Rotate PDF pages by 90, 180, or 270 degrees</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <label className="block w-full cursor-pointer">
            <div className="py-12 border-2 border-dashed border-border hover:border-primary/50 rounded-xl text-center transition-colors">
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-text-secondary">Processing...</span>
                </div>
              ) : pdfFile ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">📄</span>
                  <span className="text-text-primary font-medium">{pdfFile.name}</span>
                  <span className="text-text-secondary text-sm">{pdfFile.pages} pages</span>
                  <span className="text-primary text-sm hover:underline mt-2">Click to change file</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">📁</span>
                  <span className="text-text-secondary">Click to upload a PDF file</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-error/20 border border-error/50 rounded-xl text-error text-sm">
            {error}
          </div>
        )}

        {pdfFile && (
          <>
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Select Rotation</h3>
              <div className="grid grid-cols-3 gap-3">
                {rotationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRotation(option.value)}
                    className={`py-4 px-4 rounded-xl font-medium transition-all flex flex-col items-center gap-1 ${
                      rotation === option.value
                        ? 'bg-primary text-white'
                        : 'bg-background text-text-secondary hover:bg-primary/20'
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRotate}
              disabled={loading}
              className="w-full px-8 py-4 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-medium rounded-xl transition-all hover:shadow-glow"
            >
              Rotate PDF {rotation}°
            </button>
          </>
        )}
      </div>
    </div>
  );
}
