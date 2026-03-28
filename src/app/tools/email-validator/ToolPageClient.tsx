'use client';

import { useState } from 'react';

interface ValidationResult {
  email: string;
  isValid: boolean;
  issues: string[];
  score: number;
}

function validateEmail(email: string): ValidationResult {
  const issues: string[] = [];
  let score = 100;

  if (!email) {
    return { email, isValid: false, issues: ['Email is required'], score: 0 };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    issues.push('Invalid email format');
    score -= 50;
  }

  const [local, domain] = email.split('@');

  if (local.length > 64) {
    issues.push('Local part too long (max 64 characters)');
    score -= 15;
  }

  if (domain.length > 255) {
    issues.push('Domain part too long (max 255 characters)');
    score -= 15;
  }

  if (local.startsWith('.') || local.endsWith('.')) {
    issues.push('Local part cannot start or end with a dot');
    score -= 20;
  }

  if (local.includes('..')) {
    issues.push('Local part contains consecutive dots');
    score -= 20;
  }

  if (!domain.includes('.')) {
    issues.push('Domain must have at least one dot');
    score -= 25;
  }

  if (domain.startsWith('.') || domain.endsWith('.')) {
    issues.push('Domain cannot start or end with a dot');
    score -= 20;
  }

  const disposableDomains = ['tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com'];
  if (disposableDomains.some((d) => domain.toLowerCase().includes(d))) {
    issues.push('Disposable email domain detected');
    score -= 10;
  }

  const commonTypos = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'hotmial.com': 'hotmail.com' };
  const typoSuggestion = Object.entries(typos).find(([typo]) => domain.toLowerCase().includes(typo));
  if (typoSuggestion) {
    issues.push(`Did you mean ${typoSuggestion[1]}?`);
    score -= 5;
  }

  const isValid = issues.length === 0 || score >= 70;

  return { email, isValid, issues, score: Math.max(0, score) };
}

export default function ToolPageClient() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = () => {
    if (email.trim()) {
      setResult(validateEmail(email.trim()));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-success/20';
    if (score >= 70) return 'bg-warning/20';
    return 'bg-error/20';
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Email Validator</h1>
          <p className="text-text-secondary">Check if an email address is valid</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
              placeholder="Enter email address to validate..."
              className="flex-1 px-5 py-4 bg-background border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleValidate}
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
            >
              Validate
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getScoreBg(result.score)}`}>
                <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                </span>
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${result.isValid ? 'text-success' : 'text-error'}`}>
                  {result.isValid ? 'Valid Email' : 'Invalid Email'}
                </h3>
                <p className="text-text-secondary text-sm">Score: {result.score}/100</p>
              </div>
            </div>

            {result.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-text-primary font-medium">Issues found:</h4>
                {result.issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-background rounded-lg">
                    <svg className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-text-secondary">{issue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">What we check</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <span className="text-success">✓</span>
              <span className="text-text-secondary">Basic format validation</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <span className="text-success">✓</span>
              <span className="text-text-secondary">Length limits</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <span className="text-success">✓</span>
              <span className="text-text-secondary">Domain structure</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <span className="text-success">✓</span>
              <span className="text-text-secondary">Common typo detection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
