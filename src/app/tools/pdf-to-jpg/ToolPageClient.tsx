'use client';

import { useState, useCallback, useEffect } from 'react';

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
}

export default function ToolPageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedPages, setConvertedPages] = useState<ConvertedPage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [pdfjsLib, setPdfjsLib] = useState<typeof import('pdfjs-dist') | null>(null);

  useEffect(() => {
    import('pdfjs-dist').then((mod) => {
      mod.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${mod.version}/pdf.worker.min.js`;
      setPdfjsLib(mod);
    });
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }
    
    setError('');
    setFile(selectedFile);
    setConvertedPages([]);
  }, []);

  const convertPdfToImages = async () => {
    if (!file || !pdfjsLib) return;

    setIsConverting(true);
    setError('');
    setConvertedPages([]);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      const pages: ConvertedPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        setProgress(Math.round((i / totalPages) * 100));
        
        const page = await pdf.getPage(i);
        const scale = 2;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        if (!context) throw new Error('Canvas not supported');
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        } as never).promise;
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        pages.push({
          pageNumber: i,
          dataUrl,
        });
      }

      setConvertedPages(pages);
    } catch (err) {
      setError('Failed to convert PDF. Please try another file.');
      console.error(err);
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  const downloadPage = (page: ConvertedPage) => {
    const link = document.createElement('a');
    link.href = page.dataUrl;
    link.download = `page-${page.pageNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    convertedPages.forEach((page, index) => {
      setTimeout(() => downloadPage(page), index * 200);
    });
  };

  const reset = () => {
    setFile(null);
    setConvertedPages([]);
    setError('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">📸</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">PDF to JPG Converter</h1>
          <p className="text-text-secondary">Convert PDF pages to high-quality JPG images</p>
        </div>

        {!file && (
          <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 transition-all">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-input"
            />
            <div className="space-y-4">
              <div className="text-5xl">📁</div>
              <div>
                <label htmlFor="pdf-input" className="text-primary hover:text-primary-hover cursor-pointer">
                  Click to upload PDF
                </label>
              </div>
              <p className="text-text-secondary text-sm">PDF files only</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-center">
            {error}
          </div>
        )}

        {file && !convertedPages.length && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">📄</div>
              <div>
                <p className="text-text-primary font-medium">{file.name}</p>
                <p className="text-text-secondary text-sm">Ready to convert</p>
              </div>
            </div>
            
            <button
              onClick={convertPdfToImages}
              disabled={isConverting || !pdfjsLib}
              className="w-full px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-surface-hover text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center justify-center gap-2"
            >
              {isConverting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Converting... {progress}%
                </>
              ) : !pdfjsLib ? (
                'Loading...'
              ) : (
                'Convert to JPG'
              )}
            </button>
          </div>
        )}

        {convertedPages.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-text-primary font-medium">
                {convertedPages.length} pages converted
              </p>
              <div className="flex gap-2">
                <button
                  onClick={downloadAll}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-all"
                >
                  Download All
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-surface-hover hover:bg-surface-elevated text-text-primary font-medium rounded-lg transition-all"
                >
                  Convert Another
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {convertedPages.map((page) => (
                <div key={page.pageNumber} className="bg-surface-elevated border border-border rounded-xl p-4">
                  <p className="text-text-secondary text-sm mb-2">Page {page.pageNumber}</p>
                  <img
                    src={page.dataUrl}
                    alt={`Page ${page.pageNumber}`}
                    className="w-full rounded-lg mb-3"
                  />
                  <button
                    onClick={() => downloadPage(page)}
                    className="w-full px-4 py-2 bg-success hover:bg-success/80 text-white font-medium rounded-lg transition-all"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">How to use</h2>
          <ol className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <span>Upload your PDF file</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <span>Click &quot;Convert to JPG&quot; button</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <span>Download individual pages or all at once</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}