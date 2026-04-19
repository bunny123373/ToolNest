'use client';

import { useState, useEffect } from 'react';

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ToolPageClient() {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    lowercase: true,
    trim: true,
    removeSpecial: true,
    replaceSpaces: '-',
  });

  useEffect(() => {
    if (input.trim()) {
      let result = input;
      if (options.lowercase) result = result.toLowerCase();
      if (options.removeSpecial) result = result.replace(/[^\w\s-]/g, '');
      if (options.trim) result = result.trim();
      result = result.replace(/[\s_-]+/g, options.replaceSpaces);
      result = result.replace(/^-+|-+$/g, '');
      setSlug(result);
    } else {
      setSlug('');
    }
  }, [input, options]);

  const handleCopy = async () => {
    if (slug) {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const suggestions = [
    'My Amazing Blog Post Title Here',
    'How to Create Perfect URL Slugs',
    'The Ultimate Guide to SEO Optimization',
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🔗</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Slug Generator</h1>
          <p className="text-text-secondary">Create URL-friendly slugs for your content</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <label className="block text-sm text-text-secondary mb-2">Enter text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-32 px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Options</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-text-secondary">Lowercase</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.trim}
                onChange={(e) => setOptions({ ...options, trim: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-text-secondary">Trim whitespace</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.removeSpecial}
                onChange={(e) => setOptions({ ...options, removeSpecial: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-text-secondary">Remove special chars</span>
            </label>
            <div className="flex items-center gap-3">
              <span className="text-text-secondary">Replace spaces with:</span>
              <select
                value={options.replaceSpaces}
                onChange={(e) => setOptions({ ...options, replaceSpaces: e.target.value })}
                className="px-3 py-1 bg-background border border-border rounded-lg text-text-primary text-sm"
              >
                <option value="-">Hyphen (-)</option>
                <option value="_">Underscore (_)</option>
              </select>
            </div>
          </div>
        </div>

        {slug && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Generated Slug</h3>
            <div className="flex items-center gap-3">
              <code className="flex-1 p-4 bg-background rounded-xl text-text-primary font-mono break-all">
                {slug}
              </code>
              <button
                onClick={handleCopy}
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-surface-elevated border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Try these examples</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((text, index) => (
              <button
                key={index}
                onClick={() => setInput(text)}
                className="px-4 py-2 bg-background hover:bg-primary/20 border border-border hover:border-primary/50 rounded-lg text-sm text-text-secondary hover:text-primary transition-colors"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
