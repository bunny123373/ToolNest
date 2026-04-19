'use client';

import { useState } from 'react';

export default function ToolPageClient() {
  const [timestamp, setTimestamp] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [mode, setMode] = useState<'toDate' | 'toTimestamp'>('toDate');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(Date.now());

  const handleNow = () => {
    setCurrentTimestamp(Date.now());
    const now = new Date();
    setDateStr(now.toISOString());
    setTimestamp(Math.floor(now.getTime() / 1000).toString());
  };

  const convert = () => {
    setError(null);
    setResult(null);
    try {
      if (mode === 'toDate') {
        const ts = parseInt(timestamp);
        if (isNaN(ts)) throw new Error('Invalid timestamp');
        const date = new Date(ts * 1000);
        setResult(date.toLocaleString() + '\n' + date.toISOString());
      } else {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) throw new Error('Invalid date');
        setResult(Math.floor(date.getTime() / 1000).toString());
      }
    } catch {
      setError('Invalid input. Please check your value.');
    }
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
    } catch {
      setError('Failed to copy');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => { setMode('toDate'); setResult(null); setError(null); }}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            mode === 'toDate' ? 'bg-primary text-white' : 'bg-surface-elevated text-text-secondary'
          }`}
        >
          Timestamp → Date
        </button>
        <button
          onClick={() => { setMode('toTimestamp'); setResult(null); setError(null); }}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            mode === 'toTimestamp' ? 'bg-primary text-white' : 'bg-surface-elevated text-text-secondary'
          }`}
        >
          Date → Timestamp
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleNow}
          className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          Use Current Time
        </button>
      </div>

      {mode === 'toDate' ? (
        <div className="space-y-2">
          <label className="text-text-secondary">Enter Unix Timestamp:</label>
          <input
            type="number"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="e.g., 1713484800"
            className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-text-secondary">Enter Date:</label>
          <input
            type="datetime-local"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary"
          />
        </div>
      )}

      <button
        onClick={convert}
        className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
      >
        Convert
      </button>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="p-4 bg-surface-elevated border border-border rounded-xl">
            <p className="text-text-secondary text-xs mb-2">Result:</p>
            <p className="text-text-primary font-mono whitespace-pre-wrap">{result}</p>
          </div>
          <button
            onClick={copyResult}
            className="w-full py-3 bg-surface-elevated border border-border text-text-primary rounded-xl font-medium hover:bg-border transition-colors"
          >
            Copy Result
          </button>
        </div>
      )}
    </div>
  );
}