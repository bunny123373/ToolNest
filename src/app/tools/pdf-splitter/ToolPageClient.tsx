'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

interface PDFFile {
  name: string;
  pages: number;
  data: Uint8Array;
}

interface SplitRange {
  id: string;
  start: number;
  end: number;
}

export default function ToolPageClient() {
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [ranges, setRanges] = useState<SplitRange[]>([
    { id: '1', start: 1, end: 1 },
  ]);
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

      setRanges([{ id: '1', start: 1, end: Math.min(1, pages) }]);
    } catch {
      setError('Failed to load PDF file. Please ensure it is a valid PDF document.');
      setPdfFile(null);
    } finally {
      setLoading(false);
    }
  };

  const addRange = () => {
    if (!pdfFile) return;
    setRanges([
      ...ranges,
      { id: Date.now().toString(), start: 1, end: Math.min(1, pdfFile.pages) },
    ]);
  };

  const removeRange = (id: string) => {
    if (ranges.length <= 1) return;
    setRanges(ranges.filter((r) => r.id !== id));
  };

  const updateRange = (id: string, field: 'start' | 'end', value: number) => {
    if (!pdfFile) return;
    setRanges(
      ranges.map((r) => {
        if (r.id !== id) return r;
        const newValue = Math.max(1, Math.min(value, pdfFile.pages));
        return { ...r, [field]: newValue };
      })
    );
  };

  const handleSplit = async () => {
    if (!pdfFile) return;

    setLoading(true);
    setError('');

    try {
      const sourcePdf = await PDFDocument.load(pdfFile.data);

      const pdfDoc = await PDFDocument.create();

      for (const range of ranges) {
        for (let i = range.start - 1; i < range.end; i++) {
          if (i >= 0 && i < pdfFile.pages) {
            const [copiedPage] = await pdfDoc.copyPages(sourcePdf, [i]);
            pdfDoc.addPage(copiedPage);
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `split-${pdfFile.name}`;
      link.click();

      URL.revokeObjectURL(url);
    } catch {
      setError('Failed to split PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">✂️</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">PDF Splitter</h1>
          <p className="text-text-secondary">Split PDF files into separate pages or extract specific page ranges</p>
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Select Page Ranges</h3>
                <button
                  onClick={addRange}
                  className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm transition-colors"
                >
                  + Add Range
                </button>
              </div>

              <div className="space-y-3">
                {ranges.map((range, index) => (
                  <div key={range.id} className="flex items-center gap-3">
                    <span className="text-text-secondary text-sm w-20">Range {index + 1}</span>
                    <input
                      type="number"
                      min={1}
                      max={pdfFile.pages}
                      value={range.start}
                      onChange={(e) => updateRange(range.id, 'start', parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-center"
                    />
                    <span className="text-text-secondary">to</span>
                    <input
                      type="number"
                      min={1}
                      max={pdfFile.pages}
                      value={range.end}
                      onChange={(e) => updateRange(range.id, 'end', parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-center"
                    />
                    <span className="text-text-secondary text-sm">({pdfFile.pages} pages)</span>
                    <button
                      onClick={() => removeRange(range.id)}
                      disabled={ranges.length <= 1}
                      className="p-2 text-text-secondary hover:text-error disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSplit}
              disabled={loading}
              className="w-full px-8 py-4 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-medium rounded-xl transition-all hover:shadow-glow"
            >
              Split PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}
