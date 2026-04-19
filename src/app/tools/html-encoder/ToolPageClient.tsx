'use client';

import { useState } from 'react';

type Mode = 'encode' | 'decode';

export default function ToolPageClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        const encoded = input
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
        setOutput(encoded);
      } else {
        const decoded = input
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'");
        setOutput(decoded);
      }
    } catch {
      setOutput('Error: Invalid input');
    }
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🏷️</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">HTML Encoder/Decoder</h1>
          <p className="text-text-secondary">Encode or decode HTML entities instantly</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('encode')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                mode === 'encode'
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-secondary hover:bg-primary/20'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                mode === 'decode'
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-secondary hover:bg-primary/20'
              }`}
            >
              Decode
            </button>
          </div>

          <label className="block text-sm text-text-secondary mb-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '<script>alert("XSS")</script>' : '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'}
            className="w-full h-32 px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none font-mono text-sm"
          />

          <div className="flex justify-center my-4">
            <button
              onClick={handleProcess}
              className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
            >
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </button>
          </div>

          <label className="block text-sm text-text-secondary mb-2">Output</label>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="w-full h-32 px-4 py-3 bg-background border border-border rounded-xl text-text-primary resize-none font-mono text-sm"
            />
            {output && (
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm rounded-lg transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="flex items-center gap-2 px-6 py-3 bg-surface-elevated border border-border hover:border-primary/50 rounded-xl text-text-secondary hover:text-primary transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Swap Input/Output
          </button>
        </div>
      </div>
    </div>
  );
}
