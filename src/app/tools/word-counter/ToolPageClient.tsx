'use client';

import { useState, useMemo, ChangeEvent } from 'react';

interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
}

export default function ToolPageClient() {
  const [text, setText] = useState('');

  const stats: TextStats = useMemo(() => {
    if (!text.trim()) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
      };
    }

    const words = text.trim().split(/\s+/).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = (text.match(/[.!?]+/g) || []).length || (text.trim() ? 1 : 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);
    const readingTime = Math.ceil(words / 200);

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime,
    };
  }, [text]);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const clearText = () => {
    setText('');
  };

  const copyStats = async () => {
    const statsText = `Words: ${stats.words}
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading time: ${stats.readingTime} min`;
    
    try {
      await navigator.clipboard.writeText(statsText);
      alert('Statistics copied to clipboard!');
    } catch {
      alert('Failed to copy');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Word Counter</h1>
          <p className="text-text-secondary">Count words, characters, sentences, and more</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-surface-elevated border border-border rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.words}</p>
            <p className="text-text-secondary text-sm">Words</p>
          </div>
          <div className="bg-surface-elevated border border-border rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.characters}</p>
            <p className="text-text-secondary text-sm">Characters</p>
          </div>
          <div className="bg-surface-elevated border border-border rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.charactersNoSpaces}</p>
            <p className="text-text-secondary text-sm">No Spaces</p>
          </div>
          <div className="bg-surface-elevated border border-border rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.sentences}</p>
            <p className="text-text-secondary text-sm">Sentences</p>
          </div>
          <div className="bg-surface-elevated border border-border rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.paragraphs}</p>
            <p className="text-text-secondary text-sm">Paragraphs</p>
          </div>
          <div className="bg-surface-elevated border border-border rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.readingTime}</p>
            <p className="text-text-secondary text-sm">Min Read</p>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Paste or type your text here..."
            className="w-full h-64 px-5 py-4 bg-surface-elevated border border-border rounded-2xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />
          {text && (
            <button
              onClick={clearText}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {text && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={copyStats}
              className="px-6 py-3 bg-surface-elevated hover:bg-surface-hover border border-border text-text-primary font-medium rounded-xl transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Statistics
            </button>
          </div>
        )}

        <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <h2 className="text-lg font-semibold text-text-primary mb-4">How it works</h2>
          <p className="text-text-secondary">
            Simply paste or type your text in the box above. The word counter automatically 
            calculates the number of words, characters, sentences, and paragraphs. 
            It also estimates the reading time based on an average reading speed of 200 words per minute.
          </p>
        </div>
      </div>
    </div>
  );
}