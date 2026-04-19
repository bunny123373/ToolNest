'use client';

import { useState, useCallback, FormEvent } from 'react';

interface ShortenedUrl {
  original: string;
  short: string;
}

export default function ToolPageClient() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [isShortening, setIsShortening] = useState(false);

  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const shortenUrl = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setShortenedUrl(null);

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setIsShortening(true);
    
    // Simulate API call - in production, integrate with a URL shortening service
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Generate a simple short code (in production, use actual shortener API)
    const shortCode = Math.random().toString(36).substring(2, 8);
    const shortUrl = `https://tn.io/${shortCode}`;
    
    setShortenedUrl({
      original: url,
      short: shortUrl,
    });
    
    setIsShortening(false);
  }, [url]);

  const copyShortUrl = async () => {
    if (!shortenedUrl) return;
    try {
      await navigator.clipboard.writeText(shortenedUrl.short);
    } catch {
      alert('Failed to copy');
    }
  };

  const reset = () => {
    setUrl('');
    setShortenedUrl(null);
    setError('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🔗</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">URL Shortener</h1>
          <p className="text-text-secondary">Shorten long URLs instantly</p>
        </div>

        <form onSubmit={shortenUrl} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter long URL (e.g., https://example.com/very/long/url)"
              className="flex-1 px-5 py-4 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="submit"
              disabled={isShortening}
              className="px-8 py-4 bg-primary hover:bg-primary-hover disabled:bg-surface-hover text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center justify-center gap-2"
            >
              {isShortening ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Shortening...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Shorten
                </>
              )}
            </button>
          </div>
          {error && <p className="mt-3 text-error text-sm">{error}</p>}
        </form>

        {shortenedUrl && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 animate-fade-in">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-xl font-bold text-text-primary">URL Shortened!</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-text-secondary text-sm mb-1">Original URL</p>
                <p className="text-text-primary bg-surface p-3 rounded-lg break-all text-sm">{shortenedUrl.original}</p>
              </div>
              
              <div>
                <p className="text-text-secondary text-sm mb-1">Short URL</p>
                <div className="flex gap-2">
                  <p className="flex-1 text-primary bg-surface p-3 rounded-lg break-all font-medium">{shortenedUrl.short}</p>
                  <button
                    onClick={copyShortUrl}
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-all"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full mt-6 px-6 py-3 bg-surface-hover hover:bg-surface-elevated text-text-primary font-medium rounded-xl transition-all"
            >
              Shorten Another URL
            </button>
          </div>
        )}

        <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">How it works</h2>
          <ol className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <span>Paste your long URL in the input field</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <span>Click the Shorten button</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <span>Copy your shortened URL and use it anywhere</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}