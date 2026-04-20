'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { searchTools } from '@/data/tools';
import { Tool } from '@/types/tool';
import Icon from './Icon';

const featuredTools = [
  { id: 'youtube-thumbnail', icon: '🎬', name: 'Thumbnail', color: 'from-red-500/20 to-red-600/10' },
  { id: 'pdf-merger', icon: '📑', name: 'PDF Merge', color: 'from-blue-500/20 to-blue-600/10' },
  { id: 'image-compressor', icon: '🗜️', name: 'Compress', color: 'from-green-500/20 to-green-600/10' },
  { id: 'qr-generator', icon: '🔳', name: 'QR Code', color: 'from-purple-500/20 to-purple-600/10' },
  { id: 'password-generator', icon: '🔐', name: 'Password', color: 'from-yellow-500/20 to-yellow-600/10' },
  { id: 'json-formatter', icon: '📋', name: 'JSON', color: 'from-cyan-500/20 to-cyan-600/10' },
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const heroSection = document.querySelector('section');
      if (heroSection && !heroSection.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      const results = searchTools(value);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const closeSearch = () => {
    setShowResults(false);
  };

  const popularTools = [
    { id: 'youtube-thumbnail', icon: '🎬', name: 'Thumbnail', color: 'from-red-500/20 to-red-600/10' },
    { id: 'pdf-merger', icon: '📑', name: 'PDF Merge', color: 'from-blue-500/20 to-blue-600/10' },
    { id: 'image-compressor', icon: '🗜️', name: 'Compress', color: 'from-green-500/20 to-green-600/10' },
    { id: 'qr-generator', icon: '🔳', name: 'QR Code', color: 'from-purple-500/20 to-purple-600/10' },
    { id: 'password-generator', icon: '🔐', name: 'Password', color: 'from-yellow-500/20 to-yellow-600/10' },
    { id: 'json-formatter', icon: '📋', name: 'JSON', color: 'from-cyan-500/20 to-cyan-600/10' },
  ];

  return (
    <section className="relative pt-24 pb-12 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated/60 backdrop-blur-sm border border-border/50 rounded-full mb-6">
          <span className="w-2 h-2 bg-success rounded-full" />
          <span className="text-sm text-text-secondary">30+ free tools</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight">
          Free Online Tools{' '}
          <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            That Just Work
          </span>
        </h1>
        
        <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
          Fast, secure, and completely free. No sign-up required.
          Process your files directly in your browser.
        </p>

        <div className="relative max-w-2xl mx-auto mb-12" ref={searchRef}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative flex items-center bg-surface-elevated border border-border rounded-2xl overflow-hidden">
              <input
                type="text"
                placeholder="Search for any tool..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
                className="flex-1 px-6 py-5 bg-transparent text-text-primary placeholder-text-secondary focus:outline-none text-lg"
              />
              <button className="mr-2 p-3 bg-primary hover:bg-primary-hover rounded-xl transition-all hover:scale-105 active:scale-95">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-surface-elevated border border-border rounded-xl shadow-2xl overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.route}
                      onClick={closeSearch}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors border-b border-border/50 last:border-0"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg shrink-0">
                        <Icon name={tool.icon} className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-text-primary font-medium truncate">{tool.title}</p>
                        <p className="text-text-secondary text-sm truncate">{tool.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-text-secondary">
                  No tools found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-8">
          <p className="text-sm text-text-secondary mb-4">Popular:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-surface-elevated/50 backdrop-blur-sm hover:bg-surface-elevated border border-border/30 hover:border-primary/30 rounded-lg transition-all hover:-translate-y-0.5"
                >
                  <span className="text-base">{tool.icon}</span>
                  <span className="text-sm text-text-secondary">{tool.name}</span>
                </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-8 max-w-3xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { icon: '🖼️', label: 'Image', count: 9 },
            { icon: '📄', label: 'PDF', count: 4 },
            { icon: '📝', label: 'Text', count: 4 },
            { icon: '🔧', label: 'Utility', count: 4 },
            { icon: '💻', label: 'Dev', count: 9 },
            { icon: '🎨', label: 'Design', count: 2 },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={`/tools?category=${cat.label.toLowerCase()}`}
              className="flex flex-col items-center gap-1 p-3 bg-surface-elevated/30 border border-border/20 rounded-xl hover:bg-surface-elevated hover:border-primary/20 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs text-text-secondary">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}