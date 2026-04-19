'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function ToolPageClient() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdf, setMergedPdf] = useState<Uint8Array | null>(null);
  const [error, setError] = useState('');

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    const pdfFiles: PDFFile[] = selectedFiles
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        size: file.size,
      }));
    
    if (selectedFiles.length !== pdfFiles.length) {
      setError('Some files were skipped. Only PDF files are allowed.');
    } else {
      setError('');
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      const [removed] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, removed);
      return newFiles;
    });
  }, []);

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge');
      return;
    }

    setIsMerging(true);
    setError('');

    try {
      const mergedPdfDoc = await PDFDocument.create();
      
      for (const pdfFile of files) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach(page => mergedPdfDoc.addPage(page));
      }

      const mergedPdfBytes = await mergedPdfDoc.save();
      setMergedPdf(mergedPdfBytes);
    } catch (err) {
      setError('Failed to merge PDFs. Please check if all files are valid.');
      console.error(err);
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMergedPdf = () => {
    if (!mergedPdf) return;
    
    const arrayBuffer = mergedPdf.buffer.slice(mergedPdf.byteOffset, mergedPdf.byteOffset + mergedPdf.byteLength) as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'merged.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFiles([]);
    setMergedPdf(null);
    setError('');
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">📑</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">PDF Merger</h1>
          <p className="text-text-secondary">Merge multiple PDF files into one document</p>
        </div>

        {!mergedPdf && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all">
              <input
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-input"
              />
              <div className="space-y-4">
                <div className="text-5xl">📄</div>
                <div>
                  <label htmlFor="pdf-input" className="text-primary hover:text-primary-hover cursor-pointer">
                    Click to upload
                  </label>
                  <span className="text-text-secondary"> or select multiple files</span>
                </div>
                <p className="text-text-secondary text-sm">PDF files only</p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-center">
                {error}
              </div>
            )}

            {files.length > 0 && (
              <div className="bg-surface-elevated border border-border rounded-2xl p-6">
                <h3 className="text-text-primary font-semibold mb-4">
                  Selected Files ({files.length})
                </h3>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-3 bg-surface rounded-xl"
                    >
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => index > 0 && reorderFiles(index, index - 1)}
                          disabled={index === 0}
                          className="p-1 text-text-secondary hover:text-text-primary disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => index < files.length - 1 && reorderFiles(index, index + 1)}
                          disabled={index === files.length - 1}
                          className="p-1 text-text-secondary hover:text-text-primary disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary font-medium truncate">{file.name}</p>
                        <p className="text-text-secondary text-sm">{formatSize(file.size)}</p>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-text-secondary hover:text-error transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={mergePdfs}
                  disabled={files.length < 2 || isMerging}
                  className="w-full mt-6 px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-surface-hover disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center justify-center gap-2"
                >
                  {isMerging ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Merging...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Merge PDFs
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {mergedPdf && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 animate-fade-in text-center">
            <div className="text-6xl mb-6">✅</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">PDFs Merged Successfully!</h3>
            <p className="text-text-secondary mb-6">
              {files.length} files have been combined into one PDF
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadMergedPdf}
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Merged PDF
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-surface-hover hover:bg-surface-elevated text-text-primary font-medium rounded-xl transition-all"
              >
                Merge More Files
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">How to use</h2>
          <ol className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <span>Click to upload or drag and drop multiple PDF files</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <span>Reorder files using the up/down arrows to change page order</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <span>Click "Merge PDFs" to combine all files</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">4</span>
              <span>Download the merged PDF file</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}