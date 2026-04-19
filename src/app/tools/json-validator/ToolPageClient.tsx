'use client';

import { useState } from 'react';

export default function ToolPageClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);

  const validate = () => {
    if (!input.trim()) {
      setResult({ valid: false, message: 'Please enter JSON to validate' });
      return;
    }
    try {
      JSON.parse(input);
      setResult({ valid: true, message: 'Valid JSON!' });
    } catch (e) {
      setResult({ valid: false, message: (e as Error).message });
    }
  };

  const formatInput = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setResult({ valid: true, message: 'Formatted successfully' });
    } catch {
      setResult({ valid: false, message: 'Cannot format invalid JSON' });
    }
  };

  const minifyInput = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setResult({ valid: true, message: 'Minified successfully' });
    } catch {
      setResult({ valid: false, message: 'Cannot minify invalid JSON' });
    }
  };

  const clear = () => {
    setInput('');
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <label className="text-text-secondary">Enter JSON:</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "示例", "value": 123}'
          className="w-full h-64 px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary font-mono text-sm focus:outline-none focus:border-primary resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={validate}
          className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          Validate
        </button>
        <button
          onClick={formatInput}
          className="flex-1 py-3 bg-surface-elevated border border-border text-text-primary rounded-xl font-medium hover:bg-border transition-colors"
        >
          Format
        </button>
        <button
          onClick={minifyInput}
          className="flex-1 py-3 bg-surface-elevated border border-border text-text-primary rounded-xl font-medium hover:bg-border transition-colors"
        >
          Minify
        </button>
        <button
          onClick={clear}
          className="px-4 py-3 bg-surface-elevated border border-border text-text-secondary rounded-xl font-medium hover:text-text-primary transition-colors"
        >
          Clear
        </button>
      </div>

      {result && (
        <div className={`p-4 rounded-xl ${result.valid ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
}