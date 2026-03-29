'use client';

import { useState } from 'react';

export default function ToolPageClient() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    setCsvOutput('');

    if (!jsonInput.trim()) {
      setError('Please enter JSON data');
      return;
    }

    try {
      const data = JSON.parse(jsonInput);

      if (!Array.isArray(data)) {
        setError('JSON must be an array of objects');
        return;
      }

      if (data.length === 0) {
        setError('JSON array is empty');
        return;
      }

      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map((row: Record<string, unknown>) =>
          headers
            .map((header) => {
              const value = row[header];
              if (value === null || value === undefined) return '';
              const stringValue = String(value);
              if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
              }
              return stringValue;
            })
            .join(',')
        ),
      ];

      setCsvOutput(csvRows.join('\n'));
    } catch {
      setError('Invalid JSON format. Please check your input.');
    }
  };

  const handleCopy = async () => {
    if (csvOutput) {
      await navigator.clipboard.writeText(csvOutput);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([csvOutput], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exampleJson = `[
  {"name": "John", "email": "john@example.com", "age": 30},
  {"name": "Jane", "email": "jane@example.com", "age": 25}
]`;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">JSON to CSV Converter</h1>
          <p className="text-text-secondary">Convert JSON arrays to CSV format</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">JSON Input</h3>
              <button
                onClick={() => setJsonInput(exampleJson)}
                className="text-sm text-primary hover:underline"
              >
                Load example
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[{"key": "value"}, ...]'
              className="w-full h-64 px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none font-mono text-sm"
            />
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">CSV Output</h3>
              {csvOutput && (
                <button
                  onClick={handleCopy}
                  className="text-sm text-primary hover:underline"
                >
                  Copy
                </button>
              )}
            </div>
            <textarea
              value={csvOutput}
              readOnly
              placeholder="CSV output will appear here..."
              className="w-full h-64 px-4 py-3 bg-background border border-border rounded-xl text-text-primary resize-none font-mono text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-error/20 border border-error/50 rounded-xl text-error">
            {error}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleConvert}
            className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
          >
            Convert to CSV
          </button>
          {csvOutput && (
            <button
              onClick={handleDownload}
              className="px-8 py-4 bg-success hover:bg-success/80 text-white font-medium rounded-xl transition-all"
            >
              Download CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
