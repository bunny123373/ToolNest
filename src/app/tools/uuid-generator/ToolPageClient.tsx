'use client';

import { useState } from 'react';

interface UUIDVersion {
  version: string;
  label: string;
  generator: () => string;
}

const uuidVersions: UUIDVersion[] = [
  { version: 'v4', label: 'Random (v4)', generator: () => crypto.randomUUID() },
  { version: 'v1', label: 'Timestamp (v1)', generator: () => generateV1() },
];

function generateV1(): string {
  const template = 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx';
  return template.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateMultiple(count: number, generator: () => string): string[] {
  return Array.from({ length: count }, generator);
}

export default function ToolPageClient() {
  const [uuidList, setUuidList] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState('v4');
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const generator = uuidVersions.find((v) => v.version === selectedVersion)?.generator;
    if (generator) {
      setUuidList(generateMultiple(count, generator));
    }
  };

  const handleCopy = async (uuid: string) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(uuidList.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🔑</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">UUID Generator</h1>
          <p className="text-text-secondary">Generate unique identifiers instantly</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm text-text-secondary mb-2">Version</label>
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary"
              >
                {uuidVersions.map((v) => (
                  <option key={v.version} value={v.version}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-text-secondary mb-2">Quantity</label>
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="w-full px-8 py-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
          >
            Generate UUID{count > 1 ? 's' : ''}
          </button>
        </div>

        {uuidList.length > 0 && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Generated UUID{count > 1 ? 's' : ''}</h3>
              <button
                onClick={handleCopyAll}
                className="px-4 py-2 text-sm bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
              >
                {copied ? 'Copied!' : 'Copy All'}
              </button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {uuidList.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background rounded-lg group"
                >
                  <code className="text-sm text-text-primary font-mono">{uuid}</code>
                  <button
                    onClick={() => handleCopy(uuid)}
                    className="opacity-0 group-hover:opacity-100 px-3 py-1 text-xs bg-primary/20 hover:bg-primary/30 text-primary rounded transition-opacity"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">How to use</h2>
          <ol className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <span>Select the UUID version you need</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <span>Choose how many UUIDs to generate</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <span>Click Generate and copy your UUIDs</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
