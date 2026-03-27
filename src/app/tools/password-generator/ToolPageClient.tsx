'use client';

import { useState, useCallback, useEffect } from 'react';

interface GeneratorConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function ToolPageClient() {
  const [config, setConfig] = useState<GeneratorConfig>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (config.includeUppercase) charset += UPPERCASE;
    if (config.includeLowercase) charset += LOWERCASE;
    if (config.includeNumbers) charset += NUMBERS;
    if (config.includeSymbols) charset += SYMBOLS;

    if (!charset) {
      setPassword('Select at least one option');
      return;
    }

    let result = '';
    for (let i = 0; i < config.length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    setPassword(result);
  }, [config]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Failed to copy');
    }
  };

  const updateConfig = (key: keyof GeneratorConfig, value: boolean | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Password Generator</h1>
          <p className="text-text-secondary">Generate secure random passwords</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 px-5 py-4 bg-surface border border-border rounded-xl">
              <p className="text-2xl font-mono text-text-primary break-all">{password}</p>
            </div>
            <button
              onClick={generatePassword}
              className="p-4 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all hover:shadow-glow"
              title="Generate new password"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full px-6 py-3 bg-surface-hover hover:bg-surface-elevated text-text-primary font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6">
          <h3 className="text-text-primary font-semibold mb-6">Options</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-text-primary">Password Length</label>
                <span className="text-primary font-medium">{config.length}</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={config.length}
                onChange={(e) => updateConfig('length', parseInt(e.target.value))}
                className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-text-secondary text-sm mt-1">
                <span>8</span>
                <span>64</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeUppercase}
                  onChange={(e) => updateConfig('includeUppercase', e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-surface text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-text-primary">Uppercase (A-Z)</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeLowercase}
                  onChange={(e) => updateConfig('includeLowercase', e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-surface text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-text-primary">Lowercase (a-z)</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeNumbers}
                  onChange={(e) => updateConfig('includeNumbers', e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-surface text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-text-primary">Numbers (0-9)</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeSymbols}
                  onChange={(e) => updateConfig('includeSymbols', e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-surface text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-text-primary">Symbols (!@#$%^&*)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Tips for strong passwords</h2>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="text-primary">•</span>
              <span>Use at least 12 characters for better security</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">•</span>
              <span>Mix uppercase, lowercase, numbers, and symbols</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">•</span>
              <span>Avoid common words and predictable patterns</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">•</span>
              <span>Use a unique password for each account</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}