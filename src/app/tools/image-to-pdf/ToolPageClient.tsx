'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

export default function ToolPageClient() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      setError('Please select image files (JPG, PNG, etc.)');
      return;
    }

    setError('');
    
    const newImages: ImageFile[] = [];
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({
          id: Math.random().toString(36).substring(7),
          file,
          preview: e.target?.result as string,
          name: file.name
        });
        
        if (newImages.length === imageFiles.length) {
          setImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const newImages = [...prev];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      return newImages;
    });
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;

    setIsConverting(true);
    setError('');

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const image of images) {
        const imgBytes = await image.file.arrayBuffer();
        let embeddedImage;
        
        if (image.file.type === 'image/png' || image.file.name.toLowerCase().endsWith('.png')) {
          embeddedImage = await pdfDoc.embedPng(imgBytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imgBytes);
        }
        
        const page = pdfDoc.addPage([
          Math.max(embeddedImage.width, 400),
          Math.max(embeddedImage.height, 400)
        ]);
        
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: page.getWidth(),
          height: page.getHeight(),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const buffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
      const blob = new Blob([buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `images-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to convert. Please try again with different images.');
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  const reset = () => {
    setImages([]);
    setError('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🖼️</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Image to PDF Converter</h1>
          <p className="text-text-secondary">Convert multiple images to a single PDF</p>
        </div>

        {images.length === 0 && (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              dragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              id="image-input"
            />
            <div className="space-y-4">
              <div className="text-5xl">📁</div>
              <div>
                <label htmlFor="image-input" className="text-primary hover:text-primary-hover cursor-pointer">
                  Click to upload images
                </label>
                <span className="text-text-secondary"> or drag and drop</span>
              </div>
              <p className="text-text-secondary text-sm">JPG, PNG supported</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-center">
            {error}
          </div>
        )}

        {images.length > 0 && (
          <div className="space-y-6">
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-text-primary font-medium">{images.length} images selected</p>
                <button onClick={reset} className="text-text-secondary hover:text-text-primary text-sm">
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {images.map((img, index) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.preview}
                      alt={img.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 p-1 bg-error rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {index > 0 && (
                      <button
                        onClick={() => reorderImages(index, index - 1)}
                        className="absolute bottom-1 left-1 p-1 bg-surface rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={convertToPdf}
                disabled={isConverting || images.length === 0}
                className="w-full px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-surface-hover text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center justify-center gap-2"
              >
                {isConverting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Converting...
                  </>
                ) : (
                  'Convert to PDF'
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">How to use</h2>
          <ol className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <span>Upload multiple images (JPG, PNG)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <span>Reorder images if needed</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <span>Click &quot;Convert to PDF&quot; to download</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}