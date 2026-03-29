'use client';

import { useState, useCallback, useMemo } from 'react';

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'neque', 'porro',
  'quisquam', 'nihil', 'impedit', 'quo', 'minus', 'quod', 'maxime', 'placeat',
  'facere', 'possimus', 'omnis', 'voluptas', 'assumenda', 'repellendus',
  'temporibus', 'autem', 'quibusdam', 'officiis', 'debitis', 'aut', 'rerum',
  'necessitatibus', 'saepe', 'eveniet', 'voluptates', 'repudiandae', 'sint',
  'molestiae', 'recusandae', 'itaque', 'earum', 'hic', 'tenetur', 'sapiente',
  'delectus', 'reiciendis', 'voluptatibus', 'maiores', 'alias', 'perferendis',
  'doloribus', 'asperiores', 'repellat', 'accusamus', 'inventore', 'veritatis',
  'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'explicabo', 'aspernatur',
  'odit', 'fugit', 'harum', 'quidem', 'rerum', 'facilis', 'expedita', 'distinctio',
  'nam', 'libero', 'tempore', 'cum', 'soluta', 'nobis', 'est', 'eligendi',
  'optio', 'cumque', 'nihil', 'impedit', 'quo', 'porro', 'quisquam', 'sed',
  'quibusdam', 'laudantium', 'totam', 'rem', 'earum', 'eaque', 'ipsa', 'quae',
  'ab', 'illo', 'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae',
  'dicta', 'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur',
  'aut', 'odit', 'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione',
  'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'nihil', 'impedit', 'quo',
  'minus', 'quod', 'sint', 'obcaecati', 'cupiditate', 'provident', 'similique',
  'mollitia', 'animi', 'perspiciatis', 'unde', 'omnis', 'iste', 'natus',
  'voluptatem', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
  'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
  'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
];

function generateLoremIpsum(count: number, type: 'words' | 'sentences' | 'paragraphs'): string {
  if (type === 'words') {
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(' ');
  }
  
  if (type === 'sentences') {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) {
      const wordCount = Math.floor(Math.random() * 10) + 8;
      const words: string[] = [];
      for (let j = 0; j < wordCount; j++) {
        words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      const sentence = words.join(' ');
      sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.');
    }
    return sentences.join(' ');
  }
  
  // paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    const sentenceCount = Math.floor(Math.random() * 4) + 3;
    const sentences: string[] = [];
    for (let j = 0; j < sentenceCount; j++) {
      const wordCount = Math.floor(Math.random() * 10) + 8;
      const words: string[] = [];
      for (let k = 0; k < wordCount; k++) {
        words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      const sentence = words.join(' ');
      sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.');
    }
    paragraphs.push(sentences.join(' '));
  }
  return paragraphs.join('\n\n');
}

interface GeneratorConfig {
  count: number;
  type: 'words' | 'sentences' | 'paragraphs';
}

export default function ToolPageClient() {
  const [config, setConfig] = useState<GeneratorConfig>({
    count: 5,
    type: 'paragraphs',
  });

  const output = useMemo(() => {
    return generateLoremIpsum(config.count, config.type);
  }, [config.count, config.type]);

  const handleCountChange = (value: number) => {
    setConfig((prev) => ({ ...prev, count: value }));
  };

  const handleTypeChange = (type: 'words' | 'sentences' | 'paragraphs') => {
    setConfig((prev) => ({ ...prev, type }));
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      alert('Failed to copy');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Lorem Ipsum Generator</h1>
          <p className="text-text-secondary">Generate placeholder text for your designs</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-text-primary font-medium mb-3 block">Type</label>
              <div className="flex gap-2">
                {(['words', 'sentences', 'paragraphs'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                      config.type === type
                        ? 'bg-primary text-white'
                        : 'bg-surface text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-text-primary font-medium mb-3 block">
                {config.type.charAt(0).toUpperCase() + config.type.slice(1)}: {config.count}
              </label>
              <input
                type="range"
                min={config.type === 'paragraphs' ? 1 : 5}
                max={config.type === 'paragraphs' ? 20 : 100}
                value={config.count}
                onChange={(e) => handleCountChange(parseInt(e.target.value))}
                className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center">
            <label className="text-text-primary font-medium">Generated Text</label>
            <button
              onClick={() => setConfig({ count: config.count, type: config.type })}
              className="text-text-secondary hover:text-text-primary text-sm"
            >
              Regenerate
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary resize-none"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={copyOutput}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}