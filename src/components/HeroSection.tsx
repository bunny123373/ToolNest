'use client';

import { useState } from 'react';
import Link from 'next/link';
import { searchTools } from '@/data/tools';
import { Tool } from '@/types/tool';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      const results = searchTools(value);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 animate-fade-in">
          50+ Free Smart Tools{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            in One Place
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-text-secondary mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Fast, simple, and powerful online tools built for everyday work.
        </p>

        <div className="relative max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              className="w-full px-6 py-4 bg-surface-elevated border border-border rounded-2xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-primary hover:bg-primary-hover rounded-xl transition-all">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-border rounded-xl shadow-xl overflow-hidden z-50">
              {searchResults.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.route}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors"
                >
                  <span className="text-xl">{tool.icon}</span>
                  <div>
                    <p className="text-text-primary font-medium">{tool.title}</p>
                    <p className="text-text-secondary text-sm">{tool.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link href="/tools/youtube-thumbnail-downloader" className="px-4 py-2 bg-surface-elevated hover:bg-surface-hover border border-border rounded-full text-text-secondary hover:text-text-primary transition-all">
            🎬 Thumbnail
          </Link>
          <Link href="/tools/image-compressor" className="px-4 py-2 bg-surface-elevated hover:bg-surface-hover border border-border rounded-full text-text-secondary hover:text-text-primary transition-all">
            🗜️ Compressor
          </Link>
          <Link href="/tools/pdf-merger" className="px-4 py-2 bg-surface-elevated hover:bg-surface-hover border border-border rounded-full text-text-secondary hover:text-text-primary transition-all">
            📑 PDF Merge
          </Link>
          <Link href="/tools/qr-generator" className="px-4 py-2 bg-surface-elevated hover:bg-surface-hover border border-border rounded-full text-text-secondary hover:text-text-primary transition-all">
            🔳 QR Code
          </Link>
        </div>
      </div>
    </section>
  );
}