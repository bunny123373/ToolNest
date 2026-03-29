'use client';

import { useState } from 'react';

interface ParsedMarkdown {
  html: string;
}

function parseMarkdown(text: string): string {
  let html = text
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-text-primary mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-text-primary mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-text-primary mt-6 mb-4">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code class="px-2 py-1 bg-background rounded text-sm font-mono text-primary">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener">$1</a>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-text-secondary">$1</li>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic text-text-secondary my-2">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="text-text-secondary mb-4">')
    .replace(/\n/g, '<br />');

  html = `<p class="text-text-secondary mb-4">${html}</p>`;
  html = html.replace(/<p class="text-text-secondary mb-4"><\/p>/g, '');
  
  return html;
}

export default function ToolPageClient() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Preview

This is a **real-time** Markdown editor. Start typing to see your content transform!

## Features

- *Italic* and **bold** text
- Code snippets: \`const greeting = "Hello!"\`
- Links and lists
- Blockquotes

> "The best way to predict the future is to create it."

## Try it yourself!

Edit the text on the left and watch it transform on the right.`);
  const [preview, setPreview] = useState('');

  const handlePreview = () => {
    setPreview(parseMarkdown(markdown));
  };

  const exampleTemplates = [
    { name: 'Documentation', content: '# API Documentation\n\n## Endpoints\n\n- GET /users\n- POST /users\n\n```javascript\nfetch("/api/users")\n  .then(res => res.json())\n  .then(data => console.log(data));\n```' },
    { name: 'README', content: '# Project Name\n\n> A short description of your amazing project.\n\n## Installation\n\n\`\`\`bash\nnpm install my-project\n\`\`\`\n\n## Usage\n\n\`\`\`javascript\nimport { coolFeature } from "my-project";\ncoolFeature();\n\`\`\`' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Markdown Preview</h1>
          <p className="text-text-secondary">Write Markdown and see it rendered in real-time</p>
        </div>

        <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
          {exampleTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => setMarkdown(template.content)}
              className="px-4 py-2 bg-surface-elevated border border-border hover:border-primary/50 rounded-lg text-sm text-text-secondary hover:text-primary whitespace-nowrap transition-colors"
            >
              {template.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Markdown</h3>
              <button
                onClick={handlePreview}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm rounded-lg transition-colors"
              >
                Render
              </button>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-96 px-4 py-3 bg-background border border-border rounded-xl text-text-primary font-mono text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Preview</h3>
            <div 
              className="w-full h-96 overflow-y-auto px-4 py-3 bg-background border border-border rounded-xl prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
