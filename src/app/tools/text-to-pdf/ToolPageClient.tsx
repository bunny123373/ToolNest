'use client';

import { useState } from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export default function ToolPageClient() {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');

  const convertToPdf = async () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setIsConverting(true);
    setError('');

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      const pageWidth = 595;
      const pageHeight = 842;
      const margin = 50;
      const lineHeight = fontSize * 1.5;
      const contentWidth = pageWidth - (margin * 2);
      
      const lines: string[] = [];
      const paragraphs = text.split('\n');
      
      for (const paragraph of paragraphs) {
        const words = paragraph.split(' ');
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine ? currentLine + ' ' + word : word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth <= contentWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          }
        }
        if (currentLine) lines.push(currentLine);
        lines.push('');
      }
      
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let yPosition = pageHeight - margin;
      
      if (title.trim()) {
        const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const titleSize = fontSize + 6;
        currentPage.drawText(title.trim(), {
          x: margin,
          y: yPosition - titleSize,
          size: titleSize,
          font: titleFont,
        });
        yPosition -= titleSize + lineHeight * 2;
      }
      
      for (const line of lines) {
        if (line === '') {
          yPosition -= lineHeight / 2;
          continue;
        }
        
        if (yPosition < margin) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = pageHeight - margin;
        }
        
        currentPage.drawText(line, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font,
        });
        
        yPosition -= lineHeight;
      }
      
      const pdfBytes = await pdfDoc.save();
      const buffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
      const blob = new Blob([buffer], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.trim() || 'document'}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to create PDF. Please try again.');
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  const clearAll = () => {
    setText('');
    setTitle('');
    setError('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Text to PDF Converter</h1>
          <p className="text-text-secondary">Convert text to a PDF document</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 space-y-6">
          <div>
            <label className="text-text-primary font-medium mb-2 block">Document Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-text-primary font-medium mb-2 block">Your Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter or paste your text here..."
              rows={12}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-text-primary font-medium">Font Size</label>
              <span className="text-text-secondary">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-center">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={convertToPdf}
              disabled={isConverting || !text.trim()}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-surface-hover text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center justify-center gap-2"
            >
              {isConverting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating PDF...
                </>
              ) : (
                'Create PDF'
              )}
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-3 bg-surface-hover hover:bg-surface-elevated text-text-primary font-medium rounded-xl transition-all"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Features</h2>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Custom title for your document</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Adjustable font size (10-24px)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Multi-page support for long text</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>100% free, no registration required</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}