'use client';

import { useState, useCallback } from 'react';

type Mode = 'encode' | 'decode';

export default function ToolPageClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [component, setComponent] = useState(true);
  const [error, setError] = useState('');

  const processUrl = useCallback(() => {
    setError('');
    setOutput('');
    
    if (!input.trim()) return;
    
    try {
      if (mode === 'encode') {
        if (component) {
          setOutput(encodeURIComponent(input));
        } else {
          setOutput(encodeURI(input));
        }
      } else {
        if (component) {
          setOutput(decodeURIComponent(input));
        } else {
          setOutput(decodeURI(input));
        }
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [input, mode, component]);

  const swapInputOutput = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      alert('Failed to copy');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const sampleUrls = [
    'https://example.com/search?q=hello world&lang=en',
    'Hello World!',
    'price=$100&name=John Doe',
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🔗</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">URL Encoder/Decoder</h1>
          <p className="text-text-secondary">Encode and decode URL components safely</p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('encode')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                mode === 'encode'
                  ? 'bg-primary text-white'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                mode === 'decode'
                  ? 'bg-primary text-white'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
              }`}
            >
              Decode
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="component"
              checked={component}
              onChange={(e) => setComponent(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="component" className="text-text-secondary text-sm">
              Component (encodes more characters)
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-text-primary font-medium">Input</label>
              <button 
                onClick={() => setInput(sampleUrls[0])} 
                className="text-text-secondary hover:text-text-primary text-sm"
              >
                Sample
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter URL or text here..."
              className="w-full h-64 px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-text-primary font-medium">Output</label>
              <button onClick={clearAll} className="text-text-secondary hover:text-text-primary text-sm">
                Clear
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="w-full h-64 px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary resize-none font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={processUrl}
            className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
          >
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
          
          {output && (
            <button
              onClick={swapInputOutput}
              className="px-4 py-3 bg-surface-elevated text-text-secondary hover:text-text-primary rounded-xl transition-all"
              title="Swap input and output"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          )}
          
          {output && (
            <button
              onClick={copyOutput}
              className="px-6 py-3 bg-surface-elevated text-text-secondary hover:text-text-primary rounded-xl transition-all"
            >
              Copy
            </button>
          )}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}