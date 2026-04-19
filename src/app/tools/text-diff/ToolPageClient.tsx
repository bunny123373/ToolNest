'use client';

import { useState, useMemo } from 'react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber: { old?: number; new?: number };
}

export default function ToolPageClient() {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');

  const diff = useMemo((): DiffLine[] => {
    if (!oldText && !newText) return [];
    
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const result: DiffLine[] = [];
    
    const lcs: number[][] = Array(oldLines.length + 1).fill(null).map(() => 
      Array(newLines.length + 1).fill(0)
    );
    
    for (let i = 1; i <= oldLines.length; i++) {
      for (let j = 1; j <= newLines.length; j++) {
        if (oldLines[i - 1] === newLines[j - 1]) {
          lcs[i][j] = lcs[i - 1][j - 1] + 1;
        } else {
          lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
        }
      }
    }
    
    let i = oldLines.length;
    let j = newLines.length;
    const diffLines: DiffLine[] = [];
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
        diffLines.unshift({
          type: 'unchanged',
          content: oldLines[i - 1],
          lineNumber: { old: i, new: j }
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
        diffLines.unshift({
          type: 'added',
          content: newLines[j - 1],
          lineNumber: { new: j }
        });
        j--;
      } else if (i > 0) {
        diffLines.unshift({
          type: 'removed',
          content: oldLines[i - 1],
          lineNumber: { old: i }
        });
        i--;
      }
    }
    
    return diffLines;
  }, [oldText, newText]);

  const stats = useMemo(() => {
    const added = diff.filter(d => d.type === 'added').length;
    const removed = diff.filter(d => d.type === 'removed').length;
    const unchanged = diff.filter(d => d.type === 'unchanged').length;
    return { added, removed, unchanged };
  }, [diff]);

  const clearAll = () => {
    setOldText('');
    setNewText('');
  };

  const copyDiff = async () => {
    const text = diff.map(d => {
      const prefix = d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' ';
      return `${prefix} ${d.content}`;
    }).join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert('Failed to copy');
    }
  };

  const sampleOld = `function greet(name) {
  return "Hello, " + name;
}`;

  const sampleNew = `function greet(name) {
  return "Hello, " + name + "!";
  console.log("Greeting sent");
}`;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Text Diff</h1>
          <p className="text-text-secondary">Compare two texts and see the differences</p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => { setOldText(sampleOld); setNewText(sampleNew); }}
            className="px-4 py-2 bg-surface-elevated text-text-secondary hover:text-text-primary rounded-lg transition-all text-sm"
          >
            Load Sample
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-surface-elevated text-text-secondary hover:text-text-primary rounded-lg transition-all text-sm"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-text-primary font-medium">Original Text</label>
            <textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="Paste original text here..."
              className="w-full h-64 px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-text-primary font-medium">New Text</label>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Paste new text here..."
              className="w-full h-64 px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none font-mono text-sm"
            />
          </div>
        </div>

        {diff.length > 0 && (
          <>
            <div className="flex justify-center gap-6 mb-6">
              <span className="text-success font-medium">+{stats.added} added</span>
              <span className="text-error font-medium">-{stats.removed} removed</span>
              <span className="text-text-secondary">{stats.unchanged} unchanged</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-text-primary font-medium">Diff Result</label>
                <button onClick={copyDiff} className="text-text-secondary hover:text-text-primary text-sm">
                  Copy Diff
                </button>
              </div>
              <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden font-mono text-sm">
                {diff.map((line, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-1 flex ${
                      line.type === 'added'
                        ? 'bg-success/20 text-success'
                        : line.type === 'removed'
                        ? 'bg-error/20 text-error'
                        : 'text-text-secondary'
                    }`}
                  >
                    <span className="w-16 text-text-secondary opacity-50 select-none">
                      {line.lineNumber.old || line.lineNumber.new || ''}
                    </span>
                    <span className="w-6 text-center">
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    <span>{line.content || ' '}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}