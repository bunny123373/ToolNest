'use client';

import { useState, useCallback } from 'react';

type Mode = 'encode' | 'decode';

export default function ToolPageClient() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const processText = useCallback((text: string, selectedMode: Mode) => {
    setError('');
    if (!text.trim()) {
      setOutput('');
      return;
    }

    try {
      if (selectedMode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch {
      setError(selectedMode === 'decode' ? 'Invalid Base64 string' : 'Failed to encode');
      setOutput('');
    }
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);
    processText(value, mode);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setOutput('');
    setError('');
    if (input) {
      processText(input, newMode);
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      alert('Failed to copy');
    }
  };

  const swapInputOutput = () => {
    const newMode: Mode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    processText(output, newMode);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🔤</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Base64 Encoder/Decoder</h1>
          <p className="text-text-secondary">Encode and decode Base64 strings</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => handleModeChange('encode')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              mode === 'encode'
                ? 'bg-primary text-white'
                : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => handleModeChange('decode')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              mode === 'decode'
                ? 'bg-primary text-white'
                : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
            }`}
          >
            Decode
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-text-primary font-medium">Input</label>
              <button onClick={clearAll} className="text-text-secondary hover:text-text-primary text-sm">
                Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
              className="w-full h-64 px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-text-primary font-medium">Output</label>
              <button onClick={swapInputOutput} className="text-text-secondary hover:text-text-primary text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Swap
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-64 px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary resize-none font-mono text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-center">
            {error}
          </div>
        )}

        {output && (
          <div className="flex justify-center">
            <button
              onClick={copyOutput}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Output
            </button>
          </div>
        )}
      </div>
    </div>
  );
}