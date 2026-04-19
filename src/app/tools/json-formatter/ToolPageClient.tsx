'use client';

import { useState, useCallback } from 'react';

type FormatType = 'format' | 'minify' | 'validate';

export default function ToolPageClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [formatType, setFormatType] = useState<FormatType>('format');

  const processJson = useCallback((text: string, type: FormatType) => {
    setError('');
    if (!text.trim()) {
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(text);
      
      if (type === 'format') {
        setOutput(JSON.stringify(parsed, null, 2));
      } else if (type === 'minify') {
        setOutput(JSON.stringify(parsed));
      } else {
        setOutput('Valid JSON ✓');
      }
    } catch (err) {
      if (type === 'validate') {
        setOutput('');
      }
      setError(`Invalid JSON: ${err instanceof Error ? err.message : 'Unknown error'}`);
      if (type !== 'validate') {
        setOutput('');
      }
    }
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);
    processJson(value, formatType);
  };

  const handleTypeChange = (type: FormatType) => {
    setFormatType(type);
    if (input) {
      processJson(input, type);
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

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const sampleJson = '{"name":"ToolNest","tools":6,"free":true}';

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">JSON Formatter</h1>
          <p className="text-text-secondary">Format, validate, and minify JSON</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {(['format', 'minify', 'validate'] as FormatType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-6 py-2 rounded-lg font-medium transition-all capitalize ${
                formatType === type
                  ? 'bg-primary text-white'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-text-primary font-medium">Input JSON</label>
              <button 
                onClick={() => handleInputChange(sampleJson)} 
                className="text-text-secondary hover:text-text-primary text-sm"
              >
                Sample
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder='{"key": "value"}'
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

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-center">
            {error}
          </div>
        )}

        {output && formatType !== 'validate' && (
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