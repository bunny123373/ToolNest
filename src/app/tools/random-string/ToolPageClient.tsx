'use client';

import { useState, useCallback } from 'react';

export default function ToolPageClient() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [customChars, setCustomChars] = useState('');
  const [generatedStrings, setGeneratedStrings] = useState<string[]>(['']);
  const [count, setCount] = useState(1);

  const generateStrings = useCallback(() => {
    let charset = '';
    
    if (customChars.trim()) {
      charset = customChars;
    } else {
      const uppercase = excludeAmbiguous ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercase = excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
      const numbers = excludeAmbiguous ? '23456789' : '0123456789';
      const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      if (includeUppercase) charset += uppercase;
      if (includeLowercase) charset += lowercase;
      if (includeNumbers) charset += numbers;
      if (includeSymbols) charset += symbols;
    }

    if (!charset) {
      alert('Please select at least one character type');
      return;
    }

    const strings: string[] = [];
    const array = new Uint32Array(length * count);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < count; i++) {
      let result = '';
      for (let j = 0; j < length; j++) {
        result += charset[array[i * length + j] % charset.length];
      }
      strings.push(result);
    }
    
    setGeneratedStrings(strings);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous, customChars, count]);

  const copyString = async (str: string) => {
    try {
      await navigator.clipboard.writeText(str);
    } catch {
      alert('Failed to copy');
    }
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(generatedStrings.join('\n'));
    } catch {
      alert('Failed to copy');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🎲</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Random String Generator</h1>
          <p className="text-text-secondary">Generate random strings with custom patterns</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-text-primary font-medium block mb-2">Length: {length}</label>
                <input
                  type="range"
                  min="1"
                  max="128"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <label className="text-text-primary font-medium block mb-2">Count: {count}</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="excludeAmbiguous"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="excludeAmbiguous" className="text-text-secondary">
                  Exclude ambiguous characters (0, O, l, 1, I)
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-text-primary font-medium">Character Types</span>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="uppercase"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="uppercase" className="text-text-secondary">Uppercase (A-Z)</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="lowercase"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="lowercase" className="text-text-secondary">Lowercase (a-z)</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="numbers"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="numbers" className="text-text-secondary">Numbers (0-9)</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="symbols"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="symbols" className="text-text-secondary">Symbols (!@#$%...)</label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-text-primary font-medium block mb-2">Custom Characters (optional)</label>
            <input
              type="text"
              value={customChars}
              onChange={(e) => setCustomChars(e.target.value)}
              placeholder="Leave empty to use character types above"
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
            />
          </div>

          <button
            onClick={generateStrings}
            className="w-full mt-6 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
          >
            Generate
          </button>
        </div>

        {generatedStrings[0] && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-text-primary font-medium">Generated Strings</label>
              <button onClick={copyAll} className="text-text-secondary hover:text-text-primary text-sm">
                Copy All
              </button>
            </div>
            
            <div className="space-y-2">
              {generatedStrings.map((str, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary font-mono text-sm break-all">
                    {str}
                  </code>
                  <button
                    onClick={() => copyString(str)}
                    className="p-2 text-text-secondary hover:text-primary transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}